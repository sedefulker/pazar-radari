import React from 'react';
import { useTheme } from '../App';
import { Boxes, AlertTriangle, BarChart, CheckCircle2, Info, Package } from 'lucide-react';

export default function Stock({ stock }) {
  const { t } = useTheme();

  const criticalCount = stock.filter(s => Number(s.stock_quantity) <= Number(s.critical_threshold)).length;

  const getStatusBadge = (isCritical) => (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: isCritical ? 'rgba(255, 51, 51, 0.1)' : 'rgba(0, 220, 130, 0.1)',
      color: isCritical ? t.danger : t.success,
      border: `1px solid ${isCritical ? 'rgba(255, 51, 51, 0.1)' : 'rgba(0, 220, 130, 0.1)'}`
    }}>
      {isCritical ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
      {isCritical ? 'Kritik' : 'Normal'}
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: t.accent, letterSpacing: '-1px' }}>Envanter Matrix</h1>
          <p style={{ fontSize: '14px', color: t.textMuted, marginTop: '4px' }}>
            {criticalCount > 0 
              ? `${criticalCount} ürün kritik stok seviyesinin altında seyrediyor.` 
              : 'Tüm stok kalemleri operasyonel limitler dahilinde.'}
          </p>
        </div>
        <div style={{ 
          padding: '10px 18px', 
          background: t.surface, 
          borderRadius: '12px', 
          border: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <BarChart size={16} color={t.accentSecondary} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>Stok Sağlık Skoru: %{Math.round(((stock.length - criticalCount) / stock.length) * 100)}</span>
        </div>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '24px', 
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: t.sidebar }}>
              {[
                { label: 'Envanter Kalemi', icon: Package },
                { label: 'Mevcut', icon: null },
                { label: 'Eşik', icon: null },
                { label: 'Birim', icon: null },
                { label: 'Sağlık İndeksi', icon: Info },
                { label: 'Durum', icon: null }
              ].map((h, i) => (
                <th key={i} style={{ 
                  padding: '16px 24px', 
                  fontSize: '10px', 
                  fontWeight: 800, 
                  color: t.textMuted, 
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {h.icon && <h.icon size={12} />} {h.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map((item, i) => {
              const isCritical = Number(item.stock_quantity) <= Number(item.critical_threshold);
              const fillPercentage = Math.min((Number(item.stock_quantity) / (Number(item.critical_threshold) * 2)) * 100, 100);

              return (
                <tr 
                  key={i} 
                  style={{ 
                    borderBottom: i < stock.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = t.surface}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: t.textMuted }}>SKU: {item.id || 'N/A'}</div>
                  </td>
                  
                  <td style={{ padding: '20px 24px', fontSize: '15px', fontWeight: 700, color: isCritical ? t.danger : t.text, fontFamily: 'Geist Mono, monospace' }}>
                    {item.stock_quantity}
                  </td>

                  <td style={{ padding: '20px 24px', fontSize: '13px', color: t.textSecondary, fontFamily: 'Geist Mono, monospace' }}>
                    {item.critical_threshold}
                  </td>

                  <td style={{ padding: '20px 24px', fontSize: '12px', color: t.textMuted, fontWeight: 500 }}>
                    {item.unit}
                  </td>

                  <td style={{ padding: '20px 24px', width: '220px' }}>
                    <div style={{ 
                      height: '6px', 
                      background: t.bg, 
                      borderRadius: '10px', 
                      overflow: 'hidden',
                      border: `1px solid ${t.borderLight}`,
                      width: '100%'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${fillPercentage}%`,
                        background: isCritical ? `linear-gradient(90deg, ${t.danger}, #ff5f6d)` : `linear-gradient(90deg, ${t.success}, #00f2fe)`,
                        borderRadius: '10px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </td>

                  <td style={{ padding: '20px 24px' }}>
                    {getStatusBadge(isCritical)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {stock.length === 0 && (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <Boxes size={48} color={t.border} style={{ marginBottom: '16px' }} />
            <div style={{ color: t.textMuted, fontSize: '14px' }}>Envanter verisi henüz yüklenmedi.</div>
          </div>
        )}
      </div>
    </div>
  );
}