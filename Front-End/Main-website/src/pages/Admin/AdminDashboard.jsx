import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dữ liệu giả lập cho biểu đồ
const data = [
  { name: 'T2', thuGom: 4000, tonDong: 240 },
  { name: 'T3', thuGom: 3000, tonDong: 139 },
  { name: 'T4', thuGom: 2000, tonDong: 980 },
  { name: 'T5', thuGom: 2780, tonDong: 390 },
  { name: 'T6', thuGom: 1890, tonDong: 480 },
  { name: 'T7', thuGom: 2390, tonDong: 380 },
  { name: 'CN', thuGom: 3490, tonDong: 430 },
];

// Dữ liệu giả lập cho bản đồ nhiệt (Các điểm rác tồn đọng)
const hotSpots = [
  { id: 1, pos: [10.762622, 106.660172], count: 15, name: "Khu vực Quận 10" },
  { id: 2, pos: [10.776889, 106.700806], count: 8, name: "Khu vực Quận 1" },
  { id: 3, pos: [10.792440, 106.685360], count: 22, name: "Khu vực Phú Nhuận" },
];

// Component phụ: Tự động di chuyển bản đồ đến vị trí mới
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

// Component bản đồ độc lập để tái sử dụng
function HeatMap({ userLocation, locationStatus }) {
  const defaultCenter = [10.776, 106.69];

  return (
    <MapContainer
      center={userLocation || defaultCenter}
      zoom={userLocation ? 15 : 12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Khi đã lấy được vị trí, tự động bay đến */}
      {userLocation && <FlyToLocation position={userLocation} />}

      {/* Marker vị trí người dùng */}
      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={14}
          fillColor="#3b82f6"
          color="#1d4ed8"
          weight={3}
          fillOpacity={0.85}
        >
          <Popup>
            <strong>📍 Vị trí của bạn</strong><br />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
            </span>
          </Popup>
        </CircleMarker>
      )}

      {/* Các điểm nóng rác thải */}
      {hotSpots.map(spot => (
        <CircleMarker
          key={spot.id}
          center={spot.pos}
          radius={spot.count}
          fillColor="#ef4444"
          color="transparent"
          fillOpacity={0.6}
        >
          <Popup>
            <strong>{spot.name}</strong><br />
            Số lượng phản ánh: {spot.count}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

function AdminDashboard() {
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | error

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationStatus('success');
      },
      (err) => {
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Thanh trạng thái định vị
  const renderLocationBar = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h3 style={{ margin: 0, color: '#94a3b8' }}>
        <i className="fa-solid fa-map-location-dot" style={{ color: '#ef4444', marginRight: '8px' }}></i>
        Bản Đồ Điểm Nóng (Heatmap)
      </h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Trạng thái định vị */}
        {locationStatus === 'loading' && (
          <span style={{ fontSize: '13px', color: '#f59e0b' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '5px' }}></i>Đang định vị...
          </span>
        )}
        {locationStatus === 'success' && (
          <span style={{ fontSize: '13px', color: '#10b981' }}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: '5px' }}></i>Đã lấy vị trí
          </span>
        )}
        {locationStatus === 'error' && (
          <span style={{ fontSize: '13px', color: '#ef4444' }}>
            <i className="fa-solid fa-circle-xmark" style={{ marginRight: '5px' }}></i>Không thể lấy vị trí
          </span>
        )}

        {/* Nút lấy vị trí của tôi */}
        <button
          onClick={handleGetLocation}
          disabled={locationStatus === 'loading'}
          style={{
            padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: locationStatus === 'loading' ? 'not-allowed' : 'pointer',
            background: locationStatus === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
            color: locationStatus === 'success' ? '#10b981' : '#60a5fa',
            fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
            transition: '0.2s', opacity: locationStatus === 'loading' ? 0.6 : 1
          }}
        >
          <i className="fa-solid fa-location-crosshairs"></i>
          {locationStatus === 'success' ? 'Cập nhật vị trí' : 'Vị trí của tôi'}
        </button>

        {/* Nút phóng to / thu nhỏ */}
        {mapFullscreen ? (
          <button
            onClick={() => setMapFullscreen(false)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: 'rgba(239,68,68,0.15)', color: '#f87171',
              fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
              transition: '0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            <i className="fa-solid fa-compress"></i> Thu nhỏ
          </button>
        ) : (
          <button
            onClick={() => setMapFullscreen(true)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: 'rgba(16,185,129,0.15)', color: '#10b981',
              fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
              transition: '0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.3)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)'}
          >
            <i className="fa-solid fa-expand"></i> Phóng to
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <h1>Tổng Quan Hệ Thống</h1>
      
      {/* Các thẻ chỉ số */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>1,240</h3>
            <p>Tổng Người Dùng</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fa-solid fa-truck"></i>
          </div>
          <div className="stat-info">
            <h3>86%</h3>
            <p>Tỷ Lệ Hoàn Thành (Hôm nay)</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Phản Ánh Tồn Đọng</p>
          </div>
        </div>
      </div>

      {/* Chế độ Toàn Màn Hình */}
      {mapFullscreen ? (
        <div style={{ width: '100%', height: 'calc(100vh - 280px)', minHeight: '600px' }}>
          {renderLocationBar()}
          <div style={{ height: 'calc(100% - 50px)', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <HeatMap userLocation={userLocation} locationStatus={locationStatus} />
          </div>
        </div>
      ) : (
        /* Chế độ lưới thông thường */
        <div className="dashboard-grid">
          <div className="chart-container">
            <h3>Biểu Đồ Lượng Rác (KG)</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="thuGom" stroke="#10b981" strokeWidth={3} name="Đã thu gom" />
                <Line type="monotone" dataKey="tonDong" stroke="#ef4444" strokeWidth={3} name="Tồn đọng" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="map-container">
            {renderLocationBar()}
            <div style={{ height: 'calc(100% - 50px)', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
              <HeatMap userLocation={userLocation} locationStatus={locationStatus} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
