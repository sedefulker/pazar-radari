import React from 'react';
import { useTheme } from '../App';

export default function Stock({ stock }) {
  const { t } = useTheme();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>Stok & Envanter Yönetimi</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>
          {stock.filter(s => Number(s.stock_quantity) <= Number(s.critical_threshold)).length} ürün kritik eşiğin altında
        </p>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.navActive }}>
              {['Ürün Adı', 'Miktar', 'Eşik', 'Birim', 'Doluluk', 'Durum'].map(h => (
                <th key={h} style={{ 
                  padding: '12px 16px', textAlign: 'left', fontSize: '11px', 
                  fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', 
                  letterSpacing: '0.05em', borderBottom: `1px solid ${t.border}` 
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map((item, i) => {
              const isCritical = Number(item.stock_quantity) <= Number(item.critical_threshold);
              const fillPercentage = Math.min((Number(item.stock_quantity) / (Number(item.critical_threshold) * 2.5)) * 100, 100);

              return (
                <tr key={i} style={{ 
                  borderBottom: i < stock.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: t.text }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: isCritical ? t.danger : t.success }}>
                    {item.stock_quantity}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: t.textMuted }}>
                    {item.critical_threshold}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: t.textMuted }}>
                    {item.unit}
                  </td>
                  <td style={{ padding: '14px 16px', width: '160px' }}>
                    <div style={{ height: '6px', background: t.navActive, borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        background: isCritical ? t.danger : t.success, 
                        width: `${fillPercentage}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      color: isCritical ? '#dc2626' : '#059669', 
                      background: isCritical ? '#fef2f2' : '#f0fdf4', 
                      border: `1px solid ${isCritical ? '#fee2e2' : '#d1fae5'}`,
                      display: 'inline-block'
                    }}>
                      {isCritical ? 'KRİTİK' : 'NORMAL'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}