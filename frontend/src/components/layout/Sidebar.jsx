import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Store, LayoutDashboard, Users, FileText, LogOut, Star, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const adminLinks = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
    { path: '/stores', label: 'Manage Stores', icon: <Store className="nav-icon" /> },
    { path: '/users', label: 'Manage Users', icon: <Users className="nav-icon" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="nav-icon" /> },
  ];

  const normalLinks = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
    { path: '/browse', label: 'Browse Stores', icon: <Store className="nav-icon" /> },
    { path: '/my-ratings', label: 'My Ratings', icon: <Star className="nav-icon" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="nav-icon" /> },
  ];

  const ownerLinks = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
    { path: '/my-store', label: 'My Store', icon: <Store className="nav-icon" /> },
    { path: '/ratings', label: 'Ratings & Users', icon: <Users className="nav-icon" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="nav-icon" /> },
  ];

  let links = [];
  if (user?.role === 'ADMIN') links = adminLinks;
  else if (user?.role === 'STORE_OWNER') links = ownerLinks;
  else if (user?.role === 'NORMAL_USER') links = normalLinks;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Store color="var(--accent-primary)" size={24} />
        <span className="sidebar-title">StoreRating</span>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={link.path === '/'}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        
        <a href="#" className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto' }}>
          <LogOut className="nav-icon" />
          Logout
        </a>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <span className="user-role">
                {user.role === 'NORMAL_USER' ? 'Normal User' : user.role === 'STORE_OWNER' ? 'Store Owner' : 'System Administrator'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
