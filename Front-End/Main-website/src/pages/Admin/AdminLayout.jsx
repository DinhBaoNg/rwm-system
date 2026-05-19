import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Admin.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Topbar */}
      <div className="admin-topbar">
        <div className="topbar-logo">
          <h2>RWM</h2>
          <img src={logo} alt="RWM Logo" className="admin-logo-img" />
        </div>
        
        <ul className="nav-links">
          <li 
            className={location.pathname === '/admin' ? 'active' : ''} 
            onClick={() => navigate('/admin')}
          >
            <i className="fa-solid fa-chart-pie"></i>
            Tổng quan
          </li>
          <li 
            className={location.pathname === '/admin/users' ? 'active' : ''} 
            onClick={() => navigate('/admin/users')}
          >
            <i className="fa-solid fa-users"></i>
            Người dùng
          </li>
          <li 
            className={location.pathname === '/admin/settings' ? 'active' : ''} 
            onClick={() => navigate('/admin/settings')}
          >
            <i className="fa-solid fa-gear"></i>
            Cấu hình
          </li>
        </ul>

        <button className="profile-btn" onClick={() => navigate('/admin/profile')}>
          <i className="fa-solid fa-user-circle"></i> Hồ sơ
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
