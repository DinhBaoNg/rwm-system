import React, { useEffect, useState } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Resident'
  });

  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api'
    : 'https://rwm-system-jkon.onrender.com/api';

  const fetchUsers = () => {
    setIsLoading(true);
    fetch(`${apiUrl}/users`)
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"?`)) return;

    try {
      const res = await fetch(`${apiUrl}/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert("Có lỗi xảy ra khi xóa!");
      }
    } catch (err) {
      alert("Lỗi kết nối tới máy chủ.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/users/admin-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'Resident' });
        fetchUsers(); // Tải lại danh sách
        alert("Thêm người dùng thành công!");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Lỗi kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button className="btn primary-btn" onClick={() => setShowAddModal(true)} style={{ width: 'auto', padding: '10px 20px', borderRadius: '8px' }}>
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
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="Xóa" onClick={() => handleDelete(user.id, user.name)}>
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

      {/* Modal Thêm Người Dùng */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'var(--background)', padding: '30px', borderRadius: '16px',
            width: '400px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{ margin: '0 0 20px 0' }}>Tạo Người Dùng Mới</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Họ và tên</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Mật khẩu tạm</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Vai trò</label>
                <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--background)', color: 'white' }}>
                  <option value="Resident">Cư dân</option>
                  <option value="Staff">Nhân viên thu gom</option>
                  <option value="Manager">Quản lý khu</option>
                  <option value="Admin">Quản trị viên</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 15px', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" className="btn primary-btn" style={{ width: 'auto', padding: '10px 15px', borderRadius: '8px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminUsers;
