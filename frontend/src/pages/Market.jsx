import React, { useState } from 'react';
import { useTheme } from '../App';
import { api } from '../api';
import { Search, Sparkles, Globe, BarChart3, ArrowRight, Loader2, Lightbulb } from 'lucide-react';

export default function Market() {
  const { t, mode } = useTheme(); 
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult('');
    
    try {
      const data = await api.market(query);
      const cleanResult = data.insight.replace(/[#*]/g, '').trim();
      setResult(cleanResult);
    } catch (error) { 
      setResult('Sistem şu an pazar verilerine erişemiyor. Bağlantı protokollerini kontrol edin.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.accentSecondary, marginBottom: '8px' }}>
            <Globe size={14} />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Global Market Intelligence</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: t.accent, letterSpacing: '-1.5px' }}>Pazar Analiz Radarı</h1>
        </div>
        <div style={{ textAlign: 'right', color: t.textMuted, fontSize: '12px', fontWeight: 500 }}>
          POWERED BY GEMINI 1.5 PRO & GOOGLE SEARCH
        </div>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '24px', 
        padding: '40px',
        boxShadow: mode === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={20} 
              color={t.textMuted} 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && runAnalysis()} 
              placeholder="Ürün adı, pazar trendi veya rakip analizi sorgulayın..." 
              style={{ 
                width: '100%',
                padding: '18px 20px 18px 48px', 
                border: `1px solid ${t.border}`, 
                borderRadius: '14px', 
                fontSize: '15px', 
                outline: 'none', 
                color: t.text, 
                background: t.surface,
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }} 
            />
          </div>
          <button 
            onClick={runAnalysis} 
            disabled={loading} 
            style={{ 
              padding: '0 32px', 
              background: loading ? t.surface : t.accent, 
              color: mode === 'dark' ? '#000' : '#FFF', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '15px', 
              fontWeight: 700, 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Analiz Ediliyor' : 'İstihbarat Topla'}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '40px', animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${t.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={18} color={t.accentSecondary} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: t.text, letterSpacing: '0.5px' }}>STRATEJİK PAZAR İÇGÖRÜSÜ</span>
              </div>
              <div style={{ fontSize: '11px', color: t.textMuted, background: t.surface, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${t.border}` }}>
                CONFIDENCE: HIGH
              </div>
            </div>

            <div style={{ 
              background: t.surface, 
              padding: '32px', 
              borderRadius: '16px', 
              color: t.textSecondary, 
              lineHeight: '1.8', 
              fontSize: '15px',
              borderLeft: `4px solid ${t.accentSecondary}`,
              whiteSpace: 'pre-wrap'
            }}>
              {result.split('\n').map((para, idx) => (
                para.trim() && <p key={idx} style={{ marginBottom: '16px' }}>{para}</p>
              ))}
            </div>

            <div style={{ 
              marginTop: '32px', 
              padding: '24px', 
              borderRadius: '16px', 
              background: `linear-gradient(135deg, ${t.accentSoft}, transparent)`,
              border: `1px solid ${t.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', background: t.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${t.border}`
                }}>
                  <Lightbulb size={24} color={t.accentSecondary} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>AI Proaktif Aksiyon Önerisi</div>
                  <div style={{ fontSize: '12px', color: t.textMuted }}>Mevcut verilerle optimize edilmiş strateji hazır.</div>
                </div>
              </div>
              <button style={{ 
                padding: '10px 20px', 
                background: t.accent, 
                color: mode === 'dark' ? '#000' : '#FFF', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Kampanyaya Dönüştür <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}