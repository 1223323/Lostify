import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import SubmitLostItem from './pages/SubmitLostItem';
import SubmitFoundItem from './pages/SubmitFoundItem';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Layout><Home /></Layout>} />
          <Route path="/items" element={<Layout><ItemsList /></Layout>} />
          <Route path="/items/lost" element={<Layout><SubmitLostItem /></Layout>} />
          <Route path="/items/found" element={<Layout><SubmitFoundItem /></Layout>} />
          <Route path="/items/:id" element={<Layout><ItemDetail /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
