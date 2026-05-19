import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', email: '', role: '' });
  
  // State cho Form Thông Tin
  const [infoForm, setInfoForm] = useState({ name: '', email: '' });
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // State cho Form Mật Khẩu (theo format hình ảnh yêu cầu)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api'
    : 'https://rwm-system-jkon.onrender.com/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setInfoForm({
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsSavingInfo(true);
    try {
      const res = await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: infoForm.name,
          email: infoForm.email
        })
      });

      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...user, name: infoForm.name, email: infoForm.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert(data.error || "Có lỗi xảy ra!");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Xử lý đổi mật khẩu (Theo format xác thực mật khẩu cũ)
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          password: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert("Thay đổi mật khẩu thành công!");
      } else {
        alert(data.error || "Mật khẩu hiện tại không chính xác!");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSavingPassword(false);
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
        
        {/* Cột trái: Thông tin tổng quan */}
        <div className="chart-container" style={{ height: 'auto', padding: '35px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
            color: 'var(--primary-color)', fontSize: '36px', border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>

          <span className="badge admin" style={{ marginBottom: '25px', fontSize: '13px' }}>Quản trị viên</span>

          <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <i className="fa-solid fa-signature" style={{ color: 'var(--primary-color)', fontSize: '18px', marginBottom: '6px' }}></i>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Họ và tên</label>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {user.name}
              </span>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '80%', margin: '0 auto' }}></div>

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

        {/* Cột phải: 2 Form chỉnh sửa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Form 1: Cập nhật thông tin cơ bản */}
          <div className="chart-container" style={{ height: 'auto', padding: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              Cập nhật thông tin cá nhân
            </h3>
            <form onSubmit={handleUpdateInfo}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Họ và tên mới</label>
                  <input required type="text" value={infoForm.name} onChange={e => setInfoForm({ ...infoForm, name: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Email mới</label>
                  <input required type="email" value={infoForm.email} onChange={e => setInfoForm({ ...infoForm, email: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn primary-btn" style={{ width: 'auto', padding: '10px 25px', borderRadius: '6px' }} disabled={isSavingInfo}>
                  {isSavingInfo ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Thay đổi mật khẩu theo format hình ảnh */}
          <div className="chart-container" style={{ height: 'auto', padding: '30px' }}>
            <h3 style={{ margin: '0 0 25px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
              Thay đổi mật khẩu truy cập
            </h3>
            
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Mật khẩu cũ (*) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  Mật khẩu cũ <span style={{ color: '#ef4444', fontWeight: 'bold' }}>(*)</span>
                </label>
                <input 
                  required 
                  type="password" 
                  placeholder="Nhập mật khẩu cũ"
                  value={passwordForm.currentPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none' }} 
                />
              </div>

              {/* Mật khẩu (*) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  Mật khẩu <span style={{ color: '#ef4444', fontWeight: 'bold' }}>(*)</span>
                </label>
                <input 
                  required 
                  type="password" 
                  placeholder="Nhập mật khẩu mới"
                  value={passwordForm.newPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none' }} 
                />
              </div>

              {/* Nhập lại mật khẩu (*) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  Nhập lại mật khẩu <span style={{ color: '#ef4444', fontWeight: 'bold' }}>(*)</span>
                </label>
                <input 
                  required 
                  type="password" 
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordForm.confirmPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none' }} 
                />
              </div>

              {/* Nút thay đổi mật khẩu căn giữa */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn" 
                  style={{ 
                    width: 'auto', 
                    padding: '12px 40px', 
                    borderRadius: '6px', 
                    fontSize: '15px',
                    fontWeight: 'bold',
                    background: '#0d47a1', /* Màu xanh đậm giống thiết kế yêu cầu */
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                  disabled={isSavingPassword}
                  onMouseOver={e => e.target.style.background = '#1565c0'}
                  onMouseOut={e => e.target.style.background = '#0d47a1'}
                >
                  {isSavingPassword ? 'Đang cập nhật...' : 'Thay đổi mật khẩu'}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </>
  );
}

export default AdminProfile;
