import axios from 'axios';

const BASE = 'http://127.0.0.1:8000';

export const api = {
  getOrders: () => axios.get(`${BASE}/orders`).then(r => r.data),
  getStock: () => axios.get(`${BASE}/stock`).then(r => r.data),
  getProactive: () => axios.get(`${BASE}/proactive`).then(r => r.data),
  getSummary: () => axios.get(`${BASE}/summary`).then(r => r.data),
  
  getDecisions: () => axios.get(`${BASE}/decisions`).then(r => r.data),

  chat: (message) => axios.post(`${BASE}/chat`, { message }).then(r => r.data),
  market: (product) => axios.post(`${BASE}/market`, { product }).then(r => r.data),
};