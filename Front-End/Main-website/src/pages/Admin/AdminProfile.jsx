import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', email: '', role: '' });
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
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
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      alert("Vui lòng nhập Mật khẩu hiện tại để xác thực thay đổi!");
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword
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
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setFormData(prev => ({ 
          ...prev, 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '' 
        }));
        alert("Cập nhật thông tin hồ sơ thành công!");
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
      <h1 style={{ margin: '0 0 30px 0' }}>Hồ Sơ Của Bạn</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Cột trái: Hiển thị thông tin tên và email trình bày dọc, đổi màu sắc nét */}
        <div className="chart-container" style={{ height: 'auto', padding: '35px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
            color: 'var(--primary-color)', fontSize: '36px', border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>

          <span className="badge admin" style={{ marginBottom: '25px', fontSize: '13px' }}>Quản trị viên</span>

          {/* Trình bày theo chiều dọc & Đổi màu chữ tránh dùng màu trắng */}
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Họ và tên: Dọc & Màu Xanh Lục (Primary Color) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <i className="fa-solid fa-signature" style={{ color: 'var(--primary-color)', fontSize: '18px', marginBottom: '6px' }}></i>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Họ và tên</label>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {user.name}
              </span>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '80%', margin: '0 auto' }}></div>

            {/* Email: Dọc & Màu Xanh Dương Soft Blue */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <i className="fa-solid fa-envelope" style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '6px' }}></i>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Địa chỉ Email</label>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#38bdf8', wordBreak: 'break-all' }}>
                {user.email}
              </span>
            </div>
            
          </div>

          <button className="logout-btn" onClick={handleLogout} style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>
            <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất Hệ Thống
          </button>
        </div>

        {/* Cột phải: Form cập nhật thông tin */}
        <div className="chart-container" style={{ height: 'auto', padding: '30px' }}>
          <h3 style={{ margin: '0 0 25px 0' }}>Chỉnh Sửa Hồ Sơ & Bảo Mật</h3>
          
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Họ và tên mới</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Email mới</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '25px 0', paddingTop: '25px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)' }}>Đổi Mật Khẩu (Để trống nếu không đổi)</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Mật khẩu mới</label>
                  <input type="password" placeholder="Mật khẩu mới" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Xác nhận mật khẩu mới</label>
                  <input type="password" placeholder="Xác nhận mật khẩu mới" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-lock" style={{ color: '#f59e0b', marginRight: '6px' }}></i> Mật khẩu hiện tại (Bắt buộc để lưu thay đổi)
                </label>
                <input required type="password" placeholder="Nhập mật khẩu hiện tại để xác minh" value={formData.currentPassword} onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.03)', color: 'white' }} />
              </div>
              <div>
                <button type="submit" className="btn primary-btn" style={{ width: '100%', padding: '12px 0', borderRadius: '8px' }} disabled={isSaving}>
                  {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
