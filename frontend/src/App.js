import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Sun, Moon, Package, BarChart2, AlertTriangle, MessageSquare, TrendingUp, ChevronRight, CheckCircle, Clock, Truck } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState('');
  const [proactive, setProactive] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const t = {
    dark: {
      bg: '#0f172a', sidebar: '#111827', card: '#1e293b',
      border: '#1f2937', text: '#f1f5f9', muted: '#64748b',
      input: '#111827', accent: '#3b82f6', hover: '#1f2937'
    },
    light: {
      bg: '#f8fafc', sidebar: '#ffffff', card: '#ffffff',
      border: '#e2e8f0', text: '#0f172a', muted: '#94a3b8',
      input: '#f1f5f9', accent: '#3b82f6', hover: '#f1f5f9'
    }
  }[theme];

  useEffect(() => {
    axios.get(`${API}/summary`).then(r => setSummary(r.data.summary)).catch(() => {});
    axios.get(`${API}/proactive`).then(r => setProactive(r.data)).catch(() => {});
    axios.get(`${API}/orders`).then(r => setOrders(r.data)).catch(() => {});
    axios.get(`${API}/stock`).then(r => setStock(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    const text = message;
    setChat(p => [...p, { role: 'user', text }]);
    setMessage('');
    try {
      const res = await axios.post(`${API}/chat`, { message: text });
      setChat(p => [...p, { role: 'ai', text: res.data.response }]);
    } catch {
      setChat(p => [...p, { role: 'ai', text: 'Bağlantı hatası.' }]);
    }
    setLoading(false);
  };

  const statusColor = s => ({ beklemede: '#f59e0b', kargoda: '#3b82f6', 'teslim edildi': '#10b981' }[s] || '#64748b');
  const statusBg = s => ({ beklemede: '#fef3c720', kargoda: '#3b82f620', 'teslim edildi': '#10b98120' }[s] || '#64748b20');

  const navItems = [
    { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
    { id: 'orders', icon: Package, label: 'Siparişler' },
    { id: 'stock', icon: TrendingUp, label: 'Stok' },
    { id: 'alerts', icon: AlertTriangle, label: 'Uyarılar' },
    { id: 'chat', icon: MessageSquare, label: 'AI Asistan' },
  ];

  const StatCard = ({ label, value, color, sub }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px 24px' }}>
      <p style={{ color: t.muted, fontSize: '13px', margin: '0 0 8px', fontWeight: '500' }}>{label}</p>
      <p style={{ color, fontSize: '28px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{value}</p>
      {sub && <p style={{ color: t.muted, fontSize: '12px', margin: 0 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: t.text, transition: 'all 0.2s' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '240px', background: t.sidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: t.accent, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Pazar Radarı</p>
              <p style={{ margin: 0, fontSize: '11px', color: t.muted }}>KOBİ AI Platformu</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: activeTab === id ? `${t.accent}15` : 'transparent', color: activeTab === id ? t.accent : t.muted, cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === id ? '600' : '400', marginBottom: '2px', transition: 'all 0.15s', textAlign: 'left' }}>
              <Icon size={16} />
              {label}
              {id === 'alerts' && proactive?.anomaly_count > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' }}>
                  {proactive.anomaly_count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: t.hover, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '8px 12px', color: t.text, cursor: 'pointer', fontSize: '13px', width: '100%' }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', maxWidth: 'calc(100vw - 240px)' }}>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>Dashboard</h1>
              <p style={{ margin: 0, color: t.muted, fontSize: '14px' }}>İşletmenizin anlık durumu</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <StatCard label="Toplam Sipariş" value={orders.length} color={t.accent} sub="Tüm zamanlar" />
              <StatCard label="Bekleyen" value={orders.filter(o => o.status === 'beklemede').length} color="#f59e0b" sub="İşlem bekliyor" />
              <StatCard label="Kritik Stok" value={stock.filter(s => s.quantity <= s.threshold).length} color="#ef4444" sub="Acil sipariş gerekli" />
              <StatCard label="Aktif Uyarı" value={proactive?.anomaly_count || 0} color="#a855f7" sub="Tespit edildi" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
                <p style={{ margin: '0 0 16px', fontWeight: '600', fontSize: '15px' }}>Son Siparişler</p>
                {orders.slice(0, 4).map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? `1px solid ${t.border}` : 'none' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '500' }}>{o.customer}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: t.muted }}>{o.product}</p>
                    </div>
                    <span style={{ background: statusBg(o.status), color: statusColor(o.status), padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
                <p style={{ margin: '0 0 16px', fontWeight: '600', fontSize: '15px' }}>Stok Durumu</p>
                {stock.map((s, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px' }}>{s.product}</span>
                      <span style={{ fontSize: '13px', color: s.quantity <= s.threshold ? '#ef4444' : '#10b981', fontWeight: '600' }}>{s.quantity} {s.unit}</span>
                    </div>
                    <div style={{ background: t.border, borderRadius: '4px', height: '4px' }}>
                      <div style={{ background: s.quantity <= s.threshold ? '#ef4444' : '#10b981', height: '4px', borderRadius: '4px', width: `${Math.min((s.quantity / (s.threshold * 2)) * 100, 100)}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SİPARİŞLER */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>Siparişler</h1>
              <p style={{ margin: 0, color: t.muted, fontSize: '14px' }}>{orders.length} sipariş listeleniyor</p>
            </div>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}`, background: t.hover }}>
                    {['Sipariş No', 'Müşteri', 'Ürün', 'Tarih', 'Durum'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: t.accent, fontWeight: '600' }}>{o.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.customer}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: t.muted }}>{o.product}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: t.muted }}>{o.created_at}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: statusBg(o.status), color: statusColor(o.status), padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STOK */}
        {activeTab === 'stock' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>Stok Yönetimi</h1>
              <p style={{ margin: 0, color: t.muted, fontSize: '14px' }}>{stock.filter(s => s.quantity <= s.threshold).length} ürün kritik seviyede</p>
            </div>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}`, background: t.hover }}>
                    {['Ürün', 'Mevcut', 'Eşik', 'Birim', 'Doluluk', 'Durum'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stock.map((s, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500' }}>{s.product}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: s.quantity <= s.threshold ? '#ef4444' : '#10b981', fontWeight: '700' }}>{s.quantity}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: t.muted }}>{s.threshold}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: t.muted }}>{s.unit}</td>
                      <td style={{ padding: '14px 16px', width: '120px' }}>
                        <div style={{ background: t.border, borderRadius: '4px', height: '6px' }}>
                          <div style={{ background: s.quantity <= s.threshold ? '#ef4444' : '#10b981', height: '6px', borderRadius: '4px', width: `${Math.min((s.quantity / (s.threshold * 2)) * 100, 100)}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: s.quantity <= s.threshold ? '#ef444420' : '#10b98120', color: s.quantity <= s.threshold ? '#ef4444' : '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {s.quantity <= s.threshold ? 'Kritik' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UYARILAR */}
        {activeTab === 'alerts' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>Uyarılar & Aksiyonlar</h1>
              <p style={{ margin: 0, color: t.muted, fontSize: '14px' }}>Sistem tarafından tespit edilen anomaliler</p>
            </div>
            {proactive?.actions.map((action, i) => (
              <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', background: '#ef444420', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={16} color="#ef4444" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '600', color: t.text }}>{action.anomaly}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <p style={{ margin: 0, fontSize: '13px', color: '#10b981' }}>{action.action}</p>
                  </div>
                </div>
                <ChevronRight size={16} color={t.muted} />
              </div>
            ))}

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
              <p style={{ margin: '0 0 16px', fontWeight: '600', fontSize: '15px' }}>Günlük AI Raporu</p>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: t.muted, lineHeight: '1.7', margin: 0, fontFamily: 'inherit' }}>{summary}</pre>
            </div>
          </div>
        )}

        {/* AI ASISTAN */}
        {activeTab === 'chat' && (
          <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>AI Asistan</h1>
              <p style={{ margin: 0, color: t.muted, fontSize: '14px' }}>İşletme verilerinize dayalı anlık sorular sorun</p>
            </div>
            <div style={{ flex: 1, background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                {chat.length === 0 && (
                  <div style={{ textAlign: 'center', color: t.muted, paddingTop: '60px' }}>
                    <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                    <p style={{ fontSize: '15px', fontWeight: '500', margin: '0 0 8px' }}>Nasıl yardımcı olabilirim?</p>
                    <p style={{ fontSize: '13px', margin: 0 }}>Sipariş durumu, stok analizi veya pazar trendleri hakkında sorabilirsiniz.</p>
                  </div>
                )}
                {chat.map((m, i) => (
                  <div key={i} style={{ marginBottom: '16px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: m.role === 'user' ? t.accent : t.hover, padding: '10px 16px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: '14px', maxWidth: '70%', lineHeight: '1.6', border: `1px solid ${t.border}` }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex' }}>
                    <div style={{ background: t.hover, padding: '10px 16px', borderRadius: '16px', fontSize: '14px', color: t.muted, border: `1px solid ${t.border}` }}>
                      Yanıt hazırlanıyor...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '12px' }}>
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Sorunuzu yazın..." style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', background: t.input, border: `1px solid ${t.border}`, color: t.text, fontSize: '14px', outline: 'none' }} />
                <button onClick={sendMessage} style={{ padding: '10px 20px', background: t.accent, border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}