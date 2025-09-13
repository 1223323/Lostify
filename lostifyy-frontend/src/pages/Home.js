import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Lost and Found</h1>
        <p>Your one-stop solution for finding lost items and reporting found ones.</p>
      </header>
      <div className="home-actions">
        <Link to="/items/lost" className="action-card">
          <h2>Report a Lost Item</h2>
          <p>Help us find your valuable belongings.</p>
        </Link>
        <Link to="/items/found" className="action-card">
          <h2>Report a Found Item</h2>
          <p>Be a hero and reunite someone with their item.</p>
        </Link>
        <Link to="/items" className="action-card">
          <h2>View All Items</h2>
          <p>Browse the list of lost and found items.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
