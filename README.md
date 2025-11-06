# Product Catalog Microservice

A Node.js Express microservice for managing product catalogs in the ECS Shoes application.

## Features

- RESTful API for product management
- MySQL database connection setup
- CORS support for cross-origin requests
- JSON parsing middleware
- Health check endpoint with database connectivity test
- Error handling middleware
- Sample product data model

## Technology Stack

- **Framework**: Express.js 4.18.2
- **Database**: MySQL (using mysql2 driver)
- **Node.js**: 16.x (Alpine Linux base image)

## API Endpoints

### Health Check
```
GET /api/products/health
```
Returns service health status including database connectivity.

**Response Example:**
```json
{
  "status": "UP",
  "timestamp": "2025-11-06T06:49:08.008Z",
  "service": "product-catalog-service",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "type": "MySQL"
  },
  "uptime": 20.003082547
}
```

### Get All Products
```
GET /api/products
```
Returns a list of all products.

**Response Example:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Get Specific Product
```
GET /api/products/{id}
```
Returns a specific product by ID.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Classic Running Shoes",
    "description": "Comfortable running shoes for daily training",
    "price": 79.99,
    "category": "Running",
    "brand": "ECS Sports",
    "size": [7, 8, 9, 10, 11, 12],
    "color": "Blue",
    "inStock": true,
    "imageUrl": "https://example.com/images/running-shoes-blue.jpg"
  }
}
```

### Create New Product
```
POST /api/products
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Soccer Cleats",
  "description": "Professional soccer cleats with enhanced traction",
  "price": 99.99,
  "category": "Soccer",
  "brand": "ECS Pro",
  "size": [7, 8, 9, 10, 11],
  "color": "Black",
  "inStock": true,
  "imageUrl": "https://example.com/images/soccer-cleats-black.jpg"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 6,
    "name": "Soccer Cleats",
    ...
  }
}
```

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm
- MySQL database (optional for basic functionality)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd ECS-Shoes-app
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables (optional):
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=shoes_db
export PORT=3000
```

4. Start the application:
```bash
npm start
```

The service will be available at `http://localhost:3000`

## Docker Deployment

### Build Docker Image
```bash
docker build -t ecs-shoes-product-service .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=shoes_db \
  ecs-shoes-product-service
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | MySQL database name | `shoes_db` |
| `NODE_ENV` | Environment mode | `development` |

## Project Structure

```
.
├── app.js              # Main Express application
├── db.js               # Database connection module
├── models/
│   └── product.js      # Product data model
├── package.json        # Dependencies and scripts
├── Dockerfile          # Docker configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Testing the API

You can test the API using curl commands:

```bash
# Health check
curl http://localhost:3000/api/products/health

# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/1

# Create new product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Shoe",
    "price": 89.99,
    "description": "A great new shoe",
    "category": "Running",
    "brand": "ECS Sports",
    "color": "Blue",
    "size": [8, 9, 10],
    "inStock": true
  }'
```

## Error Handling

The service implements comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: Database connection issues

## Architecture

This microservice is part of the ECS Shoes application - a cloud-native architecture deployed on AWS ECS Fargate with:
- Complete CI/CD pipeline
- Application Load Balancer (ALB)
- RDS database
- Auto-scaling capabilities

## License

MIT
