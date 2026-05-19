import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import './index.css';

function AuthForm() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('');

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLoginActive(!isLoginActive);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://rwm-system-jkon.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`Đăng nhập thành công!\nXin chào ${data.user.name} (${data.user.role})`);
      } else {
        alert(`Thất bại: ${data.error}`);
      }
    } catch (error) {
      alert("Lỗi kết nối tới máy chủ (Backend cổng 5001 chưa bật)");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://rwm-system-jkon.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: regName, email: regEmail, password: regPassword, role: regRole 
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message + "\n\n(Dành cho Dev: Hãy xem tab Terminal của Node.js để lấy link bấm Xác nhận Email nhé!)");
        setIsLoginActive(true); 
      } else {
        alert(`Thất bại: ${data.error}`);
      }
    } catch (error) {
      alert("Lỗi kết nối tới máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="form-container" style={{ minHeight: isLoginActive ? '500px' : '650px' }}>
        
        {/* Form Đăng nhập */}
        <div className={`form-box login-box ${isLoginActive ? 'active' : 'slide-left'}`}>
          <h2>Đăng Nhập</h2>
          <p className="subtitle">Chào mừng bạn quay trở lại với hệ thống RWM</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <i className="fa-regular fa-envelope"></i>
              <input type="email" placeholder="Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
            </div>
            <button type="submit" className="btn primary-btn" disabled={isLoading}>
              {isLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</> : 'Đăng Nhập'}
            </button>
            <p className="switch-form">
              Chưa có tài khoản? <a href="#" onClick={toggleForm}>Đăng ký ngay</a>
            </p>
          </form>
        </div>

        {/* Form Đăng ký */}
        <div className={`form-box register-box ${!isLoginActive ? 'active' : ''}`}>
          <h2>Đăng Ký</h2>
          <p className="subtitle">Tham gia cùng chúng tôi để làm sạch khu phố</p>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <i className="fa-regular fa-user"></i>
              <input type="text" placeholder="Họ và tên" required value={regName} onChange={(e) => setRegName(e.target.value)} />
            </div>
            <div className="input-group">
              <i className="fa-regular fa-envelope"></i>
              <input type="email" placeholder="Email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
            </div>
            <div className="input-group">
              <i className="fa-solid fa-user-shield"></i>
              <select required value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                <option value="" disabled>Chọn vai trò</option>
                <option value="Resident">Cư dân</option>
                <option value="Staff">Nhân viên thu gom</option>
                <option value="Manager">Quản lý khu</option>
              </select>
            </div>
            <button type="submit" className="btn primary-btn" disabled={isLoading}>
               {isLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</> : 'Tạo Tài Khoản'}
            </button>
            <p className="switch-form">
              Đã có tài khoản? <a href="#" onClick={toggleForm}>Đăng nhập</a>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

// Component Trang Xác Minh Email
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('Đang tiến hành xác minh...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('Không tìm thấy mã xác minh hợp lệ trên đường link!');
      return;
    }
    
    fetch('https://rwm-system-jkon.onrender.com/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setStatus(data.error);
      } else {
        setStatus('Tài khoản của bạn đã được xác minh thành công! Bây giờ bạn đã có thể đăng nhập.');
        setIsSuccess(true);
      }
    })
    .catch(err => setStatus('Lỗi kết nối tới máy chủ. Vui lòng thử lại sau.'));
  }, [token]);

  return (
    <div className="wrapper">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <div className="form-container" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Xác Minh Email</h2>
        
        {isSuccess ? (
          <i className="fa-solid fa-circle-check" style={{ fontSize: '48px', color: 'var(--primary-color)', marginBottom: '20px' }}></i>
        ) : (
          <i className="fa-solid fa-circle-info" style={{ fontSize: '48px', color: 'var(--secondary-color)', marginBottom: '20px' }}></i>
        )}
        
        <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.5' }}>
          {status}
        </p>
        
        <button className="btn primary-btn" onClick={() => navigate('/')}>
          Quay lại trang Đăng nhập
        </button>
      </div>
    </div>
  );
}

// Khởi tạo React Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/verify" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
