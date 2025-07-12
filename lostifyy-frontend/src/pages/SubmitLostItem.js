import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/SubmitItem.css';
// 1. Import the location icon
import { FaBoxOpen, FaTag, FaAlignLeft, FaMapMarkerAlt } from 'react-icons/fa';

const categories = [
  'ELECTRONICS', 'BOOKS', 'APPAREL', 'ACCESSORIES', 'DOCUMENTS', 'OTHER'
];

const SubmitLostItem = () => {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  // 2. Add state for location
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // 3. Add location to the validation check
    if (!name || !category || !description || !location) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      // 4. Add location to the API post request
      await api.post('/api/items/lost', { name, category, description, location });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/items');
      }, 1800);
    } catch (err) {
      setError('Failed to submit lost item.');
    }
  };

  return (
    <div className="submit-bg">
      <div className="submit-hero lost">
        <FaBoxOpen className="submit-hero-icon" />
        <h2>Report a Lost Item</h2>
        <p>Help us reunite you with your belongings. Fill out the details below.</p>
      </div>
      <form className="submit-form" onSubmit={handleSubmit}>
        {error && <div className="submit-error">{error}</div>}
        <div className="submit-field">
          <FaBoxOpen className="submit-icon" />
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="submit-field">
          <FaTag className="submit-icon" />
          <select value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div className="submit-field">
          <FaAlignLeft className="submit-icon" />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        {/* 5. Add the input field for location to the form */}
        <div className="submit-field">
          <FaMapMarkerAlt className="submit-icon" />
          <input
            type="text"
            placeholder="Last Known Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn lost">Submit Lost Item</button>
      </form>
      {success && <div className="submit-success-modal">Lost item reported! Redirecting...</div>}
    </div>
  );
};

export default SubmitLostItem;