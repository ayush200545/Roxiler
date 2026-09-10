import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ManageStores from './pages/dashboards/ManageStores';
import ManageUsers from './pages/dashboards/ManageUsers';
import UserDashboard from './pages/dashboards/UserDashboard';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import ChangePassword from './pages/dashboards/ChangePassword';
import './index.css';

// Redirect '/' to the right dashboard depending on user role
const HomeRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'STORE_OWNER':
      return <OwnerDashboard />;
    case 'NORMAL_USER':
    default:
      return <UserDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes - no sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes - with sidebar layout */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* Home page routes to appropriate dashboard by role */}
            <Route index element={<HomeRedirect />} />

            {/* Admin-only routes */}
            <Route path="stores" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageStores />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageUsers />
              </ProtectedRoute>
            } />

            {/* Normal User routes */}
            <Route path="browse" element={
              <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Store Owner routes */}
            <Route path="my-store" element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="ratings" element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            {/* Shared route for all roles */}
            <Route path="settings" element={<ChangePassword />} />
            <Route path="my-ratings" element={
              <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
