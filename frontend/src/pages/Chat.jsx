import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../App';
import { api } from '../api';
import { Send, Bot, User, Loader2, Command, Zap, Cpu } from 'lucide-react';

export default function Chat() {
  const { t, mode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI yanıtındaki Markdown listelerini ve yıldızları profesyonel bir görünüme kavuşturur
  const formatAIResponse = (text) => {
    if (!text) return null;
    
    // Metni yıldız işaretlerine göre bölüp temizliyoruz
    const parts = text.split('*').map(p => p.trim()).filter(p => p.length > 0);
    
    if (parts.length <= 1) return <span>{text}</span>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {parts.map((part, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: '10px', 
            lineHeight: '1.5',
            fontSize: '14.5px' 
          }}>
            <span style={{ color: t.accentSecondary, fontWeight: 900 }}>•</span>
            <span>{part}</span>
          </div>
        ))}
      </div>
    );
  };

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
      setMessages(prev => [...prev, { role: 'ai', text: 'Nexus protokolü şu an yanıt veremiyor. Veri hatlarını kontrol edin.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-animate { animation: messageSlide 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 10px; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.accentSecondary, marginBottom: '4px' }}>
            <Cpu size={14} />
            <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>Neural Interface</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: t.accent, letterSpacing: '-1.5px' }}>Nexus AI</h1>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
          background: t.card, borderRadius: '12px', border: `1px solid ${t.border}`
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.success, boxShadow: `0 0 10px ${t.success}` }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: t.text }}>LLM v4.2 Online</span>
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div style={{ 
        flex: 1, background: t.card, border: `1px solid ${t.border}`, 
        borderRadius: '28px', display: 'flex', flexDirection: 'column', 
        overflow: 'hidden', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.1)'
      }}>
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', margin: 'auto', maxWidth: '450px' }}>
              <div style={{ 
                width: '80px', height: '80px', background: t.surface, 
                borderRadius: '24px', border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <Bot size={40} color={t.accentSecondary} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: t.text, marginBottom: '12px' }}>Operasyonel Zeka Merkezi</h3>
              <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.6', marginBottom: '32px' }}>
                Envanter analizi, pazar tahminleri ve stratejik planlama için Nexus AI ile konuşmaya başlayın.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {['Stok durumu özeti ver', 'Pazar trendleri neler?', 'Lojistik riskleri analiz et'].map(tag => (
                  <button key={tag} onClick={() => setInput(tag)} style={{
                    padding: '10px 16px', background: t.surface, border: `1px solid ${t.border}`,
                    borderRadius: '12px', color: t.textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="message-animate" style={{ 
              display: 'flex', gap: '16px', 
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '12px', 
                background: m.role === 'user' ? t.accentSecondary : t.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: `1px solid ${t.border}`
              }}>
                {m.role === 'user' ? <User size={18} color="#FFF" /> : <Bot size={18} color={t.accentSecondary} />}
              </div>
              <div style={{ 
                background: m.role === 'user' ? t.accent : t.surface, 
                color: m.role === 'user' ? (mode === 'dark' ? '#000' : '#FFF') : t.text, 
                padding: '16px 24px', borderRadius: '20px',
                maxWidth: '75%', fontSize: '15px', lineHeight: '1.6',
                border: `1px solid ${t.border}`,
                boxShadow: m.role === 'user' ? `0 10px 20px -10px ${t.accentSoft}` : 'none'
              }}>
                {m.role === 'ai' ? formatAIResponse(m.text) : m.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '52px' }}>
              <Loader2 size={16} color={t.accentSecondary} className="animate-spin" />
              <span style={{ fontSize: '13px', color: t.textMuted, fontWeight: 600 }}>Nexus analiz motoru çalışıyor...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* INPUT AREA */}
        <div style={{ padding: '24px 32px', background: t.sidebar, borderTop: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Zap size={16} color={t.accentSecondary} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && send()} 
                placeholder="Nexus'a bir görev verin..." 
                style={{ 
                  width: '100%', padding: '14px 16px 14px 48px', border: `1px solid ${t.border}`, 
                  borderRadius: '16px', fontSize: '15px', outline: 'none', 
                  color: t.text, background: t.bg, transition: 'all 0.2s ease'
                }} 
              />
            </div>
            <button 
              onClick={send} 
              disabled={loading || !input.trim()}
              style={{ 
                width: '52px', height: '52px', background: t.accent, color: mode === 'dark' ? '#000' : '#FFF', 
                border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease',
                opacity: (loading || !input.trim()) ? 0.5 : 1
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}