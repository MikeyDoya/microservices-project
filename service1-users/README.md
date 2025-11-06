# Service 1: Python Flask Users Microservice

## Overview
A RESTful API microservice built with Flask for managing users, designed to run on AWS ECS Fargate.

## Features
- **Framework**: Flask
- **Database**: MySQL
- **Port**: 5000
- **Container**: Docker-ready with health checks

## Endpoints

### Health Check
```
GET /health
```
Returns the service health status and database connectivity.

**Response Example:**
```json
{
  "status": "healthy",
  "service": "users-service",
  "database": "connected"
}
```

### Get All Users
```
GET /users
```
Returns a list of all users.

**Response Example:**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    }
  ]
}
```

### Create User
```
POST /users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Get User by ID
```
GET /users/{id}
```

**Response Example:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MYSQL_HOST | MySQL host address | localhost |
| MYSQL_USER | MySQL username | root |
| MYSQL_PASSWORD | MySQL password | password |
| MYSQL_DB | MySQL database name | users_db |
| MYSQL_PORT | MySQL port | 3306 |

## Database Setup

Create the users table in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS users_db;

USE users_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO users (username, email) VALUES 
    ('john_doe', 'john@example.com'),
    ('jane_smith', 'jane@example.com');
```

## Local Development

### Using Python directly
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MYSQL_HOST=localhost
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DB=users_db

# Run the application
python app.py
```

### Using Docker
```bash
# Build the Docker image
docker build -t users-service:latest .

# Run with environment variables
docker run -d -p 5000:5000 \
  -e MYSQL_HOST=your-mysql-host \
  -e MYSQL_USER=your-user \
  -e MYSQL_PASSWORD=your-password \
  -e MYSQL_DB=users_db \
  users-service:latest
```

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Get all users
curl http://localhost:5000/users

# Create a user
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@example.com"}'

# Get user by ID
curl http://localhost:5000/users/1
```

## Deployment to AWS ECS Fargate

1. Build and push Docker image to ECR
2. Create ECS task definition with environment variables
3. Configure health check endpoint: `/health`
4. Set container port: `5000`
5. Link to RDS MySQL instance via security groups

## Production Considerations

- The service uses Gunicorn with 2 workers for production
- Health checks run every 30 seconds
- Database connection pooling via flask-mysqldb
- All responses are in JSON format
- Error handling for database failures included
