import React from 'react';
import { useTheme } from '../App';

const navItems = [
  { id: 'dashboard', label: 'Genel Bakış' },
  { id: 'orders', label: 'Siparişler' },
  { id: 'stock', label: 'Stok Yönetimi' },
  { id: 'decisions', label: 'AI Karar Hafızası' },
  { id: 'alerts', label: 'Sistem Uyarıları' },
  { id: 'market', label: 'Dış Pazar Radarı' },
  { id: 'chat', label: 'AI Danışman' },
];

export default function Sidebar({ page, setPage, alertCount }) {
  const { t, mode, setMode } = useTheme();

  return (
    <aside style={{ 
      width: '220px', 
      background: t.sidebar, 
      borderRight: `1px solid ${t.border}`, 
      position: 'fixed', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      zIndex: 100 
    }}>

      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${t.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '30px', height: '30px', background: t.accent, 
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>P</span>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>Pazar Radarı</div>
            <div style={{ fontSize: '10px', color: t.textMuted }}>Hatay Kadın Kooperatifi</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '10px 8px', flex: 1 }}>
        <div style={{ 
          fontSize: '10px', fontWeight: '600', color: t.textMuted, 
          textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px 4px' 
        }}>Yönetim</div>
        
        {navItems.map(({ id, label }) => (
          <button 
            key={id} 
            onClick={() => setPage(id)} 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', 
              background: page === id ? t.navActive : 'transparent', 
              color: page === id ? t.text : t.textSecondary, 
              cursor: 'pointer', fontSize: '13px', fontWeight: page === id ? '600' : '400', 
              marginBottom: '4px', transition: 'all 0.2s' 
            }}
          >
            <span>{label}</span>
            {id === 'alerts' && alertCount > 0 && (
              <span style={{ 
                background: t.danger, color: 'white', borderRadius: '10px', 
                padding: '1px 6px', fontSize: '10px', fontWeight: '700' 
              }}>{alertCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: `1px solid ${t.borderLight}` }}>
        <button 
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} 
          style={{ 
            width: '100%', padding: '8px 12px', borderRadius: '6px', 
            border: `1px solid ${t.border}`, background: t.navActive, 
            color: t.textSecondary, cursor: 'pointer', fontSize: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' 
          }}
        >
          {mode === 'light' ? '🌙 Koyu Tema' : '☀️ Açık Tema'}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', paddingLeft: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.success }} />
          <span style={{ fontSize: '11px', color: t.textMuted }}>Bulut Bağlantısı Aktif</span>
        </div>
      </div>
    </aside>
  );
}