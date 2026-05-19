const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, '../Data/users.json');
const settingsFilePath = path.join(__dirname, '../Data/settings.json');

const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const readSettings = () => {
  if (!fs.existsSync(settingsFilePath)) return { zones: [], wasteTypes: [] };
  const data = fs.readFileSync(settingsFilePath);
  return JSON.parse(data);
};

const writeSettings = (settings) => {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
};

// Cấu hình Ethereal Email để test
let transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
    return;
  }
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    }
  });
  console.log('Ethereal Email Transporter Ready!');
});

// API Đăng nhập
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  
  const user = users.find(u => u.email === email);
  
  if (user && password === user.password_hash) {
    // Chặn nếu chưa xác minh
    if (user.is_verified === false) {
      return res.status(403).json({ error: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra email!' });
    }
    return res.json({ 
        message: 'Đăng nhập thành công',
        token: 'mock-jwt-token-123', 
        user: { name: user.name, role: user.role, email: user.email } 
    });
  }
  
  res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
});

// API Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const users = readUsers();
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email này đã được đăng ký' });
  }

  // Sinh mã token ngẫu nhiên
  const verifyToken = crypto.randomBytes(16).toString('hex');

  // Sinh ID duy nhất cho người dùng (Đảm bảo không bao giờ trùng lặp ngay cả khi trùng tên)
  // Format: RWM-XXXXXX (Ví dụ: RWM-8F2A1B)
  const uniqueId = 'RWM-' + crypto.randomBytes(3).toString('hex').toUpperCase();

  const newUser = {
    id: uniqueId,
    name,
    email,
    password_hash: password,
    role,
    status: 'active',
    is_verified: false,
    verify_token: verifyToken,
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  // Gửi Email tự động
  if (transporter) {
    const verifyUrl = `http://localhost:5173/verify?token=${verifyToken}`;
    const mailOptions = {
      from: '"Hệ Thống RWM" <no-reply@rwm.com>',
      to: email,
      subject: 'Xác minh tài khoản RWM của bạn',
      text: `Chào ${name},\n\nVui lòng click vào link sau để kích hoạt tài khoản:\n${verifyUrl}`,
      html: `<div style="font-family: sans-serif; padding: 20px;">
               <h2 style="color: #10B981;">Chào mừng đến với RWM</h2>
               <p>Xin chào ${name},</p>
               <p>Vui lòng click vào nút bên dưới để xác nhận email và kích hoạt tài khoản của bạn:</p>
               <a href="${verifyUrl}" style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Xác Minh Tài Khoản</a>
             </div>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('--- EMAIL GỬI THÀNH CÔNG ---');
      console.log('Click vào đây để xem thư gửi đi (Môi trường test): %s', nodemailer.getTestMessageUrl(info));
      console.log('---------------------------');
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
    }
  }

  res.json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.' });
});

// API Xác nhận Email
app.post('/api/verify', (req, res) => {
  const { token } = req.body;
  const users = readUsers();

  const userIndex = users.findIndex(u => u.verify_token === token);
  
  if (userIndex === -1) {
    return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }

  // Cập nhật trạng thái
  users[userIndex].is_verified = true;
  users[userIndex].verify_token = null; // Hủy token sau khi dùng
  
  writeUsers(users);

  res.json({ message: 'Tài khoản của bạn đã được kích hoạt thành công!' });
});

// API lấy danh sách người dùng
app.get('/api/users', (req, res) => {
  const users = readUsers();
  // Lược bỏ các thông tin nhạy cảm trước khi gửi về frontend
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    is_verified: u.is_verified,
    created_at: u.created_at
  }));
  res.json(safeUsers);
});

// API xóa người dùng (Admin)
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
  }
  writeUsers(users);
  res.json({ message: 'Đã xóa người dùng thành công' });
});

// API cập nhật thông tin người dùng (Admin)
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  // Cập nhật thông tin nếu có truyền lên
  if (name !== undefined) users[userIndex].name = name;
  if (email !== undefined) users[userIndex].email = email;
  if (password !== undefined && password !== '') users[userIndex].password_hash = password;
  if (role !== undefined) users[userIndex].role = role;
  if (status !== undefined) users[userIndex].status = status;

  writeUsers(users);
  res.json({ message: 'Cập nhật người dùng thành công', user: users[userIndex] });
});

// API Admin tạo người dùng (không cần xác minh email)
app.post('/api/users/admin-create', (req, res) => {
  const { name, email, password, role } = req.body;
  const users = readUsers();
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email này đã được đăng ký' });
  }

  const uniqueId = 'RWM-' + crypto.randomBytes(3).toString('hex').toUpperCase();

  const newUser = {
    id: uniqueId,
    name,
    email,
    password_hash: password, // Mặc định do admin đặt
    role,
    status: 'active',
    is_verified: true, // Xác minh sẵn
    verify_token: null,
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);
  res.json({ message: 'Tạo tài khoản thành công' });
});

// API Lấy cấu hình hệ thống
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  res.json(settings);
});

// API Cập nhật cấu hình hệ thống
app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  writeSettings(newSettings);
  res.json({ message: 'Đã lưu cấu hình thành công' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
