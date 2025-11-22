import React from 'react';

const Header = ({ user, setUser, currentView, setCurrentView, cartCount }) => {
  return (
    <header className="header">
      <h1>👟 Shoe Store</h1>
      <nav className="nav">
        {user ? (
          <>
            <button onClick={() => setCurrentView('products')}>Products</button>
            <button onClick={() => setCurrentView('cart')}>
              Cart ({cartCount})
            </button>
            <button onClick={() => setUser(null)}>Logout</button>
          </>
        ) : (
          <span>Welcome to Shoe Store</span>
        )}
      </nav>
    </header>
  );
};

export default Header;
