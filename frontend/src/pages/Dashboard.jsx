import React from 'react';
import { useTheme } from '../App';
import { 
  TrendingUp, AlertCircle, ShoppingBag, Zap, 
  ArrowUpRight, Sparkles, Activity 
} from 'lucide-react';

export default function Dashboard({ orders, stock, proactive }) {
  const { t, mode } = useTheme();

  const MetricCard = ({ label, value, icon: Icon, color, trend }) => (
    <div style={{ 
      background: t.card, 
      border: `1px solid ${t.border}`, 
      borderRadius: '20px', 
      padding: 'clamp(16px, 3vw, 24px)', 
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '140px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '12px', 
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={20} color={color || t.accent} />
        </div>
        {trend && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '4px', color: t.success, 
            fontSize: '11px', fontWeight: 800, background: 'rgba(0, 220, 130, 0.1)',
            padding: '4px 8px', borderRadius: '8px', whiteSpace: 'nowrap'
          }}>
            {trend} <ArrowUpRight size={14} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: t.textMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: t.text, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const styles = {
      beklemede: { bg: t.accentSoft, text: t.accentSecondary },
      'kargoya verildi': { bg: 'rgba(99, 102, 241, 0.1)', text: '#818CF8' },
      tamamlandı: { bg: 'rgba(0, 220, 130, 0.1)', text: t.success }
    };
    const s = styles[status] || { bg: t.surface, text: t.textMuted };
    return (
      <span style={{ 
        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', 
        fontWeight: 800, background: s.bg, color: s.text,
        textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'
      }}>
        {status}
      </span>
    );
  };

  const criticalStockCount = stock?.filter(item => Number(item.stock_quantity) <= Number(item.critical_threshold)).length || 0;
  const pendingOrdersCount = orders?.filter(o => o.status === 'beklemede').length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. ÜST METRİK PANALİ - 4 Ana Kart */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px' 
      }}>
        <MetricCard label="Toplam Sipariş" value={orders?.length || 0} icon={ShoppingBag} trend="+12.5%" />
        <MetricCard label="Bekleyen İşlem" value={pendingOrdersCount} icon={Zap} color={t.warning} />
        <MetricCard label="Kritik Stok" value={criticalStockCount} icon={AlertCircle} color={t.danger} />
        <MetricCard label="AI Anomali" value={proactive?.anomaly_count || 0} icon={TrendingUp} color={t.purple} />
      </div>

      {/* 2. ANALİZ VE AKIŞ PANELİ - 2 Ana Sütun */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px' 
      }}>
        
        {/* Sol Sütun: Sipariş Akışı */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: 'clamp(18px, 3vw, 32px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color={t.accentSecondary} />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: t.text }}>Son Siparişler</h3>
            </div>
            <button style={{ background: t.surface, border: `1px solid ${t.border}`, padding: '6px 12px', borderRadius: '8px', color: t.textSecondary, fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Tümü</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orders?.slice(0, 5).map((order, idx) => (
              <div key={idx} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '12px', borderRadius: '12px', background: t.surface + '25', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 800, color: t.accent }}>{order.customer_name.charAt(0)}</div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: t.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '11px', color: t.textMuted, fontFamily: 'Geist Mono' }}>#{order.order_number}</div>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Sütun: Envanter Sağlığı */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: 'clamp(18px, 3vw, 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Sparkles size={18} color={t.warning} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: t.text }}>Envanter Sağlığı</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {stock?.slice(0, 6).map((item, idx) => {
              const isCritical = Number(item.stock_quantity) <= Number(item.critical_threshold);
              const progress = Math.min((item.stock_quantity / (item.critical_threshold * 2)) * 100, 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: isCritical ? t.danger : t.textSecondary, flexShrink: 0 }}>
                      {item.stock_quantity} <span style={{ fontWeight: 500, color: t.textMuted }}>{item.unit}</span>
                    </div>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: t.surface, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${t.borderLight}` }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: isCritical ? `linear-gradient(90deg, ${t.danger}, #ff5f6d)` : `linear-gradient(90deg, ${t.success}, #00f2fe)`, borderRadius: '10px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}