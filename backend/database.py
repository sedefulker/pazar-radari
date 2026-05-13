import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Bulut bağlantı konfigürasyonu
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── SİPARİŞ YÖNETİMİ ──

def get_orders():
    """Siparişleri ilişkili ürün isimleriyle birlikte çeker."""
    try:
        response = supabase.table("orders").select("*, products(name)").execute()
        return response.data
    except Exception as e:
        print(f"Sipariş çekme hatası: {e}")
        return []

# ── STOK VE ENVANTER ──

def get_stock():
    """Tüm ürün envanterini buluttan getirir."""
    try:
        response = supabase.table("products").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Stok çekme hatası: {e}")
        return []

def get_critical_stock():
    """
    Kritik eşik altındaki ürünleri süzerek getirir.
    NOT: Supabase 'lte' filtresinde iki kolonu kıyaslarken hata verebildiği için 
    işlemi Python tarafında güvenli bir şekilde yapıyoruz.
    """
    try:
        response = supabase.table('products').select('*').execute()
        all_products = response.data
        
        # stock_quantity <= critical_threshold olanları süzüyoruz
        critical_products = [
            p for p in all_products 
            if float(p.get('stock_quantity', 0)) <= float(p.get('critical_threshold', 10))
        ]
        return critical_products
    except Exception as e:
        print(f"Kritik stok süzme hatası: {e}")
        return []

# ── LOJİSTİK RADARI ──

def get_delayed_cargo():
    """Anomali tespiti yapılmış (geciken) kargoları filtreler."""
    try:
        response = supabase.table("logistics_radar").select("*")\
            .eq("is_anomaly", True).execute()
        return response.data
    except Exception as e:
        print(f"Lojistik veri hatası: {e}")
        return []

# ── AI KARAR HAFIZASI ──

def save_decision(description, action, approved=False, product_id=None, detail=None):
    """Ajanın aldığı stratejik kararları ve AI tarafından hazırlanan taslağı kaydeder."""
    try:
        data = {
            "incident_type": description,
            "proposed_action": action,
            "is_approved": approved,
            "related_product_id": product_id,
            "ai_description": detail if detail else "" 
        }
        
        return supabase.table("ai_decisions").insert(data).execute()
    except Exception as e:
        print(f"Karar kaydetme hatası: {e}")
        return None

def get_past_decisions():
    """Karar hafızasını kronolojik olarak getirir."""
    try:
        response = supabase.table("ai_decisions")\
            .select("*")\
            .order("created_at", desc=True)\
            .limit(20)\
            .execute()
        return response.data
    except Exception as e:
        print(f"Karar hafızası hatası: {e}")
        return []

def get_past_decisions():
    """Karar hafızasını kronolojik olarak getirir."""
    try:
        response = supabase.table("ai_decisions").select("*")\
            .order("created_at", desc=True).limit(20).execute()
        return response.data
    except Exception as e:
        print(f"Karar hafızası hatası: {e}")
        return []

# --- BİLDİRİM SİSTEMİ ---

def create_notification(title, message, notification_type="warning"):
    """
    Dashboard ve Telegram için proaktif bildirim oluşturur.
    Parametre ismini 'notification_type' yaparak agent.py ile uyumlu hale getirdik.
    """
    try:
        data = {
            "title": title, 
            "message": message, 
            "notification_type": notification_type
        }
        return supabase.table("notifications").insert(data).execute()
    except Exception as e:
        print(f"Bildirim oluşturma hatası: {e}")
        return None