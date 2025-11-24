import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// API configuration
window.API_BASE_URL = 'http://microservicios-alb-123456789.us-east-1.elb.amazonaws.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
