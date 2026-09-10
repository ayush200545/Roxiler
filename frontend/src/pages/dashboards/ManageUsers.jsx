import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Search, ArrowUpDown, Edit, Eye } from 'lucide-react';
import './ManageStores.css'; // reuse same table styles

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder, roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = { sortBy, order: sortOrder };
      if (searchQuery) params.name = searchQuery;
      if (roleFilter) params.role = roleFilter;

      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error('Could not load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      ADMIN: { label: 'Admin', cls: 'admin' },
      NORMAL_USER: { label: 'Normal User', cls: 'normal' },
      STORE_OWNER: { label: 'Store Owner', cls: 'owner' }
    };
    const r = map[role] || { label: role, cls: 'normal' };
    return <span className={`role-badge ${r.cls}`}>{r.label}</span>;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic frontend validation matching the requirements
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      setFormError('Name must be between 20 and 60 characters.');
      return;
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!pwdRegex.test(newUser.password)) {
      setFormError('Password: 8-16 chars, needs 1 uppercase & 1 special character.');
      return;
    }
    if (newUser.address.length > 400) {
      setFormError('Address must be under 400 characters.');
      return;
    }

    try {
      await api.post('/admin/users', newUser);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Manage Users</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add New User
        </Button>
      </div>

      <Card>
        <div className="table-controls">
          <form onSubmit={handleSearch} className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <div className="sort-controls">
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', backgroundColor: 'white' }}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="table-message">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="table-message">No users found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => toggleSort('name')} className="sortable">Name <ArrowUpDown size={14} /></th>
                <th onClick={() => toggleSort('email')} className="sortable">Email <ArrowUpDown size={14} /></th>
                <th>Address</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td className="cell-name">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    {u.role === 'STORE_OWNER' && u.storeRating 
                      ? <span className="rating-badge">⭐ {u.storeRating}</span> 
                      : '—'}
                  </td>
                  <td>
                    <button className="action-btn" title="View"><Eye size={16} /></button>
                    <button className="action-btn" title="Edit"><Edit size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleAddUser}>
              <Input label="Full Name (20-60 chars)" name="name" placeholder="Enter full name..." value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <Input label="Email" name="email" type="email" placeholder="user@example.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
              <Input label="Password" name="password" type="password" placeholder="8-16 chars, 1 Uppercase, 1 Special" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              <Input label="Address" name="address" placeholder="Full address..." value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} required />
              <div className="input-group">
                <label className="input-label">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="input-field"
                >
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
