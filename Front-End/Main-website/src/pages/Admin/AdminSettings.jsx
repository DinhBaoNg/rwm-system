import React, { useEffect, useState } from 'react';

function AdminSettings() {
  const [settings, setSettings] = useState({ zones: [], wasteTypes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api'
    : 'https://rwm-system-jkon.onrender.com/api';

  useEffect(() => {
    fetch(`${apiUrl}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(err => {
        alert("Không thể tải cấu hình");
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert("Đã lưu cấu hình thành công!");
    } catch (err) {
      alert("Lỗi khi lưu cấu hình!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddZone = () => {
    const name = prompt("Nhập tên khu vực mới (VD: Quận 1):");
    if (name) {
      setSettings({
        ...settings,
        zones: [...settings.zones, { id: `Z00${settings.zones.length + 1}`, name, status: 'active' }]
      });
    }
  };

  const handleDeleteZone = (id) => {
    setSettings({
      ...settings,
      zones: settings.zones.filter(z => z.id !== id)
    });
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải cấu hình...</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Cấu Hình Hệ Thống</h1>
        <button className="btn primary-btn" onClick={handleSave} style={{ width: 'auto', padding: '10px 20px', borderRadius: '8px' }} disabled={isSaving}>
          <i className="fa-solid fa-floppy-disk"></i> {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Cột Khu Vực */}
        <div className="chart-container" style={{ height: 'auto', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Quản Lý Khu Vực</h3>
            <button onClick={handleAddZone} style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '5px', cursor: 'pointer' }}>+ Thêm</button>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {settings.zones.map(zone => (
              <li key={zone.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{zone.id}</strong> - {zone.name}
                </div>
                <button onClick={() => handleDeleteZone(zone.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </li>
            ))}
            {settings.zones.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có khu vực nào.</p>}
          </ul>
        </div>

        {/* Cột Loại Rác */}
        <div className="chart-container" style={{ height: 'auto', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Phân Loại Rác</h3>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {settings.wasteTypes.map(type => (
              <li key={type.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: type.color }}></div>
                <div style={{ flex: 1 }}>
                  <strong>{type.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Giá thu mua: {type.pricePerKg}đ/kg</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminSettings;
