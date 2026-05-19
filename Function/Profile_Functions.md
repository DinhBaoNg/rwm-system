# Mô tả Chức năng Trang Hồ Sơ (Profile) Cho 4 Vai Trò (Roles)

Tệp này mô tả chi tiết các thông tin hiển thị và chức năng tương tác trên trang Hồ sơ Cá nhân (Profile) đối với từng vai trò trong hệ thống RWM.

---

## 1. ADMIN (Quản trị viên)
*   **Thông tin hiển thị:**
    *   Mã định danh: `RWM-XXXXXX` (ID duy nhất).
    *   Họ và tên, Email cá nhân.
    *   Vai trò: **Quản trị viên hệ thống**.
    *   Ngày tham gia hệ thống.
*   **Các tính năng khả dụng:**
    *   **Cập nhật thông tin:** Cho phép sửa Họ tên và Email.
    *   **Đổi mật khẩu bảo mật:** Nhập mật khẩu mới và bắt buộc điền mật khẩu hiện tại để xác thực thay đổi bảo mật.
    *   **Đăng xuất:** Thoát khỏi phiên làm việc và quay lại trang đăng nhập.

---

## 2. MANAGER (Quản lý khu vực)
*   **Thông tin hiển thị:**
    *   Mã định danh: `RWM-XXXXXX`.
    *   Họ và tên, Email, Số điện thoại.
    *   Vai trò: **Quản lý khu vực**.
    *   **Khu vực quản lý:** Tên Quận/Huyện được phân công phụ trách (ví dụ: *Quận 1, TP.HCM*).
*   **Các tính năng khả dụng:**
    *   **Cập nhật thông tin:** Cho phép sửa Họ tên, Email và Số điện thoại liên hệ.
    *   **Đổi mật khẩu:** Cập nhật mật khẩu mới để bảo vệ tài khoản quản lý.
    *   **Tóm tắt khu vực phụ trách (Quick stats):** 
        *   Hiển thị nhanh số lượng Nhân viên thu gom đang hoạt động trong khu vực của mình.
        *   Số lượng điểm nóng rác thải chưa xử lý thuộc khu vực phụ trách.
    *   **Đăng xuất.**

---

## 3. STAFF (Nhân viên thu gom rác)
*   **Thông tin hiển thị:**
    *   Mã định danh: `RWM-XXXXXX`.
    *   Họ và tên, Email, Số điện thoại liên lạc.
    *   Vai trò: **Nhân viên thu gom**.
    *   **Tuyến đường/Khu vực hoạt động:** Quận/Huyện được phân công đi thu gom.
    *   **Thông tin phương tiện (nếu có):** Loại xe thu gom (Xe đẩy tay, Xe tải rác, Biển số xe).
*   **Các tính năng khả dụng:**
    *   **Cập nhật thông tin:** Cho phép sửa Họ tên, Số điện thoại (Email thường cố định do công ty/admin cấp).
    *   **Đổi mật khẩu:** Cập nhật mật khẩu mới.
    *   **Hiệu suất thu gom (Performance stats):**
        *   Tổng lượng rác đã thu gom trong tháng (kg/tấn).
        *   Điểm đánh giá hiệu quả từ cư dân/quản lý (Rating sao).
    *   **Đăng xuất.**

---

## 4. RESIDENT (Cư dân)
*   **Thông tin hiển thị:**
    *   Mã định danh: `RWM-XXXXXX`.
    *   Họ và tên, Email, Số điện thoại.
    *   Vai trò: **Cư dân**.
    *   **Địa chỉ cư trú:** Địa chỉ nhà cụ thể và khu vực (Zone) sinh sống để phục vụ việc định vị báo cáo rác.
    *   **Ví RWM / Điểm tích lũy:** Số điểm thưởng nhận được khi phân loại rác tái chế thành công (dùng để đổi quà/ưu đãi).
*   **Các tính năng khả dụng:**
    *   **Cập nhật hồ sơ:** Sửa Họ tên, Số điện thoại và cập nhật Địa chỉ nhà.
    *   **Đổi mật khẩu.**
    *   **Lịch sử hoạt động:**
        *   Tổng số phản ánh rác thải đã gửi.
        *   Lịch sử nhận điểm thưởng từ việc bán rác tái chế.
    *   **Đăng xuất.**
