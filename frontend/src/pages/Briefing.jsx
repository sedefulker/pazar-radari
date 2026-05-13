import React from 'react';
import { useTheme } from '../App';
import { BookOpen, Target, AlertTriangle, Lightbulb, Zap, TrendingUp, Package, ShieldAlert } from 'lucide-react';

export default function Briefing({ summary }) {
  const { t, mode } = useTheme();

  // Akıllı metin temizleme ve Markdown listelerini algılama
  const parseSection = (text) => {
    if (!text) return null;
    
    // Markdown yıldızlarını ve özel karakterleri temizle, satırlara böl
    const lines = text.split('\n')
      .map(line => line.replace(/^[#*\s-]+/, '').trim())
      .filter(line => line.length > 0);

    return lines;
  };

  const sections = summary ? summary.split(/\d\./).filter(s => s.trim().length > 0) : [];

  const getIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('risk') || lower.includes('kritik')) return <ShieldAlert size={20} />;
    if (lower.includes('stok') || lower.includes('envanter')) return <Package size={20} />;
    if (lower.includes('kargo') || lower.includes('lojistik')) return <TrendingUp size={20} />;
    if (lower.includes('öneri') || lower.includes('strateji')) return <Lightbulb size={20} />;
    return <Target size={20} />;
  };

  const getColor = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('risk') || lower.includes('kritik')) return t.danger;
    if (lower.includes('öneri') || lower.includes('aksiyon')) return t.success;
    return t.accent;
  };

  return (
    <div className="content-animate" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          background: t.accentSoft, color: t.accentSecondary, 
          padding: '8px 16px', borderRadius: '100px', marginBottom: '20px' 
        }}>
          <BookOpen size={16} />
          <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Intelligence Report
          </span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: t.text, letterSpacing: '-2px', marginBottom: '12px' }}>
          Sabah Brifingi
        </h1>
        <p style={{ color: t.textMuted, fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Operasyonel verileriniz AI motoru tarafından analiz edildi ve bugünün yol haritası çıkarıldı.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map((section, idx) => {
          const lines = parseSection(section);
          if (!lines || lines.length === 0) return null;
          
          const title = lines[0];
          const content = lines.slice(1);
          const color = getColor(title);

          return (
            <div key={idx} style={{ 
              background: t.card, 
              border: `1px solid ${t.border}`, 
              borderRadius: '24px', 
              padding: '32px',
              transition: 'all 0.3s ease',
              boxShadow: mode === 'dark' ? '0 10px 30px -15px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${color}15`, color: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(title)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: t.text, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                    {title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {content.map((line, i) => (
                      <div key={i} style={{ 
                        display: 'flex', gap: '10px', fontSize: '15px', 
                        lineHeight: '1.6', color: t.textSecondary 
                      }}>
                        <div style={{ marginTop: '8px', width: '4px', height: '4px', borderRadius: '50%', background: t.border, flexShrink: 0 }} />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{ marginTop: '64px', padding: '32px', textAlign: 'center', borderTop: `1px solid ${t.border}`, background: `linear-gradient(to bottom, transparent, ${t.surface}40)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: t.textMuted, fontSize: '13px', fontWeight: 500 }}>
          <Zap size={16} color={t.accentSecondary} fill={t.accentSecondary} /> 
          Veriler gerçek zamanlı olarak işlenmiştir.
        </div>
      </footer>
    </div>
  );
}