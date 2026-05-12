import React, { useState, useEffect, createContext, useContext } from 'react';
import { api } from './api';
import { themes } from './theme';

// Bileşenlerin ve Sayfaların Import Edilmesi
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Alerts from './pages/Alerts';
import Market from './pages/Market';
import Chat from './pages/Chat';
import Decisions from './pages/Decisions'; 

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [mode, setMode] = useState('light');
  
  // Veri State'leri
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);
  const [decisions, setDecisions] = useState([]); // YENİ: Karar hafızası için state
  const [proactive, setProactive] = useState(null);
  const [summary, setSummary] = useState('');

  const t = themes[mode];

  // Veri Çekme İşlemi 
  useEffect(() => {
    api.getOrders().then(setOrders).catch(err => console.error("Sipariş hatası:", err));
    api.getStock().then(setStock).catch(err => console.error("Stok hatası:", err));
    api.getProactive().then(setProactive).catch(err => console.error("Proaktif hata:", err));
    api.getSummary().then(r => setSummary(r.summary)).catch(err => console.error("Özet hatası:", err));
    
    api.getDecisions().then(setDecisions).catch(err => console.error("Karar hafızası hatası:", err));
  }, []);

  // Sayfa Yönlendirme Mantığı
  const pages = {
    dashboard: <Dashboard orders={orders} stock={stock} proactive={proactive} />,
    orders: <Orders orders={orders} />,
    stock: <Stock stock={stock} />,
    decisions: <Decisions decisions={decisions} />, // YENİ: Sidebar butonuyla eşleşti
    alerts: <Alerts proactive={proactive} summary={summary} />,
    market: <Market />,
    chat: <Chat />,
  };

  return (
    <ThemeContext.Provider value={{ t, mode, setMode }}>
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: t.bg, 
        fontFamily: '"Inter", sans-serif', 
        transition: 'background 0.2s' 
      }}>
        
        <Sidebar 
          page={page} 
          setPage={setPage} 
          alertCount={proactive?.anomaly_count || 0} 
        />
        
        <main style={{ 
          marginLeft: '220px', 
          flex: 1, 
          padding: '40px', 
          maxWidth: 'calc(100vw - 220px)' 
        }}>
          {pages[page]}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}