import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const updateAuthState = () => {
      const tokenFromStorage = localStorage.getItem('token');
      const userFromStorage = localStorage.getItem('user');
      
      if (tokenFromStorage && userFromStorage) {
        setToken(tokenFromStorage);
        setUser(JSON.parse(userFromStorage));
      } else {
        setToken(null);
        setUser({});
      }
    };

    updateAuthState();
    
    // Listen for storage events to update auth state
    window.addEventListener('storage', updateAuthState);
    
    return () => {
      window.removeEventListener('storage', updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser({});
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">ShopEZ</Link>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search Electronics, Fashion, mobiles, etc."
            />
          </div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            {token ? (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/profile">Profile</Link>
                {user.usertype === 'admin' && (
                  <Link to="/admin">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
