import React from 'react';
import { useTheme } from '../App';
import { Shield, Activity, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export default function Decisions({ decisions }) {
  const { t } = useTheme();

  const getStatusBadge = (approved) => {
    return (
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: approved ? 'rgba(0, 220, 130, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        color: approved ? t.success : t.warning,
        border: `1px solid ${approved ? 'rgba(0, 220, 130, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
      }}>
        {approved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
        {approved ? 'Onaylandı' : 'Beklemede'}
      </div>
    );
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '24px', 
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              background: t.surface, border: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={20} color={t.accentSecondary} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text }}>Karar Logları</h3>
              <p style={{ fontSize: '12px', color: t.textMuted }}>AI tarafından üretilen aksiyon geçmişi</p>
            </div>
          </div>
          <Activity size={18} color={t.textMuted} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: t.sidebar }}>
                {['OLAY / RİSK MATRİSİ', 'STRATEJİK AKSİYON', 'DURUM', 'ZAMAN DAMGASI'].map((h) => (
                  <th key={h} style={{ 
                    padding: '16px 32px', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    color: t.textMuted, 
                    letterSpacing: '1px' 
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisions && decisions.length > 0 ? (
                decisions.map((d, i) => (
                  <tr key={i} style={{ 
                    borderBottom: i < decisions.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                    transition: 'background 0.2s',
                    cursor: 'default'
                  }} onMouseEnter={(e) => e.currentTarget.style.background = t.surface}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ color: t.accent }}>
                          <AlertCircle size={16} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>
                          {d.incident_type || "Genel Analiz"}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ 
                        fontSize: '13.5px', 
                        color: t.textSecondary, 
                        lineHeight: '1.5',
                        maxWidth: '400px'
                      }}>
                        {d.proposed_action || "Aksiyon detaylandırılmadı"}
                      </div>
                    </td>

                    <td style={{ padding: '20px 32px' }}>
                      {getStatusBadge(d.is_approved)}
                    </td>

                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textMuted, fontSize: '13px' }}>
                        <Calendar size={14} />
                        <span style={{ fontFamily: 'Geist Mono, monospace' }}>
                          {d.created_at ? new Date(d.created_at).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '80px 32px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Activity size={40} color={t.border} />
                      <div style={{ color: t.textMuted, fontSize: '14px', fontWeight: 500 }}>
                        Henüz işlenmiş bir karar verisi bulunmuyor.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}