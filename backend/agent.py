import os
import time
import logging
import requests

from dotenv import load_dotenv


# DATABASE

from database import (
    get_orders,
    get_stock,
    get_critical_stock,
    get_delayed_cargo,
    save_decision,
    get_past_decisions,
    create_notification
)


# TOOLS

from tools import (
    draft_supplier_email,
    get_order_by_id
)


# ENV

load_dotenv()


# LOGGING

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)


# GEMINI CONFIG

API_KEY = os.getenv("GEMINI_API_KEY")

BASE_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-2.5-flash-lite:generateContent?key={}"
)


# PROMPT REGISTRY

PROMPTS = {

    "stock_forecast": """
Görev:
Stok ve sipariş verilerini analiz ederek
kritik stok risklerini belirle.

Kurallar:
- Sadece en kritik 3 ürünü yaz
- Gün bazlı tahmin ver
- Kısa ve operasyon odaklı ol

Stok Verileri:
{stock}

Sipariş Verileri:
{orders}

Çıktı Formatı:

- Ürün Adı → X gün içinde kritik seviyeye düşebilir
""",

    "market_insight": """
Görev:
'{product}' ürünü için Türkiye e-ticaret
pazarını analiz et.

Analiz Başlıkları:

1. Ortalama fiyat aralığı
2. Talep eğilimi
3. Rekabet yoğunluğu
4. Fiyat pozisyon önerisi
5. Operasyonel fırsat

Kurallar:
- Kısa yaz
- Veri odaklı ol
- Genel tavsiye verme
- Profesyonel dil kullan

Türkçe yanıt ver.
""",

    "campaign_strategy": """
Görev:
Aşağıdaki ürün stoğunu en verimli şekilde eritmek için
kampanya stratejisi oluştur.

Ürün:
{product}

Stok:
{stock_quantity}

Analiz Et:

1. İdeal kampanya modeli
2. Fiyat önerisi
3. Beklenen stok erime hızı
4. Tahmini ticari etki

Kurallar:
- Kısa yaz
- CEO seviyesinde net öneri sun
- Operasyon odaklı ol
""",

    "supplier_email": """
Görev:
Kritik stok seviyesine düşen ürün için
kısa bir tedarikçi mesajı oluştur.

Ürün:
{product_name}

Kurallar:
- Profesyonel ol
- Kısa yaz
- Fiyat ve termin süresi sor
- Resmi dil kullan
""",

    "cargo_message": """
Görev:
Geciken sipariş için müşteriye
kısa bir bilgilendirme mesajı oluştur.

Sipariş:
{order_number}

Kurallar:
- Nazik ol
- Güven ver
- Kısa yaz
- Çözüm odaklı ol
""",

    "market_signal": """
Türkiye e-ticaret pazarında bugün öne çıkan
ticari gelişmeleri kısa şekilde özetle.

Odak:
- Talep değişimleri
- Fiyat hareketleri
- Kampanya yoğunluğu
- Operasyonel riskler
""",
}


# RESPONSE FORMATTER

def success_response(data, source="system"):
    return {
        "success": True,
        "source": source,
        "data": data
    }


def error_response(message, error_type="unknown"):
    return {
        "success": False,
        "error_type": error_type,
        "message": message
    }


# AI RESPONSE SANITIZER

def sanitize_ai_response(text: str) -> str:

    if not text:
        return "AI yanıt üretemedi."

    cleaned = text.strip()

    # markdown temizliği
    cleaned = cleaned.replace("```", "")
    cleaned = cleaned.replace("###", "")
    cleaned = cleaned.replace("**", "")

    # max karakter limiti
    return cleaned[:3500]


# GEMINI CLIENT

