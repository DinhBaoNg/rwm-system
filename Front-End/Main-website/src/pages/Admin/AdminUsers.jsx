import React, { useEffect, useState } from 'react';

// Style chung cho các ô input/select trong modal
const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e2e8f0',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  marginBottom: '7px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.6px'
};

const fieldStyle = { marginBottom: '18px' };

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Resident'
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '', email: '', password: '', role: 'Resident', status: 'active'
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
        fetchUsers();
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

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setShowEditModal(false);
        fetchUsers();
        alert("Cập nhật thông tin thành công!");
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

  const getStatusBadge = (user) => {
    if (user.status === 'locked') {
      return <span className="badge unverified" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Đã khóa</span>;
    }
    return user.is_verified 
      ? <span className="badge verified">Đã xác minh</span> 
      : <span className="badge unverified">Chưa xác minh</span>;
  };

  // Component Modal tái sử dụng
  const Modal = ({ title, onClose, children }) => (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    }}>
      <div style={{
        background: '#0f172a',
        padding: '32px',
        borderRadius: '18px',
        width: '460px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#e2e8f0', fontWeight: 'bold' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '2px 6px', borderRadius: '6px', transition: '0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#e2e8f0' }}>Quản Lý Người Dùng</h1>
        <button className="btn primary-btn" onClick={() => setShowAddModal(true)} style={{ width: 'auto', padding: '10px 22px', borderRadius: '8px', fontSize: '15px' }}>
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
                  <td><strong style={{ color: '#94a3b8' }}>{user.id}</strong></td>
                  <td style={{ color: '#cbd5e1', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ color: '#64748b', fontSize: '14px' }}>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user)}</td>
                  <td style={{ color: '#94a3b8', fontSize: '14px' }}>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', cursor: 'pointer', fontSize: '14px', padding: '6px 12px', borderRadius: '6px', transition: '0.2s' }}
                        title="Chỉnh sửa"
                        onClick={() => handleEditClick(user)}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '14px', padding: '6px 12px', borderRadius: '6px', transition: '0.2s' }}
                        title="Xóa"
                        onClick={() => handleDelete(user.id, user.name)}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <i className="fa-solid fa-inbox fa-2x" style={{ display: 'block', marginBottom: '10px' }}></i>
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
        <Modal title="Tạo Người Dùng Mới" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddUser}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Họ và tên</label>
              <input
                required type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Địa chỉ Email</label>
              <input
                required type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Mật khẩu tạm thời</label>
              <input
                required type="text"
                placeholder="Mật khẩu ban đầu cho người dùng"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ ...fieldStyle, marginBottom: '28px' }}>
              <label style={labelStyle}>Vai trò</label>
              <select
                required value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                style={inputStyle}
              >
                <option value="Resident">Cư dân</option>
                <option value="Staff">Nhân viên thu gom</option>
                <option value="Manager">Quản lý khu</option>
                <option value="Admin">Quản trị viên</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '11px 22px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Hủy
              </button>
              <button type="submit" className="btn primary-btn" style={{ width: 'auto', padding: '11px 22px', borderRadius: '8px', fontSize: '15px' }} disabled={isSubmitting}>
                {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang tạo...</> : 'Tạo Tài Khoản'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Chỉnh Sửa Người Dùng */}
      {showEditModal && (
        <Modal title="Chỉnh Sửa Người Dùng" onClose={() => setShowEditModal(false)}>
          {/* Thông tin người đang chỉnh sửa */}
          {editingUser && (
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary-color)' }}></i>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                Đang chỉnh sửa: <strong style={{ color: '#e2e8f0' }}>{editingUser.name}</strong>
                &nbsp;·&nbsp;<span style={{ color: '#64748b' }}>{editingUser.id}</span>
              </span>
            </div>
          )}

          <form onSubmit={handleUpdateUser}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Họ và tên</label>
              <input
                required type="text"
                value={editFormData.name}
                onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Địa chỉ Email</label>
              <input
                required type="email"
                value={editFormData.email}
                onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Đặt lại mật khẩu <span style={{ color: '#64748b', fontWeight: 'normal', textTransform: 'none', fontSize: '12px' }}>(để trống nếu không đổi)</span></label>
              <input
                type="text"
                placeholder="Nhập mật khẩu mới..."
                value={editFormData.password}
                onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '28px' }}>
              <div>
                <label style={labelStyle}>Vai trò</label>
                <select
                  required value={editFormData.role}
                  onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                  style={inputStyle}
                >
                  <option value="Resident">Cư dân</option>
                  <option value="Staff">Nhân viên thu gom</option>
                  <option value="Manager">Quản lý khu</option>
                  <option value="Admin">Quản trị viên</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Trạng thái</label>
                <select
                  required value={editFormData.status}
                  onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                  style={inputStyle}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Khóa tài khoản</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ padding: '11px 22px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Hủy
              </button>
              <button type="submit" className="btn primary-btn" style={{ width: 'auto', padding: '11px 22px', borderRadius: '8px', fontSize: '15px' }} disabled={isSubmitting}>
                {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang lưu...</> : 'Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default AdminUsers;
