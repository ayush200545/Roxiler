import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--spacing-lg) var(--spacing-xl)', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
