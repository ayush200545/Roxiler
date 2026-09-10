import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Users, Store, Star, TrendingUp, UserPlus, ShoppingBag, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Some sample chart data — in production you'd fetch this from the backend
  const chartData = [
    { month: 'Jan', ratings: 4 },
    { month: 'Feb', ratings: 8 },
    { month: 'Mar', ratings: 5 },
    { month: 'Apr', ratings: 12 },
    { month: 'May', ratings: 9 },
    { month: 'Jun', ratings: 15 },
    { month: 'Jul', ratings: 18 },
    { month: 'Aug', ratings: 22 },
    { month: 'Sep', ratings: stats.totalRatings || 10 },
  ];

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name.split(' ')[0]}!</p>
        </div>
        <p className="date-text">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Users size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats.totalUsers}</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Store size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Stores</span>
              <span className="stat-value">{stats.totalStores}</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
              <Star size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Ratings</span>
              <span className="stat-value">{stats.totalRatings}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-bottom-row">
        <Card className="chart-card">
          <div className="chart-header">
            <h3>Ratings Overview</h3>
            <span className="chart-subtitle">Number of ratings submitted over time</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip />
              <Line type="monotone" dataKey="ratings" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot" style={{ backgroundColor: '#22c55e' }} />
              <div className="activity-content">
                <p>New user registered</p>
                <span className="activity-meta">5 mins ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ backgroundColor: '#2563eb' }} />
              <div className="activity-content">
                <p>New store added</p>
                <span className="activity-meta">20 mins ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ backgroundColor: '#f59e0b' }} />
              <div className="activity-content">
                <p>New rating submitted</p>
                <span className="activity-meta">1 hour ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ backgroundColor: '#8b5cf6' }} />
              <div className="activity-content">
                <p>New admin added</p>
                <span className="activity-meta">2 hours ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
