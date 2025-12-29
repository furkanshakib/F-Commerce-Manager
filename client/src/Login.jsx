import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New State for visibility
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // YOUR SECRET PASSWORD
    const secretKey = "taalguss"; 

    if (password === secretKey) {
      localStorage.setItem("adminAuth", "true");
      setIsLoggedIn(true);
      navigate("/admin");
    } else {
      alert("Wrong Password! Access Denied.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>🔒 Admin Login</h2>
      <p>Please enter the secret password to continue.</p>
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          {/* Wrapper to hold Input + Eye Icon */}
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} // Switches between text and dots
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* The Eye Button */}
            <button 
              type="button" 
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"} 
            </button>
          </div>
        </div>
        <button type="submit" className="btn-primary">Unlock Dashboard</button>
      </form>
    </div>
  );
}

export default Login;