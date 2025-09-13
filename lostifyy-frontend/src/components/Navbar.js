import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaTasks, FaPlusCircle, FaUserCircle } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <NavLink to="/home" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <FaHome />
            <span>Home</span>
          </NavLink>
          <NavLink to="/items" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <FaTasks />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/items/lost" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <FaPlusCircle />
            <span>Report Item</span>
          </NavLink>
        </div>
        <div className="nav-profile">
          {token ? (
            <button onClick={handleLogout} className="nav-link">
              <FaUserCircle />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              <FaUserCircle />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;