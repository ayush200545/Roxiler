import React, { useState } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!pwdRegex.test(newPassword)) {
      setMessage({ text: 'Password must be 8-16 chars, at least 1 uppercase & 1 special character.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', { newPassword });
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Change Password</h1>
      <Card>
        {message.text && (
          <div style={{
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-md)',
            fontSize: '0.85rem',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: message.type === 'error' ? '#dc2626' : '#16a34a'
          }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Min 8 chars, 1 Uppercase, 1 Special"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 'var(--spacing-sm)' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
