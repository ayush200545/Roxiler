import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Star, Users, Store } from 'lucide-react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/owner/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error('Error loading owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading your store dashboard...</p>;

  if (!dashboardData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No Store Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your store has not been set up yet. Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name.split(' ')[0]}!</h1>
          <p className="subtitle">Here's how your store is doing.</p>
        </div>
      </div>

      <div className="owner-top-row">
        <Card className="store-overview-card">
          <div className="store-icon-wrapper">
            <Store size={28} color="var(--accent-primary)" />
          </div>
          <h3>{dashboardData.storeName}</h3>
        </Card>

        <Card className="avg-rating-card">
          <span className="avg-label">Average Rating</span>
          <div className="avg-value-row">
            <Star size={28} fill="#f59e0b" color="#f59e0b" />
            <span className="avg-value">{dashboardData.averageRating}</span>
          </div>
          <span className="total-reviews">({dashboardData.totalRatings} reviews)</span>
        </Card>
      </div>

      <Card>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Users Who Rated Your Store</h3>
        {dashboardData.ratedUsers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
            No ratings yet. Share your store to get your first review!
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ratedUsers.map((r, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="cell-name">{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    <span className="rating-badge">⭐ {r.ratingValue}</span>
                  </td>
                  <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default OwnerDashboard;
