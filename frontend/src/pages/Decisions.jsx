import React from 'react';
import { useTheme } from '../App';
import { StatusChip } from '../components/Table';

export default function Decisions({ decisions }) {
  const { t } = useTheme();

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>AI Karar Hafızası</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>
          Sistemin geçmişte aldığı proaktif kararlar ve operasyonel aksiyonlar
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
              {['Olay / Risk', 'Önerilen Aksiyon', 'Durum', 'Tarih'].map(h => (
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
            {decisions && decisions.length > 0 ? (
              decisions.map((d, i) => (
                <tr key={i} style={{ 
                  borderBottom: i < decisions.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: t.text }}>
                    {d.description}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: t.textSecondary }}>
                    {d.action}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusChip status={d.approved ? 'tamamlandı' : 'beklemede'} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: t.textMuted, fontFamily: 'monospace' }}>
                    {d.created_at ? new Date(d.created_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: '13px' }}>
                  Henüz kayıtlı bir AI kararı bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}