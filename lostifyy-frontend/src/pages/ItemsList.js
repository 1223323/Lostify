import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
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
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Track and manage all lost and found items.</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>{stats.LOST}</span>
          <p>Lost Items</p>
        </div>
        <div className="stat-card">
          <span>{stats.FOUND}</span>
          <p>Found Items</p>
        </div>
        <div className="stat-card">
          <span>{stats.RETURNED}</span>
          <p>Returned Items</p>
        </div>
      </section>

      <section className="dashboard-controls">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-bar">
          <FaFilter />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      </section>

      <section className="items-list-section">
        <h2>Reported Items</h2>
        {loading ? (
          <div className="items-loading">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="items-empty">No items match your criteria.</div>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="item-card"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="item-card-header" style={{ borderTopColor: statusColors[item.status] || '#1976d2' }}>
                  <h3>{item.name}</h3>
                  <span className="item-status" style={{ backgroundColor: statusColors[item.status] || '#1976d2' }}>
                    {item.status}
                  </span>
                </div>
                <p>{item.description}</p>
                <div className="item-card-footer">
                  <span>{item.category}</span>
                  <span>{item.dateReported}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemsList; 