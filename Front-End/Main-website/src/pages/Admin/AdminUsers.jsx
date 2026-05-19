import React, { useEffect, useState } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API thật lên Backend Render hoặc Localhost
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/users'
      : 'https://rwm-system-jkon.onrender.com/api/users';
      
    fetch('https://rwm-system-jkon.onrender.com/api/users')
      .then(res => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return <span className="badge admin">Quản trị viên</span>;
      case 'Manager': return <span className="badge manager">Quản lý khu</span>;
      case 'Staff': return <span className="badge staff">Nhân viên thu gom</span>;
      default: return <span className="badge resident">Cư dân</span>;
    }
  };

  const getStatusBadge = (isVerified) => {
    return isVerified 
      ? <span className="badge verified">Đã xác minh</span> 
      : <span className="badge unverified">Chưa xác minh</span>;
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Quản Lý Người Dùng</h1>
        <button className="btn primary-btn" style={{ width: 'auto', padding: '10px 20px', borderRadius: '8px' }}>
          <i className="fa-solid fa-plus"></i> Thêm Người Dùng
        </button>
      </div>

      <div className="users-table-container">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--primary-color)' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444' }}>
            <i className="fa-solid fa-triangle-exclamation fa-2x"></i>
            <p>{error}</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.id}</strong></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user.is_verified)}</td>
                  <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Sửa">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Xóa">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                    Chưa có người dùng nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default AdminUsers;
