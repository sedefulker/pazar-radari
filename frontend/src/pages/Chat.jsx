import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../App';
import { api } from '../api';

export default function Chat() {
  const { t } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chat(userText);
      setMessages(prev => [...prev, { role: 'ai', text: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sistem şu an yanıt veremiyor. Lütfen bağlantınızı kontrol edin.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: t.text }}>AI Danışman</h1>
        <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Gerçek zamanlı envanter ve pazar analizi sorgula</p>
      </div>

      <div style={{ 
        flex: 1, background: t.card, border: `1px solid ${t.border}`, 
        borderRadius: '12px', display: 'flex', flexDirection: 'column', 
        overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
              <div style={{ 
                width: '48px', height: '48px', background: t.navActive, 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 16px' 
              }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '6px' }}>
                Pazar Radarı Akıllı Asistan
              </div>
              <div style={{ fontSize: '12px', color: t.textMuted, maxWidth: '280px', margin: '0 auto' }}>
                "Kritik stokta hangi ürünler var?" veya "Zeytinyağı piyasa durumu nedir?" gibi sorular sorabilirsiniz.
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', 
              marginBottom: '16px' 
            }}>
              <div style={{ 
                background: m.role === 'user' ? t.accent : t.navActive, 
                color: m.role === 'user' ? 'white' : t.text, 
                padding: '12px 16px', 
                borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', 
                maxWidth: '75%', fontSize: '13.5px', lineHeight: '1.6',
                boxShadow: m.role === 'user' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
              }}>
                {m.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ 
                background: t.navActive, padding: '12px 16px', 
                borderRadius: '14px 14px 14px 2px', fontSize: '13px', color: t.textMuted 
              }}>
                Düşünüyor...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ 
          padding: '16px 20px', background: t.card, 
          borderTop: `1px solid ${t.borderLight}`, display: 'flex', gap: '10px' 
        }}>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && send()} 
            placeholder="Verileriniz hakkında bir şey sorun..." 
            style={{ 
              flex: 1, padding: '10px 14px', border: `1px solid ${t.border}`, 
              borderRadius: '8px', fontSize: '13px', outline: 'none', 
              color: t.text, background: t.navActive 
            }} 
          />
          <button 
            onClick={send} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', background: t.accent, color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '13px', 
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}