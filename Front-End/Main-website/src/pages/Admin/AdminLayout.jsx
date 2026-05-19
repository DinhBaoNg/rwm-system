import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Thực tế sẽ xóa token ở đây
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Topbar thay thế cho Sidebar */}
      <div className="admin-topbar">
        <div className="topbar-logo">
          <h2>RWM System</h2>
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

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất
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
