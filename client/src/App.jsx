import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import OrderForm from './OrderForm';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import './App.css';

// A special component that acts like a Bouncer/Security Guard
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // This tells the App to check your "browser memory" when it wakes up
const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("adminAuth") === "true"
);

  // Check if user was already logged in (so you don't log in every time you refresh)
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>F-Commerce Manager</h1>
          <div className="links">
             <Link to="/">Order Form</Link> 
             {/* Only show "Dashboard" link if logged in, otherwise show "Login" */}
             {isLoggedIn ? (
               <Link to="/admin">Dashboard</Link>
             ) : (
               <Link to="/login">Admin Login</Link>
             )}
          </div>
        </nav>

        <Routes>
          {/* Public Route: Everyone can see this */}
          <Route path="/" element={<OrderForm />} />

          {/* Login Route */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          {/* Protected Route: Only Admin can see this */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;