import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Search, Star, MapPin } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder, appliedSearch]);

  const fetchStores = async () => {
    try {
      const params = { sortBy, order: sortOrder };
      if (appliedSearch) params.q = appliedSearch;

      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Error loading stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchQuery.trim());
  };

  const submitRating = async (storeId, value) => {
    try {
      await api.post(`/stores/${storeId}/rate`, { value });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const renderStars = (store) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          className={`star-btn ${store.userRating && i <= store.userRating ? 'filled' : ''}`}
          onClick={() => submitRating(store.id, i)}
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          <Star size={18} fill={store.userRating && i <= store.userRating ? '#f59e0b' : 'none'} color={store.userRating && i <= store.userRating ? '#f59e0b' : '#d1d5db'} />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name.split(' ')[0]}!</h1>
          <p className="subtitle">Find and rate your favourite stores.</p>
        </div>
      </div>

      <div className="search-sort-bar">
        <form onSubmit={handleSearch} className="search-box" style={{ maxWidth: '420px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-input"
          >
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-input"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No stores found.</p>
      ) : (
        <div className="store-list">
          {stores.map(store => (
            <Card key={store.id} className="store-card">
              <div className="store-info">
                <h3>{store.name}</h3>
                <p className="store-address"><MapPin size={14} /> {store.address}</p>
                <div className="store-rating-display">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span className="overall-rating">{store.overallRating}</span>
                  <span className="rating-count">overall</span>
                </div>
              </div>
              <div className="store-actions">
                <span className="your-rating-label">Your Rating</span>
                <div className="star-row">
                  {renderStars(store)}
                </div>
                {store.userRating ? (
                  <span className="not-rated-text">Click a star to modify your rating</span>
                ) : (
                  <span className="not-rated-text">Click a star to rate</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
