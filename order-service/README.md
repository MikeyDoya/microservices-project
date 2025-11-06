# Order Management Service

A Spring Boot microservice for managing orders in the ECS Shoes application.

## Features

- RESTful API for order management
- MySQL database integration with JPA/Hibernate
- Health check endpoints
- Dockerized application
- AWS ECS ready

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Docker (optional)

## Building the Application

```bash
cd order-service
mvn clean package
```

## Running Locally

### With Maven
```bash
mvn spring-boot:run
```

### With Java
```bash
java -jar target/order-service-1.0.0.jar
```

### With Docker
```bash
docker build -t order-service .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=orderdb \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  order-service
```

## API Endpoints

### Health Check
- **GET** `/api/orders/health` - Service health status

### Order Management
- **GET** `/api/orders` - Get all orders
- **GET** `/api/orders/{id}` - Get order by ID
- **POST** `/api/orders` - Create a new order
- **PUT** `/api/orders/{id}` - Update an order
- **DELETE** `/api/orders/{id}` - Delete an order
- **GET** `/api/orders/status/{status}` - Get orders by status
- **GET** `/api/orders/customer/{customerName}` - Get orders by customer name

### Actuator Endpoints
- **GET** `/actuator/health` - Detailed health information

## Sample Request

### Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "productName": "Running Shoes",
    "quantity": 2,
    "totalPrice": 159.99,
    "status": "PENDING"
  }'
```

## Database Configuration

The service uses environment variables for database configuration:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_NAME` - Database name (default: orderdb)
- `DB_USER` - Database user (default: root)
- `DB_PASSWORD` - Database password (default: password)

## Database Schema

The application will automatically create the `orders` table with the following structure:

```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    total_price DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    order_date DATETIME NOT NULL
);
```

## Deployment to AWS ECS

This service is designed to run on AWS ECS Fargate. See the main repository documentation for deployment instructions.
