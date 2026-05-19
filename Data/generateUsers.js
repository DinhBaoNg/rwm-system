const fs = require('fs');
const path = require('path');

const users = [];

// Các hàm hỗ trợ tạo dữ liệu ngẫu nhiên
const pad = (num) => num.toString().padStart(3, '0');
const randomDate = () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
const tenLot = ["Văn", "Thị", "Hữu", "Minh", "Thanh", "Ngọc", "Gia", "Bảo", "Tuấn", "Hoài"];
const ten = ["An", "Bình", "Châu", "Dũng", "Giang", "Hải", "Linh", "Nam", "Quang", "Trang"];

const randomName = () => `${ho[Math.floor(Math.random() * ho.length)]} ${tenLot[Math.floor(Math.random() * tenLot.length)]} ${ten[Math.floor(Math.random() * ten.length)]}`;

// Sinh ra 100 người dùng theo tỷ lệ Role
for (let i = 1; i <= 100; i++) {
  let role;
  if (i <= 2) role = 'Admin'; // 2 Admin
  else if (i <= 10) role = 'Manager'; // 8 Quản lý khu
  else if (i <= 30) role = 'Staff'; // 20 Nhân viên thu gom
  else role = 'Resident'; // 70 Cư dân

  const user = {
    id: `U${pad(i)}`,
    name: randomName(),
    email: `user${pad(i)}@rwm.com`,
    password_hash: `$2b$10$mock_hash_for_all_users_123456`, // Mật khẩu chung giả định là 123456
    role: role,
    status: Math.random() > 0.05 ? 'active' : 'inactive',
    created_at: randomDate()
  };

  // Thêm các trường đặc thù tùy theo Role
  if (role === 'Manager') {
    user.assigned_zone = `Quận ${Math.floor(Math.random() * 12) + 1}`;
  } else if (role === 'Staff') {
    user.assigned_route = `Tuyến đường ${Math.floor(Math.random() * 50) + 1}`;
  } else if (role === 'Resident') {
    user.address = `Số ${Math.floor(Math.random() * 999) + 1} Đường ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, Phường ${Math.floor(Math.random() * 15) + 1}`;
  }

  // Đảm bảo Admin luôn có email cố định để dễ test
  if (i === 1) {
    user.email = "admin@rwm.com";
    user.name = "Admin Tổng Hệ Thống";
  }

  users.push(user);
}

const targetPath = path.join(__dirname, 'users.json');
fs.writeFileSync(targetPath, JSON.stringify(users, null, 2));

console.log(`Đã tạo thành công 100 user và lưu vào: ${targetPath}`);
