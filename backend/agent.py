import os
import requests
from dotenv import load_dotenv

from tools import (
    get_orders,
    get_stock,
    get_critical_stock,
    get_delayed_cargo,
    get_order_by_id,
    get_cargo_status,
    draft_supplier_email
)

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"gemini-2.5-flash-lite:generateContent?key={API_KEY}"
)


# TOOL DEFINITIONS

TOOLS = {
    "get_orders": {
        "description": "Tüm siparişleri getirir",
        "function": get_orders
    },
    "get_stock": {
        "description": "Tüm stok bilgisini getirir",
        "function": get_stock
    },
    "get_critical_stock": {
        "description": "Kritik seviyedeki stokları getirir",
        "function": get_critical_stock
    },
    "get_delayed_cargo": {
        "description": "Geciken kargoları getirir",
        "function": get_delayed_cargo
    },
    "get_order_by_id": {
        "description": "Belirli bir siparişi ID ile getirir",
        "function": get_order_by_id
    },
    "get_cargo_status": {
        "description": "Belirli bir kargonun durumunu getirir",
        "function": get_cargo_status
    },
    "draft_supplier_email": {
        "description": "Tedarikçiye sipariş mail taslağı oluşturur",
        "function": draft_supplier_email
    }
}

# GEMINI API CALL

def call_gemini(prompt: str, use_search: bool = False) -> str:

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    
    # Search Grounding
    if use_search:
        payload["tools"] = [
            {
                "google_search": {} 
            }
        ]

    try:
        response = requests.post(
            URL,
            headers=headers,
            json=payload
        )

        data = response.json()

        if response.status_code == 200:
            return data["candidates"][0]["content"]["parts"][0]["text"]

        return f"API Hatası: {data.get('error', {}).get('message', 'Bilinmeyen hata')}"

    except Exception as e:
        return f"Bağlantı hatası: {str(e)}"


# CONTEXT BUILDER

def run_tools_and_build_context() -> dict:

    return {
        "orders": get_orders(),
        "stock": get_stock(),
        "critical_stock": get_critical_stock(),
        "delayed_cargo": get_delayed_cargo()
    }

# ANOMALY DETECTION

def detect_anomalies(context: dict) -> list:

    anomalies = []

    # Kritik stok
    for item in context["critical_stock"]:

        anomalies.append({
            "type": "critical_stock",
            "product": item["product"],
            "quantity": item["quantity"],
            "threshold": item["threshold"],
            "supplier_email": item["supplier_email"],
            "message": (
                f"{item['product']} stoğu kritik: "
                f"{item['quantity']} {item['unit']} kaldı "
                f"(eşik: {item['threshold']})"
            )
        })

    # Geciken kargo
    for cargo in context["delayed_cargo"]:

        anomalies.append({
            "type": "delayed_cargo",
            "cargo_code": cargo["code"],
            "order_id": cargo["order_id"],
            "last_location": cargo["last_location"],
            "message": (
                f"Kargo {cargo['code']} gecikiyor — "
                f"son konum: {cargo['last_location']}"
            )
        })

    # Fazla bekleyen sipariş
    pending_orders = [
        order for order in context["orders"]
        if order["status"] == "beklemede"
    ]

    if len(pending_orders) > 3:

        anomalies.append({
            "type": "high_pending_orders",
            "count": len(pending_orders),
            "message": (
                f"{len(pending_orders)} sipariş hâlâ beklemede, "
                f"işlem hızlandırılmalı"
            )
        })

    return anomalies

# ACTION CHAIN

