import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import Login from './components/Login';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('products');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div className="App">
      <Header 
        user={user} 
        setUser={setUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cart.length}
      />
      
      <main className="main-content">
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <>
            {currentView === 'products' && (
              <ProductCatalog cart={cart} setCart={setCart} />
            )}
            {currentView === 'cart' && (
              <ShoppingCart cart={cart} setCart={setCart} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
