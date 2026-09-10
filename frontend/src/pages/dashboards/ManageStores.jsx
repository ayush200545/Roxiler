import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Search, ArrowUpDown, Edit, Eye, Filter } from 'lucide-react';
import './ManageStores.css';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      const res = await api.get('/admin/stores', {
        params: { name: searchQuery, sortBy, order: sortOrder }
      });
      setStores(res.data);
    } catch (err) {
      console.error('Could not load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/stores', { ...newStore, ownerId: parseInt(newStore.ownerId) });
      setShowAddModal(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Manage Stores</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add New Store
        </Button>
      </div>

      <Card>
        <div className="table-controls">
          <form onSubmit={handleSearch} className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <div className="sort-controls">
            <span className="sort-label">Sort by Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})</span>
          </div>
        </div>

        {loading ? (
          <p className="table-message">Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="table-message">No stores found. Add your first store!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => toggleSort('name')} className="sortable">Name <ArrowUpDown size={14} /></th>
                <th onClick={() => toggleSort('email')} className="sortable">Email <ArrowUpDown size={14} /></th>
                <th>Address</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, idx) => (
                <tr key={store.id}>
                  <td>{idx + 1}</td>
                  <td className="cell-name">{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>
                    <span className="rating-badge">⭐ {store.overallRating || '0.0'}</span>
                  </td>
                  <td>
                    <button className="action-btn" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn" title="Edit">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Store</h2>
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleAddStore}>
              <Input label="Store Name" name="name" placeholder="e.g. Reliance Mart" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
              <Input label="Store Email" name="email" type="email" placeholder="store@example.com" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
              <Input label="Address" name="address" placeholder="Full store address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} required />
              <Input label="Owner ID (Store Owner User ID)" name="ownerId" type="number" placeholder="e.g. 3" value={newStore.ownerId} onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })} required />
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Create Store</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;
