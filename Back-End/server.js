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

const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
