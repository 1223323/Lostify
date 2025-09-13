import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-bg">
      <main className="landing-main">
        <button className="landing-try-btn">🔎 Try Lostifyy for free!</button>
        <h1 className="landing-title">
          Reunite people with their belongings.<br />
          <span className="landing-highlight">Lost & Found</span> made simple, secure, and smart.
        </h1>
        <p className="landing-desc">
          Lostifyy helps you report, find, and manage lost and found items with ease. Our platform connects finders and owners, streamlines claims, and keeps your campus or community organized.
        </p>
        <div className="landing-cta-group">
          <Link to="/items" className="landing-cta-primary">Go to Dashboard</Link>
          <Link to="/items/lost" className="landing-cta-secondary">Report Lost Item</Link>
          <Link to="/items/found" className="landing-cta-secondary">Report Found Item</Link>
        </div>
        <div className="landing-badges">
          <div className="landing-badge">Free to use</div>
          <div className="landing-badge">Fast item matching</div>
          <div className="landing-badge">Secure & private</div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 