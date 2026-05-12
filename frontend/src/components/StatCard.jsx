import React from 'react';
import { useTheme } from '../App';

export default function StatCard({ label, value, color, sub, trend }) {
  const { t } = useTheme();

  return (
    <div style={{ 
      background: t.card, 
      border: `1px solid ${t.border}`, 
      borderRadius: '12px', 
      padding: '20px 22px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
      flex: 1
    }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: '600', 
        color: t.textMuted, 
        textTransform: 'uppercase', 
        letterSpacing: '0.06em', 
        marginBottom: '10px' 
      }}>
        {label}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        gap: '8px' 
      }}>
        <div style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: color || t.text, 
          letterSpacing: '-1px' 
        }}>
          {value}
        </div>
        
        {trend && (
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: trend.startsWith('+') ? t.success : t.danger 
          }}>
            {trend}
          </span>
        )}
      </div>

      {sub && (
        <div style={{ 
          fontSize: '12px', 
          color: t.textMuted, 
          marginTop: '8px',
          fontWeight: '400' 
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}