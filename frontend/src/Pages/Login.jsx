import React, { useState } from 'react';
import '../style/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo - replace with your actual logo */}
        <img src="/path-to-logo.png" alt="Logo" className="login-logo" />
        
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your account</p>
        
        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Password field */}
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Remember me checkbox */}
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          {/* Submit button */}
          <button type="submit" className="login-btn">Sign In</button>
          
          {/* Footer links */}
          <div className="login-footer">
            <a href="#">Forgot password?</a>
            <p>Don’t have an account? <a href="#">Create one</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
