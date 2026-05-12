import React from 'react';
import { useTheme } from '../App';

export default function Dashboard({ orders, stock, proactive }) {
  const { t } = useTheme();

  const StatCard = ({ label, value, color, sub }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px 22px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '700', color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '8px', fontWeight: '500' }}>{sub}</div>}
    </div>
  );

  const statusStyle = (s) => {
    const config = {
      beklemede: { color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' },
      'kargoya verildi': { color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe' },
      tamamlandı: { color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' },
    };
    return config[s] || { color: t.textMuted, background: t.navActive, border: `1px solid ${t.border}` };
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>Genel Bakış</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Operasyonel durum ve anlık envanter analizi</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Toplam Sipariş" value={orders.length} color={t.text} sub="Sistem geneli" />
        <StatCard label="Bekleyen İşlem" value={orders.filter(o => o.status === 'beklemede').length} color={t.warning} sub="Hazırlanacak" />
        <StatCard label="Kritik Stok" value={stock.filter(s => Number(s.stock_quantity) <= Number(s.critical_threshold)).length} color={t.danger} sub="Müdahale gerekli" />
        <StatCard label="Aktif Anomali" value={proactive?.anomaly_count || 0} color={t.purple} sub="AI tarafından tespit edildi" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', marginBottom: '20px' }}>Son Akış</div>
          {orders.slice(0, 6).map((o, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 5 ? `1px solid ${t.borderLight}` : 'none' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>{o.customer_name}</div>
                <div style={{ fontSize: '12px', color: t.textSecondary, marginTop: '2px' }}>Sipariş No: #{o.order_number}</div>
              </div>
              <span style={{ ...statusStyle(o.status), padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>{o.status}</span>
            </div>
          ))}
        </div>

        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', marginBottom: '20px' }}>Kritik Envanter Takibi</div>
          {stock.slice(0, 8).map((item, i) => {
            const isCritical = Number(item.stock_quantity) <= Number(item.critical_threshold);
            return (
              <div key={i} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: t.text }}>{item.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: isCritical ? t.danger : t.success }}>
                    {item.stock_quantity} {item.unit}
                  </span>
                </div>
                <div style={{ height: '6px', background: t.navActive, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: isCritical ? t.danger : t.success, 
                    width: `${Math.min((item.stock_quantity / (item.critical_threshold * 2.5)) * 100, 100)}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}