from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import init_db, save_decision, get_past_decisions # save_decision eklendi
from agent import ask_agent, get_market_insight, generate_daily_summary, get_proactive_status, get_market_campaign_suggestion
from tools import get_orders, get_stock, get_critical_stock, get_delayed_cargo, draft_supplier_email
from scheduler import start_scheduler
from bot_service import check_stock_and_notify 
import uvicorn

app = FastAPI(title="Pazar Radarı API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Modelleri
class ChatMessage(BaseModel):
    message: str

class MarketQuery(BaseModel):
    product: str

class DecisionUpdate(BaseModel):
    description: str
    action: str
    approved: bool

# Başlangıç Etkinlikleri
@app.on_event("startup")
def startup():
    init_db()
    start_scheduler()

@app.get("/")
def root():
    return {"message": "Pazar Radarı çalışıyor."}

# --- Veri Endpointleri ---
@app.get("/orders")
def orders():
    return get_orders()

@app.get("/stock")
def stock():
    return get_stock()

@app.get("/stock/critical")
def critical_stock():
    return get_critical_stock()

@app.get("/cargo/delayed")
def delayed_cargo():
    return get_delayed_cargo()

@app.post("/decisions")
def save_decision_endpoint(dec: DecisionUpdate):
    save_decision(dec.description, dec.action, dec.approved)
    return {"status": "kaydedildi"}

@app.get("/decisions")
def get_decisions():
    return get_past_decisions()

# --- AI ve Pazar Analizi ---
@app.get("/summary")
def daily_summary():
    summary = generate_daily_summary()
    return {"summary": summary}

@app.get("/proactive")
def proactive_status():
    try:
        check_stock_and_notify()
    except Exception as e:
        print(f"Telegram bildirimi gönderilemedi: {e}")
        
    return get_proactive_status()

@app.post("/chat")
def chat(msg: ChatMessage):
    response = ask_agent(msg.message)
    return {"response": response}

@app.post("/market")
def market_insight(query: MarketQuery):
    insight = get_market_insight(query.product)
    return {"insight": insight}

@app.post("/market/campaign")
def campaign_suggestion(query: MarketQuery):
    # Stok verisini çekip AI'ya pazar durumuyla birlikte gönderiyoruz
    stock_data = get_stock()
    product_stock = next((s["quantity"] for s in stock_data if s["product"].lower() == query.product.lower()), 0)
    
    suggestion = get_market_campaign_suggestion(query.product, product_stock)
    return {"suggestion": suggestion}

@app.post("/supplier-email")
def supplier_email(product: str, quantity: int, supplier_email: str):
    email = draft_supplier_email(product, quantity, supplier_email)
    return email

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)