def call_gemini(prompt: str, use_search: bool = False) -> dict:

    url = BASE_URL.format(API_KEY)

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

    if use_search:
        payload["tools"] = [
            {
                "google_search": {}
            }
        ]

    start_time = time.time()

    try:

        logging.info("Gemini isteği gönderiliyor")

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )

        elapsed = round(time.time() - start_time, 2)

        logging.info(f"Gemini response süresi: {elapsed}s")

        data = response.json()

        if (
            response.status_code == 200 and
            "candidates" in data and
            len(data["candidates"]) > 0
        ):

            parts = data["candidates"][0]["content"]["parts"]

            text = "".join(
                part.get("text", "")
                for part in parts
            )

            cleaned = sanitize_ai_response(text)

            return success_response(
                cleaned,
                source="gemini"
            )

        logging.error(f"Gemini API Hatası: {data}")

        return error_response(
            "AI yanıt üretemedi.",
            "api_error"
        )

    except requests.exceptions.Timeout:

        logging.error("Gemini timeout")

        return error_response(
            "AI isteği zaman aşımına uğradı.",
            "timeout"
        )

    except Exception as e:

        logging.error(f"Gemini bağlantı hatası: {str(e)}")

        return error_response(
            f"Bağlantı hatası: {str(e)}",
            "connection_error"
        )


# AI HELPER

def get_ai_text(result: dict) -> str:

    if result.get("success"):
        return result.get("data", "")

    return f"AI Error: {result.get('message')}"


# STOCK FORECAST ENGINE

def predict_stock_depletion() -> str:

    stock = get_stock()
    orders = get_orders()

    prompt = PROMPTS["stock_forecast"].format(
        stock=stock,
        orders=orders
    )

    result = call_gemini(prompt)

    return get_ai_text(result)


# MARKET INTELLIGENCE

def get_market_insight(product: str) -> str:

    prompt = PROMPTS["market_insight"].format(
        product=product
    )

    result = call_gemini(
        prompt,
        use_search=True
    )

    return get_ai_text(result)


# CAMPAIGN ENGINE

def get_market_campaign_suggestion(
    product: str,
    stock_quantity: int
) -> str:

    prompt = PROMPTS["campaign_strategy"].format(
        product=product,
        stock_quantity=stock_quantity
    )

    result = call_gemini(
        prompt,
        use_search=True
    )

    return get_ai_text(result)


# MEMORY CHECK

def find_existing_workflow(
    anomaly_type: str,
    identifier: str
):

    past_decisions = get_past_decisions()

    for decision in past_decisions:

        desc = str(
            decision.get("incident_type", "")
        ).lower()

        if (
            anomaly_type.lower() in desc and
            identifier.lower() in desc
        ):
            return {
                "action": decision.get(
                    "proposed_action"
                ),
                "detail": decision.get(
                    "ai_description"
                )
            }

    return None


# WORKFLOW ENGINE

def execute_automated_workflow(
    anomaly_type: str,
    data: dict
) -> dict:

    
    # CRITICAL STOCK
    
    if anomaly_type == "critical_stock":

        product_name = data.get(
            "name",
            "Ürün"
        )

        existing = find_existing_workflow(
            anomaly_type,
            product_name
        )

        if existing and existing["detail"]:

            logging.info(
                f"Cached workflow kullanıldı: {product_name}"
            )

            return {
                "anomaly": f"{product_name} için mevcut aksiyon kullanıldı.",
                "action": existing["action"],
                "detail": existing["detail"],
                "type": "cached_workflow"
            }

        prompt = PROMPTS["supplier_email"].format(
            product_name=product_name
        )

        ai_message = get_ai_text(
            call_gemini(prompt)
        )

        create_notification(
            title="Kritik Stok",
            message=f"{product_name} kritik seviyeye düştü.",
            notification_type="critical_stock"
        )

        save_decision(
            description=f"critical_stock_{product_name}",
            action="Tedarikçi iletişim taslağı oluşturuldu",
            detail=ai_message,
            approved=False,
            product_id=data.get("id")
        )

        logging.info(
            f"Kritik stok workflow işlendi: {product_name}"
        )

        return {
            "anomaly": f"{product_name} stoğu kritik seviyede.",
            "action": "Tedarikçi mesajı oluşturuldu",
            "detail": ai_message,
            "type": "supplier_email"
        }

    
    # DELAYED CARGO
    
    elif anomaly_type == "delayed_cargo":

        order_number = data.get(
            "order_number",
            "Bilinmeyen Sipariş"
        )

        existing = find_existing_workflow(
            anomaly_type,
            order_number
        )

        if existing and existing["detail"]:

            logging.info(
                f"Cached workflow kullanıldı: {order_number}"
            )

            return {
                "anomaly": f"{order_number} için mevcut aksiyon kullanıldı.",
                "action": existing["action"],
                "detail": existing["detail"],
                "type": "cached_workflow"
            }

        prompt = PROMPTS["cargo_message"].format(
            order_number=order_number
        )

        ai_message = get_ai_text(
            call_gemini(prompt)
        )

        create_notification(
            title="Kargo Gecikmesi",
            message=f"{order_number} siparişinde gecikme var.",
            notification_type="cargo_delay"
        )

        save_decision(
            description=f"delayed_cargo_{order_number}",
            action="Müşteri bilgilendirme mesajı oluşturuldu",
            detail=ai_message,
            approved=False
        )

        logging.info(
            f"Kargo workflow işlendi: {order_number}"
        )

        return {
            "anomaly": f"{order_number} siparişinde gecikme tespit edildi.",
            "action": "Müşteri mesajı oluşturuldu",
            "detail": ai_message,
            "type": "customer_notification"
        }

    return None


