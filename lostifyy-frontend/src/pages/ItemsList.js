import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ItemsList.css';

const statusColors = {
  LOST: '#e57373',
  FOUND: '#64b5f6',
  RETURNED: '#81c784',
};

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/api/items');
        setItems(res.data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [token]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'ALL' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    LOST: items.filter(i => i.status === 'LOST').length,
    FOUND: items.filter(i => i.status === 'FOUND').length,
    RETURNED: items.filter(i => i.status === 'RETURNED').length,
  };

  return (
    <div className="dashboard-bg">
      <section className="dashboard-hero">
        <h1>Lost & Found Dashboard</h1>
        <p>Search, report, and manage lost and found items in your community.</p>
        <div className="dashboard-stats">
          <div className="stat-card" style={{background:'#e3f2fd'}}>
            <span className="stat-num" style={{color:'#1976d2'}}>{stats.LOST}</span>
            <span className="stat-label">Lost</span>
          </div>
          <div className="stat-card" style={{background:'#e8f5e9'}}>
            <span className="stat-num" style={{color:'#388e3c'}}>{stats.FOUND}</span>
            <span className="stat-label">Found</span>
          </div>
          <div className="stat-card" style={{background:'#fffde7'}}>
            <span className="stat-num" style={{color:'#fbc02d'}}>{stats.RETURNED}</span>
            <span className="stat-label">Returned</span>
          </div>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => navigate('/items/lost')} className="dashboard-btn dashboard-btn-lost">Report Lost Item</button>
          <button onClick={() => navigate('/items/found')} className="dashboard-btn dashboard-btn-found">Report Found Item</button>
        </div>
        <div className="dashboard-search-filter">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="dashboard-search"
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="dashboard-filter">
            <option value="ALL">All</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      </section>
      <section className="items-list-section">
        {loading ? (
          <div className="items-loading">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="items-empty">No items found.</div>
        ) : (
          <div className="items-list-animated">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="item-card-animated"
                style={{ borderColor: statusColors[item.status] || '#1976d2' }}
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="item-card-header">
                  <span className="item-status-badge" style={{background: statusColors[item.status] || '#1976d2'}}>{item.status}</span>
                  <span className="item-category">{item.category}</span>
                </div>
                <h3>{item.name}</h3>
                <p className="item-desc">{item.description}</p>
                <div className="item-date">Reported: {item.dateReported}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemsList; 