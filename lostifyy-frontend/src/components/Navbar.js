import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for menu
import '../styles/Navbar.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>Lostifyy</Link>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links-desktop">
          <Link to="/items">Dashboard</Link>
          <Link to="/items/lost">Report Lost</Link>
          <Link to="/items/found">Report Found</Link>
        </div>

        {/* Desktop Auth */}
        <div className="navbar-auth-desktop">
          {token ? (
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="navbar-link-btn">Login</Link>
              <Link to="/register" className="navbar-btn primary">Register</Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="navbar-mobile-icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/items" onClick={closeMenu}>Dashboard</Link>
          <Link to="/items/lost" onClick={closeMenu}>Report Lost</Link>
          <Link to="/items/found" onClick={closeMenu}>Report Found</Link>
          <div className="navbar-mobile-auth">
             {token ? (
              <button className="navbar-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="navbar-link-btn" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="navbar-btn primary" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;