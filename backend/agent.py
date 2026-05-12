import os
import requests
from dotenv import load_dotenv

# Database fonksiyonları
from database import (
    get_orders, 
    get_stock, 
    get_critical_stock, 
    get_delayed_cargo, 
    save_decision, 
    get_past_decisions, 
    create_notification
)

# Araçlar
from tools import draft_supplier_email, get_order_by_id

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={}"

# ── GEMINI ÇAĞIRICI ──────────────────────────────────────────────────────────

def call_gemini(prompt: str, use_search: bool = False) -> str:
    url = URL.format(API_KEY)
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    if use_search:
        payload["tools"] = [{"google_search": {}}]

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        data = response.json()
        if response.status_code == 200:
            parts = data["candidates"][0]["content"]["parts"]
            return "".join(p.get("text", "") for p in parts)
        return f"API Hatası: {data.get('error', {}).get('message', 'Bilinmeyen hata')}"
    except Exception as e:
        return f"Bağlantı hatası: {str(e)}"

# ── ANALİTİK KATMAN ──────────────────────────────────────────────────────────

def predict_stock_depletion() -> str:
    stock = get_stock()
    orders = get_orders()
    prompt = f"""
Sen bir stok analisti olarak çalışıyorsun.
Mevcut Stok: {stock}
Son Siparişler: {orders}

Her ürün için "kaç gün sonra stok biter?" tahminini hesapla.
Yalnızca en kritik 3 ürünü şu formatta listele:
- Ürün Adı: X gün
Türkçe, kısa ve net yaz.
"""
    return call_gemini(prompt)

# ── DIŞ PAZAR RADARI ─────────────────────────────────────────────────────────

def get_market_insight(product: str) -> str:
    prompt = f"""
Türkiye pazarında '{product}' ürünü için GÜNCEL durumu analiz et. Trendyol ve Hepsiburada fiyatlarını, 
tüketici talebini ve rakip kampanyaları araştır. KOBİ sahibi için somut öneri sun.
Türkçe, madde madde, aksiyon odaklı yaz.
"""
    return call_gemini(prompt, use_search=True)

# GÜNCELLEME: main.py'nin beklediği kampanya fonksiyonu (EKLENDİ)
def get_market_campaign_suggestion(product: str, stock_quantity: int) -> str:
    market_signal = call_gemini(f"Türkiye'de {product} pazarındaki güncel fırsatlar neler?", use_search=True)
    prompt = f"""
    Ürün: {product} | Stok: {stock_quantity} | Pazar Durumu: {market_signal}
    KOBİ için bir kampanya kurgusu (indirim oranı ve süresi) öner. Türkçe ve kısa olsun.
    """
    return call_gemini(prompt)

# ── AKSİYON ZİNCİRİ (SUPABASE ENTEGRELİ) ─────────────────────────────────────

def execute_automated_workflow(anomaly_type: str, data: dict) -> dict:
    if anomaly_type == "critical_stock":
        p_name = data.get('name', 'Ürün')
        
        create_notification(
            title="Kritik Stok Uyarısı",
            message=f"{p_name} stoğu kritik seviyeye düştü.",
            notification_type="critical_stock"
        )

        save_decision(
            description=f"{p_name} kritik stok",
            action="Tedarikçiye otomatik sipariş taslağı hazırlandı",
            approved=False,
            product_id=data.get('id')
        )

        return {
            "anomaly": f"{p_name} stoğu kritik!",
            "action": "Tedarikçi taslağı hazırlandı",
            "type": "supplier_email"
        }
        
    elif anomaly_type == "delayed_cargo":
        order_num = data.get('order_number', 'Bilinmeyen') # Kolon adı düzeltildi
        
        create_notification(
            title="Kargo Gecikmesi",
            message=f"{order_num} numaralı siparişte gecikme var.",
            notification_type="cargo_delay"
        )

        save_decision(
            description=f"{order_num} geciken kargo",
            action="Müşteri bilgilendirme mesajı oluşturuldu",
            approved=False
        )

        return {
            "anomaly": f"Kargo {order_num} gecikiyor.",
            "action": "Müşteri mesajı hazır",
            "type": "customer_notification"
        }
    return None

# ── PROAKTİF DURUM ───────────────────────────────────────────────────────────

def get_proactive_status() -> dict:
    critical = get_critical_stock()
    delays = get_delayed_cargo()
    actions = []

    for c in critical:
        result = execute_automated_workflow("critical_stock", c)
        if result: actions.append(result)

    for d in delays:
        result = execute_automated_workflow("delayed_cargo", d)
        if result: actions.append(result)

    return {
        "anomaly_count": len(actions),
        "actions": actions
    }

# ── SABAH BRİFİNGİ VE CHAT ───────────────────────────────────────────────────

def generate_daily_summary() -> str:
    context = {
        "orders": get_orders(),
        "stock": get_stock(),
        "critical": get_critical_stock(),
        "delays": get_delayed_cargo(),
        "past_decisions": get_past_decisions()
    }
    forecast = predict_stock_depletion()
    market_signal = call_gemini("Türkiye e-ticaret trendleri bugün?", use_search=True)

    prompt = f"""
Sen bir KOBİ CEO Asistanısın. Sabah brifingi hazırla.
İç Veri: {context}
Dış Sinyal: {market_signal}
Görev: Acil riskleri ve bugün için stratejik öneriyi madde madde yaz. Profesyonel ol.
"""
    return call_gemini(prompt)

def ask_agent(user_message: str) -> str:
    context = {"stock": get_stock(), "orders": get_orders(), "delays": get_delayed_cargo()}
    prompt = f"Sen Pazar Radarı asistanısın. Veriler: {context}. Kullanıcı: {user_message}. Kısa ve net yanıt ver."
    return call_gemini(prompt)