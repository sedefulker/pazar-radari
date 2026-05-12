import React from 'react';
import { useTheme } from '../App';

export function Table({ children }) {
  const { t } = useTheme();
  return (
    <div style={{ 
      background: t.card, border: `1px solid ${t.border}`, 
      borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {children}
      </table>
    </div>
  );
}

export function THead({ headers }) {
  const { t } = useTheme();
  return (
    <thead>
      <tr style={{ background: t.navActive }}>
        {headers.map(h => (
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
  );
}

export function TRow({ children, striped }) {
  const { t } = useTheme();
  return (
    <tr style={{ 
      background: striped ? t.navActive : 'transparent', 
      transition: 'background 0.2s' 
    }}>
      {children}
    </tr>
  );
}

export function TCell({ children, style = {} }) {
  const { t } = useTheme();
  return (
    <td style={{ 
      padding: '14px 16px', borderBottom: `1px solid ${t.borderLight}`, 
      fontSize: '13px', color: t.text, ...style 
    }}>
      {children}
    </td>
  );
}

export function StatusChip({ status }) {
  const { t } = useTheme();
  
  const statusConfig = {
    beklemede: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    hazırlanıyor: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    'kargoya verildi': { color: '#1e40af', bg: '#e0e7ff', border: '#c7d2fe' },
    tamamlandı: { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
    'iptal edildi': { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
    Kritik: { color: '#dc2626', bg: '#fef2f2', border: '#fee2e2' },
    Normal: { color: '#059669', bg: '#f0fdf4', border: '#d1fae5' },
  };

  const config = statusConfig[status] || { color: t.textSecondary, bg: t.navActive, border: t.border };

  return (
    <span style={{ 
      display: 'inline-block', padding: '2px 10px', borderRadius: '6px', 
      fontSize: '11px', fontWeight: '600', color: config.color, 
      background: config.bg, border: `1px solid ${config.border}`,
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
}