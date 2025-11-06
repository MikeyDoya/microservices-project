const express = require('express');
const cors = require('cors');
const db = require('./db');
const Product = require('./models/product');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint with database connectivity test
app.get('/api/products/health', async (req, res) => {
  try {
    const dbConnected = await db.testConnection();
    
    const healthStatus = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'product-catalog-service',
      version: '1.0.0',
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
        type: 'MySQL'
      },
      uptime: process.uptime()
    };
    
    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      service: 'product-catalog-service',
      error: error.message
    });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = Product.getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const product = Product.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  try {
    // Validate required fields
    const { name, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name and price are required fields'
      });
    }
    
    const newProduct = Product.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Product Catalog Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/products/health`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/products/health`);
  console.log(`  GET    /api/products`);
  console.log(`  GET    /api/products/:id`);
  console.log(`  POST   /api/products`);
});

module.exports = app;
