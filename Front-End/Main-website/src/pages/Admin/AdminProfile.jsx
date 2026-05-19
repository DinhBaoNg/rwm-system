import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', email: '', role: '' });
  const [formData, setFormData] = useState({ name: '', email: '', password: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api'
    : 'https://rwm-system-jkon.onrender.com/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      // Nếu không có thông tin user, quay lại trang login
      navigate('/');
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const res = await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật lại localStorage
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Reset ô nhập mật khẩu
        setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(data.error || "Có lỗi xảy ra khi cập nhật!");
      }
    } catch (err) {
      alert("Lỗi kết nối tới máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <h1 style={{ margin: '0 0 30px 0' }}>Quản Lý Hồ Sơ</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        {/* Card thông tin nhanh & Đăng xuất */}
        <div className="chart-container" style={{ textAlign: 'center', height: 'auto', padding: '30px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            color: 'var(--primary-color)', fontSize: '32px'
          }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
          <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</p>
          <span className="badge admin" style={{ marginBottom: '30px' }}>Quản trị viên</span>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <button className="logout-btn" onClick={handleLogout} style={{ width: '100%', padding: '12px' }}>
              <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất Hệ Thống
            </button>
          </div>
        </div>

        {/* Form cập nhật chi tiết */}
        <div className="chart-container" style={{ height: 'auto', padding: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Thông Tin Cá Nhân & Bảo Mật</h3>
          
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Họ và tên</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)' }}>Đổi Mật Khẩu (Để trống nếu không đổi)</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Mật khẩu mới</label>
                  <input type="password" placeholder="Nhập mật khẩu mới" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-muted)' }}>Xác nhận mật khẩu mới</label>
                  <input type="password" placeholder="Xác nhận mật khẩu mới" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button type="submit" className="btn primary-btn" style={{ width: 'auto', padding: '12px 30px', borderRadius: '8px' }} disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Cập Nhật Hồ Sơ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
