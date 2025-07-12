import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/SubmitItem.css';
import { FaBoxOpen, FaTag, FaAlignLeft } from 'react-icons/fa';

const categories = [
  'ELECTRONICS', 'BOOKS', 'APPAREL', 'ACCESSORIES', 'DOCUMENTS', 'OTHER'
];

const SubmitFoundItem = () => {
  const { token, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !category || !description || !location || !user?.username) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      // Corrected line
  await api.post('/api/items/found', { name, username: user.username, category, description, location });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/items');
      }, 1800);
    } catch (err) {
      setError('Failed to submit found item.');
    }
  };

  return (
    <div className="submit-bg">
      <div className="submit-hero found">
        <FaBoxOpen className="submit-hero-icon" />
        <h2>Report a Found Item</h2>
        <p>Help others reclaim their lost belongings. Fill out the details below.</p>
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
          />
        </div>
        <div className="submit-field">
          <FaTag className="submit-icon" />
          <select value={category} onChange={e => setCategory(e.target.value)}>
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
          />
        </div>
        <div className="submit-field">
          <FaAlignLeft className="submit-icon" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn found">Submit Found Item</button>
      </form>
      {success && <div className="submit-success-modal found">Found item reported! Redirecting...</div>}
    </div>
  );
};

export default SubmitFoundItem; 