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

  // --- QUẢN LÝ KHU VỰC (ZONES) ---
  const handleAddZone = () => {
    const name = prompt("Nhập tên khu vực mới (VD: Quận 7):");
    if (name && name.trim() !== '') {
      const nextIdNum = settings.zones.length > 0 
        ? Math.max(...settings.zones.map(z => parseInt(z.id.replace('Z', '')))) + 1
        : 1;
      const newId = `Z${String(nextIdNum).padStart(3, '0')}`;
      setSettings({
        ...settings,
        zones: [...settings.zones, { id: newId, name: name.trim(), status: 'active' }]
      });
    }
  };

  const handleEditZone = (id, currentName) => {
    const newName = prompt("Chỉnh sửa tên khu vực:", currentName);
    if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
      setSettings({
        ...settings,
        zones: settings.zones.map(z => z.id === id ? { ...z, name: newName.trim() } : z)
      });
    }
  };

  const handleDeleteZone = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khu vực này?")) {
      setSettings({
        ...settings,
        zones: settings.zones.filter(z => z.id !== id)
      });
    }
  };

  // --- QUẢN LÝ LOẠI RÁC (WASTE TYPES) ---
  const handleAddWasteType = () => {
    const name = prompt("Nhập tên loại rác mới (VD: Rác Nguy Hại):");
    if (!name || name.trim() === '') return;

    const color = prompt("Nhập mã màu HEX đại diện (VD: #ef4444):", "#ef4444");
    if (!color || color.trim() === '') return;

    const price = prompt("Nhập giá thu mua trên mỗi KG (đ/kg):", "0");
    const parsedPrice = parseInt(price) || 0;

    const nextIdNum = settings.wasteTypes.length > 0
      ? Math.max(...settings.wasteTypes.map(w => parseInt(w.id.replace('W', '')))) + 1
      : 1;
    const newId = `W${String(nextIdNum).padStart(3, '0')}`;

    setSettings({
      ...settings,
      wasteTypes: [...settings.wasteTypes, { 
        id: newId, 
        name: name.trim(), 
        color: color.trim(), 
        pricePerKg: parsedPrice 
      }]
    });
  };

  const handleEditWasteType = (type) => {
    const newName = prompt("Chỉnh sửa tên loại rác:", type.name);
    if (!newName || newName.trim() === '') return;

    const newColor = prompt("Chỉnh sửa mã màu đại diện:", type.color);
    if (!newColor || newColor.trim() === '') return;

    const newPrice = prompt("Chỉnh sửa giá thu mua (đ/kg):", String(type.pricePerKg));
    const parsedPrice = parseInt(newPrice) || 0;

    setSettings({
      ...settings,
      wasteTypes: settings.wasteTypes.map(w => w.id === type.id ? { 
        ...w, 
        name: newName.trim(), 
        color: newColor.trim(), 
        pricePerKg: parsedPrice 
      } : w)
    });
  };

  const handleDeleteWasteType = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại rác này?")) {
      setSettings({
        ...settings,
        wasteTypes: settings.wasteTypes.filter(w => w.id !== id)
      });
    }
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
        <div className="chart-container" style={{ height: 'auto', minHeight: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Quản Lý Khu Vực (Quận/Huyện)</h3>
            <button onClick={handleAddZone} style={{ padding: '5px 12px', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm</button>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {settings.zones.map(zone => (
              <li key={zone.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{zone.id}</strong> - {zone.name}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => handleEditZone(zone.id, zone.name)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Sửa tên">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onClick={() => handleDeleteZone(zone.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Xóa">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
            {settings.zones.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có khu vực nào.</p>}
          </ul>
        </div>

        {/* Cột Loại Rác */}
        <div className="chart-container" style={{ height: 'auto', minHeight: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Định Nghĩa Loại Rác</h3>
            <button onClick={handleAddWasteType} style={{ padding: '5px 12px', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm</button>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {settings.wasteTypes.map(type => (
              <li key={type.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: type.color }}></div>
                  <div>
                    <strong>{type.name}</strong> ({type.id})
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Giá: {type.pricePerKg}đ/kg</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => handleEditWasteType(type)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Sửa thông số">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onClick={() => handleDeleteWasteType(type.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Xóa">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
            {settings.wasteTypes.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa cấu hình loại rác nào.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminSettings;
