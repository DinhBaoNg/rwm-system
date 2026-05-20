import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
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

function AdminDashboard() {
  const [mapFullscreen, setMapFullscreen] = useState(false);

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

      {/* Chế độ Toàn Màn Hình: chỉ hiện bản đồ khi bật fullscreen */}
      {mapFullscreen ? (
        <div style={{ width: '100%', height: 'calc(100vh - 280px)', minHeight: '600px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#94a3b8' }}>
              <i className="fa-solid fa-map-location-dot" style={{ color: '#ef4444', marginRight: '8px' }}></i>
              Bản Đồ Điểm Nóng (Heatmap)
            </h3>
            <button
              onClick={() => setMapFullscreen(false)}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: 'rgba(239,68,68,0.15)', color: '#f87171',
                fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
                transition: '0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            >
              <i className="fa-solid fa-compress"></i> Thu nhỏ
            </button>
          </div>
          <div style={{ height: 'calc(100% - 50px)', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <MapContainer center={[10.776, 106.69]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
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
                    <strong>{spot.name}</strong><br/>
                    Số lượng phản ánh: {spot.count}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
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
            {/* Header bản đồ có nút phóng to */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Bản Đồ Điểm Nóng (Heatmap)</h3>
              <button
                onClick={() => setMapFullscreen(true)}
                title="Phóng to bản đồ"
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
            </div>
            <div style={{ height: 'calc(100% - 50px)', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
              <MapContainer center={[10.776, 106.69]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
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
                      <strong>{spot.name}</strong><br/>
                      Số lượng phản ánh: {spot.count}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
