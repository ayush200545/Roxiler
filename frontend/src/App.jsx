import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Placeholder for Dashboards (will build in Phase 7)
const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'ADMIN') return <div style={{padding: '2rem'}}>Admin Dashboard (Coming in Phase 7)</div>;
  if (user.role === 'STORE_OWNER') return <div style={{padding: '2rem'}}>Owner Dashboard (Coming in Phase 7)</div>;
  return <div style={{padding: '2rem'}}>Normal User Dashboard (Coming in Phase 7)</div>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, padding: 'var(--spacing-md)' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
