# Phân quyền và Chức năng các Role trong Hệ thống

Hệ thống quản lý thu gom rác theo khu dân cư được chia thành 4 vai trò (Role) chính. Dưới đây là chi tiết chức năng của từng role:

## 1. Admin (Quản trị viên hệ thống)
Admin là người có quyền hạn cao nhất, giám sát và vận hành toàn bộ hệ thống.
* **Quản lý tài khoản & Phân quyền:** Tạo, sửa, xóa, khóa và cấp quyền cho các tài khoản (Quản lý khu, Nhân viên).
* **Quản lý danh mục chung:** Quản lý cơ sở dữ liệu về khu vực (Thành phố, Quận/Huyện, Phường/Xã), loại rác, phương tiện thu gom.
* **Theo dõi & Báo cáo tổng quan:** Xem Dashboard thống kê toàn hệ thống (tổng số phản ánh, tiến độ thu gom, đánh giá hiệu quả trên các khu vực khác nhau).
* **Cài đặt hệ thống:** Cấu hình các thông số hệ thống, API gửi thông báo (SMS, Email, Zalo), sao lưu và phục hồi dữ liệu.

## 2. Quản lý khu (Zone Manager)
Quản lý khu chịu trách nhiệm vận hành công tác thu gom rác tại một hoặc một vài khu vực (phường/xã/tổ dân phố) được giao.
* **Quản lý nhân sự & Dân cư:** Quản lý danh sách nhân viên thu gom và tài khoản cư dân thuộc khu vực mình quản lý.
* **Quản lý lịch trình & Tuyến thu gom:** Tạo, sắp xếp và phân công tuyến đường, lịch thu gom rác cụ thể cho từng nhân viên.
* **Quản lý phản ánh:** Tiếp nhận, duyệt và điều phối nhân viên đi xử lý các phản ánh rác tồn đọng từ cư dân.
* **Theo dõi tiến độ (Real-time):** Theo dõi lộ trình và trạng thái hoàn thành công việc của nhân viên thu gom trên bản đồ.
* **Báo cáo khu vực:** Xem các thống kê, báo cáo hiệu suất thu gom, điểm đen rác thải tại khu vực mình phụ trách.

## 3. Nhân viên (Nhân viên thu gom rác)
Nhân viên là người trực tiếp thực hiện công việc thu gom rác ngoài hiện trường.
* **Xem lịch trình & Nhiệm vụ:** Xem danh sách tuyến đường, lịch thu gom và nhiệm vụ được phân công trong ngày.
* **Cập nhật trạng thái:** Check-in điểm thu gom, đánh dấu hoàn thành tuyến đường hoặc điểm lấy rác.
* **Xử lý phản ánh:** Xem vị trí rác tồn đọng trên bản đồ (được Quản lý khu điều phối) và cập nhật trạng thái sau khi đã dọn dẹp xong (kèm hình ảnh minh chứng).
* **Báo cáo sự cố:** Báo cáo nhanh các vấn đề phát sinh tại hiện trường (xe hỏng, điểm tập kết quá tải, rác không đúng quy định) về cho Quản lý khu.
* **Nhận thông báo:** Nhận các thông báo điều phối khẩn cấp từ Quản lý khu.

## 4. Cư dân (Resident)
Cư dân là người dùng cuối, sinh sống tại khu vực hệ thống quản lý.
* **Xem lịch thu gom:** Xem chi tiết lịch thu gom rác tại khu vực/tuyến đường nhà mình (thời gian, loại rác).
* **Nhận thông báo nhắc nhở:** Nhận thông báo (Push notification, Zalo, SMS) nhắc lịch chuẩn bị đổ rác sắp tới.
* **Gửi phản ánh:** Chụp ảnh, mô tả và chọn vị trí trên bản đồ để gửi phản ánh về tình trạng rác tồn đọng, bãi rác tự phát hoặc xe rác không đến đúng giờ.
* **Theo dõi phản ánh:** Theo dõi tiến độ xử lý phản ánh của mình (Đã tiếp nhận -> Đang xử lý -> Đã giải quyết xong).
* **Xem thông báo:** Xem các tin tức, thông báo chung từ ban quản lý khu vực (đổi lịch thu gom do lễ/tết, tuyên truyền phân loại rác).
