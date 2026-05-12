import React from 'react';
import { useTheme } from '../App';

export default function Orders({ orders }) {
  const { t } = useTheme();

  const statusStyle = (s) => {
    const config = {
      beklemede: { color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' },
      'kargoya verildi': { color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe' },
      tamamlandı: { color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' },
      iptal: { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' },
    };
    return config[s] || { color: t.textSecondary, background: t.navActive, border: `1px solid ${t.border}` };
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>Sipariş Yönetimi</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>
          {orders.length} toplam kayıt bulundu
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
              {['No', 'Müşteri', 'Kanal', 'Tutar', 'Tarih', 'Durum'].map(h => (
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
            {orders.map((o, i) => (
              <tr key={i} style={{ 
                borderBottom: i < orders.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                transition: 'background 0.2s'
              }}>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: t.accent, fontWeight: '700' }}>
                  #{o.order_number}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: t.text }}>
                  {o.customer_name}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: t.textSecondary }}>
                  {o.order_channel || 'Web'}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: t.text }}>
                  ₺{o.total_amount}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: t.textMuted }}>
                  {o.order_date ? new Date(o.order_date).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ 
                    ...statusStyle(o.status), 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontWeight: '600',
                    display: 'inline-block',
                    whiteSpace: 'nowrap'
                  }}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}