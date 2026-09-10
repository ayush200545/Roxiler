import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import './ManageStores.css';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [appliedFilters, setAppliedFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder, appliedFilters]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchStores = async () => {
    try {
      const params = { sortBy, order: sortOrder };
      if (appliedFilters.name) params.name = appliedFilters.name;
      if (appliedFilters.email) params.email = appliedFilters.email;
      if (appliedFilters.address) params.address = appliedFilters.address;

      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Could not load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER', sortBy: 'name', order: 'asc' } });
      setOwners(res.data);
    } catch (err) {
      console.error('Could not load store owners:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
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
    if (!newStore.ownerId) {
      setFormError('Please select a store owner.');
      return;
    }
    try {
      await api.post('/admin/stores', { ...newStore, ownerId: parseInt(newStore.ownerId, 10) });
      setShowAddModal(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      fetchOwners();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add store');
    }
  };

  const availableOwners = owners.filter((owner) =>
    !stores.some((store) => store.ownerId === owner.id) || String(owner.id) === String(newStore.ownerId)
  );

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Manage Stores</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add New Store
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="filters-grid">
          <div className="filter-field">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="search-input"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            className="filter-input"
          />
          <Button type="submit">Apply</Button>
        </form>

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
                <th onClick={() => toggleSort('address')} className="sortable">Address <ArrowUpDown size={14} /></th>
                <th onClick={() => toggleSort('rating')} className="sortable">Rating <ArrowUpDown size={14} /></th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Store</h2>
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleAddStore}>
              <Input label="Store Name" name="name" placeholder="e.g. Reliance Mart" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
              <Input label="Store Email" name="email" type="email" placeholder="store@example.com" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
              <Input label="Address" name="address" placeholder="Full store address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} required />
              <div className="input-group">
                <label className="input-label">Store Owner *</label>
                <select
                  className="input-field"
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                  required
                >
                  <option value="">Select a store owner</option>
                  {availableOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
              {availableOwners.length === 0 && (
                <p className="form-error">No unassigned store owners. Create a Store Owner user first.</p>
              )}
              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
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
