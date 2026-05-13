import React from 'react';
import { useTheme } from '../App';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ label, value, sub, trend, color }) {
  const { t, mode } = useTheme();

  const isPositive = trend?.startsWith('+');

  return (
    <div style={{
      background: t.card,
      border: `1px solid ${t.border}`,
      borderRadius: '24px',
      padding: '24px',
      minHeight: '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, border-color 0.3s ease',
      cursor: 'default'
    }}>
      <div>
        <div style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: t.textMuted,
          fontWeight: 800,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.accentSecondary }} />
          {label}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            color: color || t.accent,
            lineHeight: '1'
          }}>
            {value}
          </div>

          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 8px',
              borderRadius: '8px',
              background: isPositive ? 'rgba(0, 220, 130, 0.1)' : 'rgba(255, 51, 51, 0.1)',
              color: isPositive ? t.success : t.danger,
              fontSize: '12px',
              fontWeight: 700,
              border: `1px solid ${isPositive ? 'rgba(0, 220, 130, 0.1)' : 'rgba(255, 51, 51, 0.1)'}`
            }}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend}
            </div>
          )}
        </div>
      </div>

      {sub && (
        <div style={{
          fontSize: '13px',
          color: t.textSecondary,
          fontWeight: 500,
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{ opacity: 0.5 }}>•</div>
          {sub}
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: `radial-gradient(circle at top right, ${t.accentSoft}, transparent 70%)`,
        opacity: 0.5
      }} />
    </div>
  );
}