# PROACTIVE ENGINE

def get_proactive_status() -> dict:

    critical_stock = get_critical_stock()
    delayed_cargo = get_delayed_cargo()

    actions = []

    for item in critical_stock:

        result = execute_automated_workflow(
            "critical_stock",
            item
        )

        if result:
            actions.append(result)

    for cargo in delayed_cargo:

        result = execute_automated_workflow(
            "delayed_cargo",
            cargo
        )

        if result:
            actions.append(result)

    return {
        "anomaly_count": len(actions),
        "actions": actions
    }


# EXECUTIVE SUMMARY

def generate_daily_summary() -> str:

    orders = get_orders()
    stock = get_stock()

    critical_stock = get_critical_stock()
    delayed_cargo = get_delayed_cargo()

    past_decisions = get_past_decisions()

    forecast = predict_stock_depletion()

    market_signal = get_ai_text(
        call_gemini(
            PROMPTS["market_signal"],
            use_search=True
        )
    )

    prompt = f"""
Görev:
KOBİ yöneticisi için günlük operasyon brifingi hazırla.

────────────────────────
OPERASYON VERİLERİ
────────────────────────

Toplam Sipariş:
{len(orders)}

Kritik Stok:
{critical_stock}

Geciken Kargolar:
{delayed_cargo}

Stok Tahmini:
{forecast}

────────────────────────
GEÇMİŞ KARARLAR
────────────────────────

{past_decisions}

────────────────────────
DIŞ PAZAR SİNYALİ
────────────────────────

{market_signal}

────────────────────────
ÇIKTI FORMATI
────────────────────────

1. Kritik Riskler
2. Operasyonel Durum
3. Ticari Fırsatlar
4. Bugün İçin Önerilen Aksiyonlar

Kurallar:
- Yönetici dili kullan
- Maddeler kısa olsun
- Operasyon odaklı yaz
"""

    result = call_gemini(prompt)

    logging.info("Daily executive summary üretildi")

    return get_ai_text(result)

# =========================================================
# AI ASSISTANT
# =========================================================
def ask_agent(user_message: str) -> str:

    context = {
        "stock": get_stock(),
        "orders": get_orders(),
        "delayed_cargo": get_delayed_cargo()
    }

    prompt = f"""
Rol:
Sen bir operasyon ve lojistik danışmanısın.

Görevlerin:
- Sipariş yönetimi
- Stok analizi
- Operasyon desteği
- Risk analizi
- Süreç optimizasyonu

İşletme Verileri:
{context}

Kullanıcı Sorusu:
{user_message}

Kurallar:
- Kısa yanıt ver
- Gerçek verilere göre konuş
- Gereksiz açıklama yapma
- Kritik riskleri belirt
- Türkçe yanıt ver
"""

    result = call_gemini(prompt)

    logging.info("AI Assistant yanıt üretti")

    return get_ai_text(result)