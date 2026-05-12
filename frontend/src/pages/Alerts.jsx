import React from 'react';
import { useTheme } from '../App';

export default function Alerts({ proactive, summary }) {
  const { t } = useTheme();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ 
          fontSize: '20px', fontWeight: '600', margin: '0 0 4px', 
          letterSpacing: '-0.4px', color: t.text 
        }}>Sistem Uyarıları & Aksiyonlar</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>
          {proactive?.anomaly_count || 0} aktif anomali tespit edildi ve işlendi.
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        {proactive?.actions && proactive.actions.length > 0 ? (
          proactive.actions.map((action, i) => (
            <div key={i} style={{ 
              background: t.card, border: `1px solid ${t.border}`, 
              borderLeft: `4px solid ${t.warning}`, borderRadius: '12px', 
              padding: '16px 20px', marginBottom: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ 
                fontSize: '14px', fontWeight: '600', color: t.text, 
                marginBottom: '8px' 
              }}>
                {action.anomaly}
              </div>
              <div style={{ 
                fontSize: '12px', color: t.success, fontWeight: '600', 
                display: 'flex', alignItems: 'center', gap: '6px' 
              }}>
                <span style={{ 
                  background: t.success, color: 'white', borderRadius: '50%', 
                  width: '14px', height: '14px', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: '10px' 
                }}>✓</span> 
                {action.action}
              </div>
              {action.detail && (
                <div style={{ 
                  fontSize: '11px', color: t.textMuted, marginTop: '8px', 
                  fontStyle: 'italic', background: t.navActive, padding: '8px', borderRadius: '6px' 
                }}>
                  {action.detail}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ 
            padding: '20px', textAlign: 'center', background: t.card, 
            borderRadius: '12px', border: `1px dashed ${t.border}`, color: t.textMuted 
          }}>
            Şu an için müdahale gerektiren bir anomali bulunmuyor.
          </div>
        )}
      </div>

      {summary && (
        <div style={{ 
          background: t.card, border: `1px solid ${t.border}`, 
          borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
        }}>
          <div style={{ 
            fontSize: '11px', fontWeight: '700', color: t.accent, 
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' 
          }}>
            Stratejik AI Raporu
          </div>
          <div style={{ 
            fontSize: '13px', color: t.text, lineHeight: '1.7', 
            whiteSpace: 'pre-wrap', fontWeight: '400' 
          }}>
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}