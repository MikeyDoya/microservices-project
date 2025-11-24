import React, { useState } from 'react';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simular login/registro exitoso
    const userData = {
      id: 1,
      name: isLogin ? 'Demo User' : formData.name,
      email: formData.email || 'demo@user.com'
    };
    
    setUser(userData);
    alert(isLogin ? 'Login successful!' : 'Registration successful!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = () => {
    setUser({
      id: 1,
      name: 'Demo User',
      email: 'demo@shoe-store.com'
    });
    alert('Demo login successful!');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="login-subtitle">
          {isLogin ? 'Sign in to your account' : 'Join our shoe community'}
        </p>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <button onClick={handleDemoLogin} className="demo-btn">
          Try Demo (No Login Required)
        </button>
        
        <div className="switch-mode">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
