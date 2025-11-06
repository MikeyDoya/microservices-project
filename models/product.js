const db = require('../db');

// Sample product data (in-memory storage for demonstration)
let products = [
  {
    id: 1,
    name: 'Classic Running Shoes',
    description: 'Comfortable running shoes for daily training',
    price: 79.99,
    category: 'Running',
    brand: 'ECS Sports',
    size: [7, 8, 9, 10, 11, 12],
    color: 'Blue',
    inStock: true,
    imageUrl: 'https://example.com/images/running-shoes-blue.jpg'
  },
  {
    id: 2,
    name: 'Professional Basketball Shoes',
    description: 'High-performance basketball shoes with excellent grip',
    price: 129.99,
    category: 'Basketball',
    brand: 'ECS Pro',
    size: [8, 9, 10, 11, 12, 13],
    color: 'Red',
    inStock: true,
    imageUrl: 'https://example.com/images/basketball-shoes-red.jpg'
  },
  {
    id: 3,
    name: 'Casual Sneakers',
    description: 'Stylish casual sneakers for everyday wear',
    price: 59.99,
    category: 'Casual',
    brand: 'ECS Style',
    size: [6, 7, 8, 9, 10, 11],
    color: 'White',
    inStock: true,
    imageUrl: 'https://example.com/images/casual-sneakers-white.jpg'
  },
  {
    id: 4,
    name: 'Trail Hiking Boots',
    description: 'Durable hiking boots for outdoor adventures',
    price: 149.99,
    category: 'Hiking',
    brand: 'ECS Outdoor',
    size: [8, 9, 10, 11, 12],
    color: 'Brown',
    inStock: true,
    imageUrl: 'https://example.com/images/hiking-boots-brown.jpg'
  },
  {
    id: 5,
    name: 'Tennis Court Shoes',
    description: 'Lightweight tennis shoes with superior stability',
    price: 89.99,
    category: 'Tennis',
    brand: 'ECS Sports',
    size: [7, 8, 9, 10, 11],
    color: 'Green',
    inStock: false,
    imageUrl: 'https://example.com/images/tennis-shoes-green.jpg'
  }
];

// Get all products
function getAllProducts() {
  return products;
}

// Get product by ID
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

// Create new product
function createProduct(productData) {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: productData.name || '',
    description: productData.description || '',
    price: parseFloat(productData.price) || 0,
    category: productData.category || '',
    brand: productData.brand || '',
    size: productData.size || [],
    color: productData.color || '',
    inStock: productData.inStock !== undefined ? productData.inStock : true,
    imageUrl: productData.imageUrl || ''
  };
  
  products.push(newProduct);
  return newProduct;
}

// Update product
function updateProduct(id, productData) {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...productData,
    id: products[index].id // Preserve the original ID
  };
  
  return products[index];
}

// Delete product
function deleteProduct(id) {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return false;
  
  products.splice(index, 1);
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
