import React from 'react';
import { useTheme } from '../App';
import { ShoppingCart, User, Globe, CreditCard, Calendar, Filter } from 'lucide-react';

export default function Orders({ orders }) {
  const { t } = useTheme();

  const getStatusBadge = (status) => {
    const config = {
      beklemede: { color: t.warning, bg: 'rgba(245, 158, 11, 0.1)' },
      'kargoya verildi': { color: t.accentSecondary, bg: 'rgba(99, 102, 241, 0.1)' },
      tamamlandı: { color: t.success, bg: 'rgba(0, 220, 130, 0.1)' },
      iptal: { color: t.danger, bg: 'rgba(255, 51, 51, 0.1)' },
    };
    const s = config[status] || { color: t.textMuted, bg: t.surface };
    
    return (
      <span style={{ 
        padding: '4px 10px', 
        borderRadius: '8px', 
        fontSize: '10px', 
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.bg}`,
        whiteSpace: 'nowrap'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        gap: '16px',
        flexWrap: 'wrap' 
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: t.accent, letterSpacing: '-1px', margin: 0 }}>Sipariş Akışı</h1>
          <p style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
            Sistem üzerinden geçen tüm aktif ve geçmiş talepler.
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px 16px',
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          color: t.textSecondary,
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}>
          <Filter size={14} /> <span>Filtrele</span>
        </div>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '20px', 
        overflow: 'hidden',
        width: '100%',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          overflowX: 'auto', 
          width: '100%',
          WebkitOverflowScrolling: 'touch' 
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            textAlign: 'left',
            minWidth: '700px',
            tableLayout: 'fixed'
          }}>
            <thead>
              <tr style={{ background: t.sidebar }}>
                {[
                  { label: 'İşlem No', icon: ShoppingCart, width: '15%' },
                  { label: 'Müşteri', icon: User, width: '30%' },
                  { label: 'Kanal', icon: Globe, width: '15%' },
                  { label: 'Tutar', icon: CreditCard, width: '15%' },
                  { label: 'Tarih', icon: Calendar, width: '15%' },
                  { label: 'Durum', icon: null, width: '10%' }
                ].map((h, i) => (
                  <th key={i} style={{ 
                    padding: '16px 20px', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    color: t.textMuted, 
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    width: h.width
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {h.icon && <h.icon size={12} />} {h.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr 
                  key={i} 
                  style={{ 
                    borderBottom: i < orders.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = t.surface}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: t.accent }}>
                    #{o.order_number}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.customer_name}
                    </div>
                    <div style={{ fontSize: '10px', color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      ID: {o.id}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', color: t.textSecondary, whiteSpace: 'nowrap' }}>
                      {o.order_channel || 'Web'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: t.text, whiteSpace: 'nowrap' }}>
                    ₺{Number(o.total_amount).toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '12px', color: t.textMuted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {o.order_date ? new Date(o.order_date).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {getStatusBadge(o.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: t.textMuted }}>
            <ShoppingCart size={40} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <div style={{ fontSize: '14px', fontWeight: 500 }}>Sipariş verisi bulunamadı.</div>
          </div>
        )}
      </div>
    </div>
  );
}