import React from 'react';
import { useTheme } from '../App';
import { 
  LayoutDashboard, Package, Boxes, BellRing, BrainCircuit, 
  MessageSquare, Activity, Moon, Sun, Layers, ChevronRight, Command
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Strateji',
    items: [
      { id: 'dashboard', label: 'Komuta Merkezi', icon: LayoutDashboard },
      { id: 'market', label: 'Pazar İstihbaratı', icon: BrainCircuit },
    ]
  },
  {
    label: 'Operasyon',
    items: [
      { id: 'orders', label: 'Sipariş Akışı', icon: Package },
      { id: 'stock', label: 'Envanter Matrix', icon: Boxes },
      { id: 'decisions', label: 'Karar Kayıtları', icon: Activity },
    ]
  },
  {
    label: 'Yapay Zeka',
    items: [
      { id: 'alerts', label: 'AI Monitoring', icon: BellRing, badge: true },
      { id: 'chat', label: 'Nexus AI', icon: MessageSquare },
    ]
  }
];

export default function Sidebar({ page, setPage, alertCount }) {
  const { t, mode, setMode } = useTheme();

  return (
    <aside style={{ 
      width: '260px', 
      background: t.sidebar, 
      borderRight: `1px solid ${t.border}`,
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px 16px',
      zIndex: 100 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '40px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: t.accent, 
          borderRadius: '6px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Layers size={18} color={mode === 'dark' ? '#000' : '#FFF'} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.5px', color: t.text }}>PAZAR RADARI</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '28px' }}>
            <div style={{ 
              fontSize: '11px', 
              color: t.textMuted, 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              padding: '0 12px 12px' 
            }}>
              {group.label}
            </div>
            {group.items.map(item => {
              const active = page === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px 12px',
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13.5px', 
                    fontWeight: 500,
                    marginBottom: '2px',
                    transition: 'all 0.2s ease',
                    background: active ? t.surface : 'transparent',
                    border: `1px solid ${active ? t.border : 'transparent'}`,
                    color: active ? t.accent : t.textMuted,
                  }}
                >
                  <item.icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                  {item.badge && alertCount > 0 && (
                    <div style={{ 
                      marginLeft: 'auto', 
                      background: t.danger, 
                      color: 'white', 
                      fontSize: '10px', 
                      padding: '1px 6px', 
                      borderRadius: '4px', 
                      fontWeight: 700 
                    }}>{alertCount}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 0', borderTop: `1px solid ${t.border}` }}>
        <button 
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          style={{ 
            width: '100%', 
            background: t.surface, 
            border: `1px solid ${t.border}`, 
            color: t.text,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '10px', 
            cursor: 'pointer', 
            fontSize: '13px',
            fontWeight: 600,
            height: '40px',
            borderRadius: '10px',
            marginBottom: '16px'
          }}
        >
          {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />} 
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div style={{ 
          padding: '12px', 
          borderRadius: '12px', 
          background: t.surface, 
          border: `1px solid ${t.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: t.success,
              boxShadow: `0 0 10px ${t.success}`
            }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: t.text }}>Sistem Aktif</div>
              <div style={{ fontSize: '10px', color: t.textMuted }}>Node: IST-01 Online</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}