import React from 'react';
import { useTheme } from '../App';

export function Table({ children }) {
  const { t } = useTheme();

  return (
    <div
      style={{
        background: t.card,
        borderRadius: '24px',
        overflow: 'hidden',
        border: `1px solid ${t.border}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({ headers }) {
  const { t } = useTheme();

  return (
    <thead
      style={{
        background: t.sidebar
      }}
    >
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            style={{
              padding: '16px 24px',
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: t.textMuted,
              borderBottom: `1px solid ${t.border}`
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TRow({ children }) {
  const { t } = useTheme();

  return (
    <tr
      style={{
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.surface;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </tr>
  );
}

export function TCell({ children, style = {} }) {
  const { t } = useTheme();

  return (
    <td
      style={{
        padding: '20px 24px',
        borderBottom: `1px solid ${t.borderLight}`,
        fontSize: '14px',
        fontWeight: 500,
        color: t.text,
        ...style
      }}
    >
      {children}
    </td>
  );
}

export function StatusChip({ status }) {
  const { t } = useTheme();

  const map = {
    beklemede: {
      bg: 'rgba(245, 158, 11, 0.1)',
      color: t.warning
    },
    tamamlandı: {
      bg: 'rgba(0, 220, 130, 0.1)',
      color: t.success
    },
    Kritik: {
      bg: 'rgba(255, 51, 51, 0.1)',
      color: t.danger
    },
    Normal: {
      bg: 'rgba(0, 220, 130, 0.1)',
      color: t.success
    }
  };

  const cfg = map[status] || {
    bg: t.surface,
    color: t.textSecondary
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 12px',
        borderRadius: '8px',
        background: cfg.bg,
        color: cfg.color,
        fontSize: '11px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: `1px solid ${cfg.bg}`
      }}
    >
      {status}
    </div>
  );
}