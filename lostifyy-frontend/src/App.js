import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import SubmitLostItem from './pages/SubmitLostItem';
import SubmitFoundItem from './pages/SubmitFoundItem';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/items" element={<><Navbar /><ItemsList /></>} />
          <Route path="/items/lost" element={<><Navbar /><SubmitLostItem /></>} />
          <Route path="/items/found" element={<><Navbar /><SubmitFoundItem /></>} />
          <Route path="/items/:id" element={<><Navbar /><ItemDetail /></>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
