import React from 'react';

function SystemInfo() {
  const features = [
    {
      id: 1,
      icon: "fa-solid fa-camera-retro",
      color: "#10b981", // Emerald Green
      title: "Gửi phản ánh rác thải",
      description: "Chức năng cho phép cư dân gửi phản ánh về các bãi rác tự phát, rác thải tồn đọng. Bạn chỉ cần chụp ảnh hiện trường, hệ thống sẽ tự động định vị GPS vị trí và gửi trực tiếp tới đội thu gom khu vực."
    },
    {
      id: 2,
      icon: "fa-solid fa-calendar-days",
      color: "#3b82f6", // Blue
      title: "Xem lịch thu gom",
      description: "Cư dân có thể tra cứu lịch xe rác đi qua tuyến đường nhà mình. Hệ thống có đồng hồ đếm ngược và thông báo đẩy nhắc nhở trước 30 phút, đảm bảo bạn không bỏ lỡ giờ đổ rác."
    },
    {
      id: 3,
      icon: "fa-solid fa-recycle",
      color: "#14b8a6", // Teal
      title: "Phân loại rác tại nguồn",
      description: "Website cung cấp tài liệu hướng dẫn cụ thể cách phân biệt rác hữu cơ, rác vô cơ và rác tái chế (nhựa, giấy, kim loại). Việc phân loại đúng giúp bảo vệ môi trường và giảm tải áp lực xử lý."
    },
    {
      id: 4,
      icon: "fa-solid fa-gift",
      color: "#f59e0b", // Amber/Gold
      title: "Tích điểm đổi quà (RWM Reward)",
      description: "Khi bàn giao rác tái chế đã phân loại cho nhân viên thu gom, cư dân sẽ được cộng điểm trực tiếp vào ví điện tử RWM dựa trên khối lượng. Điểm tích lũy dùng để đổi lấy các quà tặng, nhu yếu phẩm hoặc voucher giảm giá."
    },
    {
      id: 5,
      icon: "fa-solid fa-map-location-dot",
      color: "#ec4899", // Pink
      title: "Bản đồ số trực quan",
      description: "Theo dõi trạng thái vệ sinh của khu phố thông qua bản đồ nhiệt. Các điểm phản ánh rác sẽ thay đổi màu sắc từ đỏ (chưa dọn), vàng (đang xử lý) sang xanh (đã dọn sạch) để cư dân cùng giám sát."
    },
    {
      id: 6,
      icon: "fa-solid fa-headset",
      color: "#6366f1", // Indigo
      title: "Đường dây nóng hỗ trợ",
      description: "Kênh kết nối khẩn cấp giữa người dân với Ban quản lý môi trường đô thị. Bạn có thể gửi câu hỏi, khiếu nại hoặc phản hồi trực tiếp để được xử lý trong vòng 24 giờ."
    }
  ];

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Banner giới thiệu */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '40px 30px',
        marginBottom: '35px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '32px', color: 'var(--primary-color)', fontWeight: '800' }}>
          Hệ Thống Quản Lý Rác Thải RWM System
        </h1>
        <p style={{ margin: '0 auto', maxWidth: '800px', fontSize: '16px', color: '#94a3b8', lineHeight: '1.6' }}>
          Chào mừng cư dân đến với trang thông tin chính thức của dự án RWM (Recycle & Waste Management). 
          Đây là nền tảng công nghệ giúp kết nối Cư dân, Nhân viên thu gom và Ban quản lý nhằm xây dựng một đô thị Xanh - Sạch - Đẹp. 
          Hãy cùng tìm hiểu các chức năng tuyệt vời mà bạn có thể trải nghiệm trên website của chúng tôi dưới đây!
        </p>
      </div>

      {/* Grid danh sách chức năng */}
      <h2 style={{ fontSize: '22px', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fa-solid fa-list-check" style={{ color: 'var(--primary-color)' }}></i> Chức Năng Dành Cho Cư Dân
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {features.map((item) => (
          <div 
            key={item.id} 
            className="chart-container" 
            style={{ 
              height: 'auto', 
              padding: '25px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Header của thẻ: Icon tròn */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: `${item.color}18`, // 10% opacity
                border: `1px solid ${item.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                fontSize: '22px'
              }}>
                <i className={item.icon}></i>
              </div>
              <h4 style={{ margin: 0, fontSize: '18px', color: '#cbd5e1', fontWeight: 'bold' }}>
                {item.title}
              </h4>
            </div>

            {/* Nội dung mô tả */}
            <p style={{ margin: 0, fontSize: '14.5px', color: '#94a3b8', lineHeight: '1.6', textAlign: 'justify' }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Thông điệp xanh chân trang */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: '#94a3b8',
        fontSize: '15px'
      }}>
        <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>
          "Phân loại rác hôm nay, kiến tạo ngày mai xanh!"
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Bản quyền thuộc về Dự án Quản lý Rác thải Đô thị thông minh RWM System.
        </p>
      </div>
    </div>
  );
}

export default SystemInfo;
