import React, { useState } from 'react';
import { useTheme } from '../App';
import { api } from '../api';

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
      setResult(data.insight);
    } catch (error) { 
      setResult('Sistem şu an pazar verilerine erişemiyor. Lütfen API anahtarınızı veya bağlantınızı kontrol edin.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>
          Pazar Analiz Radarı
        </h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>
          Google Search destekli gerçek zamanlı piyasa ve rakip trend analizi
        </p>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: '12px', 
        padding: '24px',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          color: t.accent, 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          marginBottom: '16px' 
        }}>
          Ürün ve Rakip Analizi
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: result ? '24px' : 0 }}>
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && runAnalysis()} 
            placeholder="Örn: Zeytinyağı fiyat trendleri veya Rakip analizi..." 
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              border: `1px solid ${t.border}`, 
              borderRadius: '8px', 
              fontSize: '14px', 
              outline: 'none', 
              color: t.text, 
              background: t.navActive,
              transition: 'border-color 0.2s'
            }} 
          />
          <button 
            onClick={runAnalysis} 
            disabled={loading} 
            style={{ 
              padding: '12px 24px', 
              background: t.accent, 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              minWidth: '150px',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
          </button>
        </div>

        {result && (
          <div style={{ 
            borderTop: `1px solid ${t.borderLight}`, 
            paddingTop: '20px', 
            marginTop: '10px'
          }}>
             <div style={{ 
                background: t.navActive, 
                padding: '20px', 
                borderRadius: '8px', 
                fontSize: '13.5px', 
                color: t.text, 
                lineHeight: '1.7', 
                whiteSpace: 'pre-wrap',
                borderLeft: `4px solid ${t.accent}`
              }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}