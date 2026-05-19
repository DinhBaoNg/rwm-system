# Chức năng Giao diện Chính: ADMIN (Quản trị viên)

Tệp này mô tả danh sách các chức năng sẽ xuất hiện trên màn hình chính (Dashboard) của tài khoản Admin sau khi đăng nhập thành công. Các tệp code giao diện (.jsx) và logic (.js) tương ứng sẽ được xây dựng dựa trên bản mô tả này.

## 1. Dashboard Tổng Quan (Overview)
- **Biểu đồ thống kê:** Hiển thị tổng số lượng rác thu gom trên toàn thành phố/hệ thống theo ngày/tuần/tháng.
- **Thống kê người dùng:** Tổng số lượng Quản lý khu, Nhân viên thu gom và Cư dân đang hoạt động.
- **Bản đồ nhiệt (Heatmap):** Hiển thị các điểm nóng có nhiều phản ánh rác tồn đọng nhất trên toàn hệ thống.

## 2. Quản lý Người dùng (User Management)
- **Xem danh sách:** Hiển thị toàn bộ user trong hệ thống (đọc từ `users.json` hoặc DB).
- **Phân quyền & Thêm mới:** Cho phép Admin tạo tài khoản Manager cấp dưới hoặc khóa/xóa các tài khoản vi phạm.
- **Cấp lại mật khẩu:** Hỗ trợ đổi mật khẩu cho người dùng khi họ quên.

## 3. Cấu hình Hệ thống (System Settings)
- **Quản lý Khu vực (Zones):** Thêm, sửa, xóa các Quận/Huyện/Khu vực quản lý.
- **Quản lý Loại rác:** Định nghĩa các loại rác (Hữu cơ, vô cơ, tái chế) và quy định thu gom tương ứng.

## 4. Báo cáo & Phân tích (Reports & Analytics)
- **Xuất báo cáo:** Chức năng xuất dữ liệu ra file Excel/PDF để báo cáo lên cấp trên.
- **Đánh giá hiệu suất:** Xem bảng xếp hạng hiệu quả thu gom rác giữa các khu vực (Zone) khác nhau.
