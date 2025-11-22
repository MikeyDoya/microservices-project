import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductCatalog.css';

const ProductCatalog = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Datos de ejemplo para demo
      setProducts([
        {
          id: 1,
          name: "Running Pro",
          price: 129.99,
          category: "running",
          image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Running+Pro",
          description: "Lightweight running shoes for professionals"
        },
        {
          id: 2,
          name: "Basketball Elite",
          price: 159.99,
          category: "basketball", 
          image: "https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Basketball+Elite",
          description: "High-performance basketball shoes"
        },
        {
          id: 3,
          name: "Casual Walk",
          price: 89.99,
          category: "casual",
          image: "https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Casual+Walk", 
          description: "Comfortable everyday shoes"
        },
        {
          id: 4,
          name: "Trail Master",
          price: 139.99,
          category: "hiking",
          image: "https://via.placeholder.com/300x200/8E44AD/FFFFFF?text=Trail+Master",
          description: "Durable hiking shoes for rough terrain"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  if (loading) {
    return <div className="loading">Loading amazing shoes...</div>;
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h2>Our Shoe Collection</h2>
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Shoes
          </button>
          <button 
            className={filter === 'running' ? 'active' : ''}
            onClick={() => setFilter('running')}
          >
            Running
          </button>
          <button 
            className={filter === 'basketball' ? 'active' : ''}
            onClick={() => setFilter('basketball')}
          >
            Basketball
          </button>
          <button 
            className={filter === 'casual' ? 'active' : ''}
            onClick={() => setFilter('casual')}
          >
            Casual
          </button>
          <button 
            className={filter === 'hiking' ? 'active' : ''}
            onClick={() => setFilter('hiking')}
          >
            Hiking
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
