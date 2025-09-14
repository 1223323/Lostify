import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UniversityProvider } from './context/UniversityContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <UniversityProvider>
          <App />
        </UniversityProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
