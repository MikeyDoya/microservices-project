import React from 'react';

const Header = ({ user, setUser, currentView, setCurrentView, cartCount }) => {
  const handleLogoClick = () => {
    // 1. Si está logueado, muestra productos
    if (user) {
      setCurrentView('products');
    }
    // 2. Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <h1 
        style={{ 
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'transform 0.2s ease'
        }}
        onClick={handleLogoClick}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        👟 Tienda de zapatillas
      </h1>
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
