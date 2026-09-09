import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-md) var(--spacing-xl)',
      background: 'var(--bg-glass)',
      backdropFilter: 'var(--backdrop-blur)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Rating<span style={{ color: 'var(--accent-primary)' }}>Hub</span>
      </Link>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Hi, {user.name} ({user.role})
            </span>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login"><Button variant="secondary">Login</Button></Link>
            <Link to="/signup"><Button variant="primary">Sign Up</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
