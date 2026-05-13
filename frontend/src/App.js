import React, { useState, useEffect, createContext, useContext } from 'react';
import { api } from './api';
import { themes } from './theme';
import { 
  LayoutDashboard, PackageSearch, Boxes, BellRing, 
  Bot, Activity, Moon, Sun, ChevronRight, 
  Zap, Globe, Layers, Command, BookOpen
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Alerts from './pages/Alerts';
import Market from './pages/Market';
import Chat from './pages/Chat';
import Decisions from './pages/Decisions';
import Briefing from './pages/Briefing'; 

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [mode, setMode] = useState('dark');
  const [data, setData] = useState({ 
    orders: [], 
    stock: [], 
    decisions: [], 
    proactive: null, 
    summary: '' 
  });

  const t = themes[mode];

  useEffect(() => {
    const init = async () => {
      try {
        const [o, s, p, sm, d] = await Promise.all([
          api.getOrders(), 
          api.getStock(), 
          api.getProactive(), 
          api.getSummary(), 
          api.getDecisions()
        ]);
        setData({ 
          orders: o || [], 
          stock: s || [], 
          proactive: p || null, 
          summary: sm?.summary || '', 
          decisions: d || [] 
        });
      } catch (err) {
        console.error("Veri senkronizasyon hatası:", err);
      }
    };
    init();
  }, []);

  const NAV_GROUPS = [
    {
      label: 'Strateji',
      items: [
        { id: 'dashboard', label: 'Komuta Merkezi', icon: LayoutDashboard },
        { id: 'market', label: 'Pazar İstihbaratı', icon: Globe },
      ]
    },
    {
      label: 'Operasyon',
      items: [
        { id: 'orders', label: 'Sipariş Akışı', icon: PackageSearch },
        { id: 'stock', label: 'Envanter Matrix', icon: Boxes },
        { id: 'decisions', label: 'Karar Kayıtları', icon: Activity },
      ]
    },
    {
      label: 'Yapay Zeka',
      items: [
        { id: 'briefing', label: 'Stratejik Brifing', icon: BookOpen },
        { id: 'alerts', label: 'AI Monitoring', icon: BellRing, badge: true },
        { id: 'chat', label: 'Nexus AI', icon: Bot },
      ]
    }
  ];

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <Dashboard {...data} />;
      case 'briefing': return <Briefing summary={data.summary} />;
      case 'orders': return <Orders orders={data.orders} />;
      case 'stock': return <Stock stock={data.stock} />;
      case 'alerts': return <Alerts proactive={data.proactive} />;
      case 'market': return <Market />;
      case 'chat': return <Chat />;
      case 'decisions': return <Decisions decisions={data.decisions} />;
      default: return <Dashboard {...data} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ t, mode, setMode }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          font-family: 'Geist', sans-serif; 
          -webkit-font-smoothing: antialiased; 
        }

        body { 
          background: ${t.bg}; 
          color: ${t.text}; 
          overflow: hidden; 
        }

        .sidebar-item {
          transition: all 0.2s ease;
          border: 1px solid transparent;
          text-decoration: none;
        }
        
        .sidebar-item:hover {
          background: ${t.surface};
          border-color: ${t.border};
          color: ${t.accent} !important;
        }

        .active-tab {
          background: ${t.navActive} !important;
          border-color: ${t.border} !important;
          color: ${t.accent} !important;
        }

        .main-container {
          background-image: radial-gradient(circle at 2px 2px, ${t.border} 1px, transparent 0);
          background-size: 40px 40px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .content-animate {
          animation: fadeIn 0.4s ease-out forwards;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${t.border};
          border-radius: 10px;
        }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        
        <aside style={{ 
          width: '260px', 
          background: t.sidebar, 
          borderRight: `1px solid ${t.border}`,
          display: 'flex', 
          flexDirection: 'column', 
          padding: '24px 16px',
          zIndex: 10
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
                {group.items.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={`sidebar-item ${page === item.id ? 'active-tab' : ''}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 12px',
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontSize: '13.5px', 
                      fontWeight: 500,
                      color: page === item.id ? t.text : t.textMuted, 
                      marginBottom: '2px'
                    }}
                  >
                    <item.icon size={16} strokeWidth={page === item.id ? 2.5 : 2} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && data.proactive?.anomaly_count > 0 && (
                      <div style={{ 
                        background: t.danger, 
                        color: 'white', 
                        fontSize: '10px', 
                        padding: '1px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 700 
                      }}>{data.proactive.anomaly_count}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', borderTop: `1px solid ${t.border}` }}>
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
                height: '36px',
                borderRadius: '8px'
              }}
            >
              {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />} 
              {mode === 'dark' ? 'Gündüz Modu' : 'Gece Modu'}
            </button>
          </div>
        </aside>

        <main className="main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <header style={{ 
            height: '64px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 40px', 
            borderBottom: `1px solid ${t.border}`, 
            background: t.bg
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Command size={14} color={t.textMuted} />
              <div style={{ fontSize: '12px', color: t.textMuted, fontWeight: 500 }}>
                Radar <ChevronRight size={12} style={{ verticalAlign: 'middle', margin: '0 4px' }} /> 
                <span style={{ color: t.text }}>{NAV_GROUPS.flatMap(g => g.items).find(i => i.id === page)?.label.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: t.success,
                  boxShadow: `0 0 10px ${t.success}`
                }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: t.textMuted }}>SİSTEM AKTİF</span>
              </div>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                border: `1px solid ${t.border}`, 
                background: t.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                 <Zap size={14} color={t.accentSecondary} />
              </div>
            </div>
          </header>

          <section style={{ flex: 1, overflowY: 'auto', padding: 'clamp(20px, 5vw, 40px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="content-animate">
              {/* Buradaki mükerrer başlık alanı senin paylaştığın koda göre kaldırılmıştır */}
              {renderPage()}
            </div>
          </section>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}