def generate_action_chain(anomalies: list) -> list:

    actions = []

    for anomaly in anomalies:

        # Kritik stok aksiyonu
        if anomaly["type"] == "critical_stock":

            email = draft_supplier_email(
                anomaly["product"],
                anomaly["threshold"] * 2,
                anomaly["supplier_email"]
            )

            actions.append({
                "anomaly": anomaly["message"],
                "action": "Tedarikçiye sipariş taslağı hazırlandı",
                "detail": email
            })

        # Geciken kargo aksiyonu
        elif anomaly["type"] == "delayed_cargo":

            actions.append({
                "anomaly": anomaly["message"],
                "action": "Müşteri bilgilendirme mesajı hazırlandı",
                "detail": (
                    f"Sayın müşterimiz, "
                    f"{anomaly['cargo_code']} numaralı "
                    f"kargonuz gecikme yaşamaktadır."
                )
            })

        # Bekleyen sipariş aksiyonu
        elif anomaly["type"] == "high_pending_orders":

            actions.append({
                "anomaly": anomaly["message"],
                "action": "Yöneticiye öncelik raporu gönderildi",
                "detail": (
                    f"{anomaly['count']} bekleyen sipariş "
                    f"tespit edildi."
                )
            })

    return actions


# AI CHAT AGENT

def ask_agent(user_message: str) -> str:

    context = run_tools_and_build_context()

    prompt = f"""
Sen bir KOBİ işletme asistanısın.

Güncel işletme verileri:

Siparişler:
{context['orders']}

Stok Durumu:
{context['stock']}

Kritik Stoklar:
{context['critical_stock']}

Geciken Kargolar:
{context['delayed_cargo']}

Kullanıcı Sorusu:
{user_message}

Kurallar:
- Türkçe cevap ver
- Kısa ve net yaz
- Kritik durumları özellikle belirt
- Gereksiz açıklama yapma
"""

    # Burada search kullanılmıyor
    return call_gemini(prompt)


# MARKET ANALYSIS (SEARCH GROUNDING)

def get_market_insight(product: str) -> str:

    prompt = f"""
Sen bir KOBİ pazar analiz uzmanısın.

Ürün:
{product}

Görevlerin:
- Güncel talep durumunu analiz et
- Fiyat trendlerini incele
- E-ticaret eğilimlerini değerlendir
- KOBİ için fırsat ve riskleri belirt
- Türkiye pazarına göre yorum yap

Kurallar:
- İnternetten güncel verileri kullan
- Türkçe yaz
- Maddeler halinde yaz
- Kısa ve profesyonel ol
"""

    # Search Grounding burada aktif
    return call_gemini(prompt, use_search=True)


# MARKET CAMPAIGN SUGGESTION 

def get_market_campaign_suggestion(product: str, stock_quantity: int) -> str:
    prompt = f"""
Sen bir KOBİ pazarlama uzmanısın. 
Ürün: {product}
Mevcut Stok: {stock_quantity}

Görev:
Bu ürün için internet trendlerine ve stok durumuna göre kısa bir kampanya stratejisi öner.

Kurallar:
- İnternet verilerini kullan (Search Grounding aktif olacak)
- Türkçe yaz
- Kısa ve net maddeler kullan
"""
    # Mevcut call_gemini fonksiyonunu search özelliği ile çağırıyoruz
    return call_gemini(prompt, use_search=True)

# DAILY SUMMARY

def generate_daily_summary() -> str:

    context = run_tools_and_build_context()

    anomalies = detect_anomalies(context)

    actions = generate_action_chain(anomalies)

    pending_orders = [
        order for order in context["orders"]
        if order["status"] == "beklemede"
    ]

    prompt = f"""
Sen bir KOBİ yapay zeka operasyon asistanısın.

Aşağıdaki verilere göre günlük özet raporu hazırla.

Bekleyen Sipariş Sayısı:
{len(pending_orders)}

Kritik Stoklar:
{context['critical_stock']}

Geciken Kargolar:
{context['delayed_cargo']}

Tespit Edilen Anomaliler:
{anomalies}

Oluşturulan Aksiyonlar:
{actions}

Kurallar:
- Türkçe yaz
- Madde madde yaz
- Acil durumları başa al
- Kısa ve net yaz
- Profesyonel görün
"""

    return call_gemini(prompt)


# PROACTIVE STATUS

def get_proactive_status() -> dict:

    context = run_tools_and_build_context()

    anomalies = detect_anomalies(context)

    actions = generate_action_chain(anomalies)

    return {
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
        "actions": actions
    }