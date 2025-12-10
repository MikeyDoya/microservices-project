import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// API configuration
window.API_BASE_URL = 'http://containers-alb-2124506834.us-east-1.elb.amazonaws.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
