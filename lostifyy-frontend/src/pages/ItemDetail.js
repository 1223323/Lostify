import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Items.css'; // We will also improve this file
import api from '../utils/api';

// A simple Modal component defined within the same file or imported
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>{title}</h4>
        <p>{children}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Confirm</button>
        </div>
      </div>
    </div>
  );
};

const ItemDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/items/${id}`);
        setItem(res.data);
        setStatus(res.data.status);
      } catch (err) {
        setError('Item not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);
  
  // ... (handleStatusUpdate remains the same)

  const handleDelete = async () => {
    try {
      await api.delete(`/api/items/${id}`);
      setModalOpen(false);
      navigate('/items');
    } catch (err) {
      setError('Failed to delete item.');
      setModalOpen(false);
    }
  };

  if (loading) return <div className="loading-state">Loading item details...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!item) return null;

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to permanently delete the item: <strong>{item.name}</strong>? This action cannot be undone.
      </ConfirmationModal>

      <div className="item-detail-container">
        <button onClick={() => navigate('/items')} className="back-button">← Back to List</button>
        <h2 className="item-detail-name">{item.name}</h2>
        <div className="item-detail-meta">
            <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
            <span className="category-badge">{item.category}</span>
        </div>
        <p className="item-detail-description">{item.description}</p>

        <div className="item-actions-card">
            <h4>Admin Actions</h4>
            <div className="action-group">
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="LOST">LOST</option>
                    <option value="FOUND">FOUND</option>
                    <option value="RETURNED">RETURNED</option>
                </select>
                <button onClick={() => {}} className="btn-primary">Update Status</button>
            </div>
            <div className="action-group">
              <p>Permanently remove this item from the database.</p>
              <button onClick={() => setModalOpen(true)} className="btn-danger">
                Delete Item
              </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;