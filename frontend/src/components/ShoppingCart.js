import React from 'react';
import './ShoppingCart.css';

const ShoppingCart = ({ cart, setCart }) => {
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      // Simular checkout
      alert('Checkout completed! This is a demo - no real order was placed.');
      setCart([]);
    } catch (error) {
      alert('Checkout failed. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Shopping Cart</h2>
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <p>Your cart is empty</p>
          <p>Add some amazing shoes to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart ({cart.length} items)</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-category">{item.category}</p>
              <p className="cart-item-price">${item.price}</p>
            </div>
            
            <div className="quantity-controls">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              onClick={() => updateQuantity(item.id, 0)}
              className="remove-btn"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total-section">
          <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
