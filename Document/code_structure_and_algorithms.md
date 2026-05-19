# Kiến trúc và Thuật toán của dự án RWM

Tài liệu này giải thích cấu trúc mã nguồn và các thuật toán/cơ chế chính được sử dụng trong hệ thống quản lý thu gom rác (RWM).

## 1. Cấu trúc thư mục (Code Structure)

Hệ thống được chia làm hai phần tách biệt (Frontend và Backend) để đảm bảo tính module hóa và dễ bảo trì.

### 1.1. Front-End (Thư mục: `Front-End/MainWeb`)
Đây là ứng dụng React (khởi tạo bằng Vite) đảm nhiệm việc hiển thị giao diện cho người dùng.
- `src/main.jsx`: File gốc (Entry point) của ứng dụng React, dùng để render `App.jsx` vào DOM HTML.
- `src/App.jsx`: Component gốc, chứa các thiết lập Routing (điều hướng) giữa các trang.
- `src/components/`: Thư mục chứa các component nhỏ có thể tái sử dụng (ví dụ: `Button`, `Input`, `Navbar`).
- `src/pages/`: Chứa các trang chính của ứng dụng:
  - `Login.jsx`: Trang đăng nhập.
  - `Register.jsx`: Trang đăng ký tài khoản.
  - `Dashboard.jsx`: Trang chủ sau khi đăng nhập (hiển thị dữ liệu rác, bản đồ).
- `src/api/`: Nơi chứa các hàm gọi API (sử dụng Axios) đến Backend.
- `src/assets/` & `src/styles.css`: Chứa hình ảnh, icon và mã CSS (Vanilla CSS).

### 1.2. Back-End (Thư mục: `Back-End/`)
Đây là server Node.js chạy bằng framework Express, cung cấp RESTful API cho Frontend.
- `server.js`: File khởi chạy server, thiết lập các middleware (như CORS, JSON parser) và kết nối Database.
- `routes/`: Nơi định nghĩa các đường dẫn (endpoints) của API.
  - `auth.js`: Các API liên quan đến xác thực (`/api/login`, `/api/register`).
- `controllers/`: Nơi xử lý logic nghiệp vụ cho từng route.
  - `authController.js`: Logic kiểm tra mật khẩu, tạo user mới, tạo token.
- `models/`: Định nghĩa các lược đồ dữ liệu (Database Schemas) nếu dùng MongoDB.
  - `User.js`: Cấu trúc dữ liệu của người dùng.
- `middlewares/`: Nơi chứa các hàm chặn ở giữa (ví dụ: `verifyToken.js` để kiểm tra quyền truy cập).

---

## 2. Các thuật toán & Cơ chế hoạt động (Algorithms)

Dự án áp dụng các cơ chế bảo mật và luồng xử lý dữ liệu tiêu chuẩn cho các ứng dụng web hiện đại.

### 2.1. Cơ chế Xác thực và Phân quyền (Authentication & Authorization)
Thay vì lưu trạng thái đăng nhập trên server (Session), hệ thống sử dụng **JWT (JSON Web Token)** để tối ưu hóa hiệu suất và khả năng mở rộng.

**Luồng hoạt động (Thuật toán):**
1. Người dùng nhập Email + Password trên Frontend.
2. Backend kiểm tra Email trong Database. Nếu tồn tại, backend tiếp tục so sánh Password.
3. Nếu đúng, Backend sử dụng thư viện `jsonwebtoken` để ký (sign) một đoạn mã hóa gồm `userId` và `role` với một khóa bí mật (Secret Key). Đoạn mã này là JWT.
4. Token được gửi trả về Frontend. Frontend lưu nó vào `localStorage` hoặc `cookie`.
5. Trong các lần gọi API tiếp theo (ví dụ: xem lịch rác), Frontend sẽ đính kèm Token này vào `Header` (Authorization: Bearer <token>).
6. Backend dùng Middleware (chứa thuật toán giải mã thuật toán HMAC SHA256) để kiểm tra tính hợp lệ của Token trước khi trả dữ liệu.

### 2.2. Thuật toán Mã hóa Mật khẩu (Password Hashing)
Tuyệt đối không lưu mật khẩu dạng Text (Plain text) trong Database. Hệ thống sử dụng thuật toán **Bcrypt**.

**Đặc điểm của Bcrypt:**
- Bcrypt sử dụng hàm băm (hash) một chiều, nghĩa là từ chuỗi mã hóa không thể dịch ngược lại mật khẩu gốc.
- Bcrypt tự động sinh ra một chuỗi ngẫu nhiên (gọi là `salt`) trộn vào mật khẩu trước khi băm. 
- Điều này chống lại các kiểu tấn công bằng bảng tra cứu (Rainbow table attacks). Dù 2 người dùng có cùng mật khẩu (ví dụ: "123456"), chuỗi hash lưu trong database của họ sẽ hoàn toàn khác nhau do `salt` khác nhau.

### 2.3. Thuật toán Trực quan hóa Bản đồ rác (Map Clustering) - *Dự kiến*
Khi hệ thống có nhiều phản ánh rác tồn đọng ở cùng một khu vực (ví dụ: 10 điểm rác trong phạm vi 100 mét vuông).
- Frontend sẽ sử dụng thuật toán **K-Means Clustering** hoặc **Grid-based Clustering** (thông qua các thư viện bản đồ như Leaflet/Google Maps).
- Các điểm rác gần nhau sẽ được gom nhóm thành một cụm duy nhất có số "10", giúp bản đồ không bị rối mắt. Khi zoom vào gần, các cụm này mới tách dần ra.
