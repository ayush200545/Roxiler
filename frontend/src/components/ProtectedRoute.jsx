import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If user doesn't have the right role, redirect them to a generic or home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
