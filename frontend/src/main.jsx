import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import React Router
import App from './App.jsx';
import Login from './Pages/Login.jsx'; 
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<App />} />
        
        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </StrictMode>
);
