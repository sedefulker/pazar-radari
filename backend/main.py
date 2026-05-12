import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import save_decision, get_past_decisions, get_orders, get_stock, get_critical_stock, get_delayed_cargo
from agent import (
    ask_agent,
    get_market_insight,
    get_market_campaign_suggestion,
    generate_daily_summary,
    get_proactive_status
)
from tools import draft_supplier_email
from scheduler import start_scheduler
from bot_service import start_bot_thread, check_stock_and_notify

# ── UYGULAMA ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Pazar Radarı API",
    description="Hatay Kadın Kooperatifi için yapay zeka destekli proaktif karar destek sistemi.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MODELLER ──────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str

class MarketQuery(BaseModel):
    product: str

class DecisionUpdate(BaseModel):
    description: str
    action: str
    approved: bool
    product_id: str = None 

# ── BAŞLANGIÇ ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    start_scheduler()
    start_bot_thread()
    print("🚀 Pazar Radarı API (Supabase Cloud) başlatıldı.")

# ── SİSTEM & VERİ ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Sistem"])
def root():
    return {"status": "aktif", "mesaj": "Pazar Radarı Supabase üzerinde çalışıyor."}

@app.get("/orders", tags=["Siparişler"])
def orders():
    return get_orders()

@app.get("/stock", tags=["Stok"])
def stock():
    return get_stock()

@app.get("/stock/critical", tags=["Stok"])
def critical_stock():
    return get_critical_stock()

@app.get("/cargo/delayed", tags=["Kargo"])
def delayed_cargo():
    return get_delayed_cargo()

# ── AI KATMANI ────────────────────────────────────────────────────────────────

@app.get("/summary", tags=["AI"])
def daily_summary():
    # Gemini analizi
    summary = generate_daily_summary()
    return {"summary": summary}

@app.get("/proactive", tags=["AI"])
def proactive_status():
    """Anomali kontrolü yapar ve proaktif durum raporu döner."""
    try:
        check_stock_and_notify() # Telegram botu için
    except Exception as e:
        print(f"Telegram bildirimi hatası: {e}")
    return get_proactive_status()

@app.post("/chat", tags=["AI"])
def chat(msg: ChatMessage):
    response = ask_agent(msg.message)
    return {"response": response}

# ── PAZAR RADARI ──────────────────────────────────────────────────────────────

@app.post("/market", tags=["Pazar Radarı"])
def market_insight_endpoint(query: MarketQuery):
    insight = get_market_insight(query.product)
    return {"insight": insight}

@app.post("/market/campaign", tags=["Pazar Radarı"])
def campaign_suggestion(query: MarketQuery):
    """Stok ve Pazar verisini birleştirip kampanya önerisi sunar."""
    stock_data = get_stock()
    product_stock = next(
        (s["stock_quantity"] for s in stock_data 
         if s["name"].lower() == query.product.lower()), 0
    )
    return get_market_campaign_suggestion(query.product, product_stock)

# ── KARARLAR & ARAÇLAR ────────────────────────────────────────────────────────

@app.post("/decisions", tags=["Kararlar"])
def save_decision_endpoint(dec: DecisionUpdate):
    # Supabase'e kaydet
    save_decision(dec.description, dec.action, dec.approved, dec.product_id)
    return {"status": "kaydedildi"}

@app.get("/decisions", tags=["Kararlar"])
def get_decisions():
    return get_past_decisions()

@app.post("/supplier-email", tags=["Araçlar"])
def supplier_email_endpoint(product: str, quantity: int, email: str):
    return draft_supplier_email(product, quantity, email)

# ── ÇALIŞTIR ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)