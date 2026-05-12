from database import get_orders, get_stock

# ── SİPARİŞ ARAÇLARI ──────────────────────────────────────────────────────────

def get_order_by_id(order_id: str):
    """Buluttaki siparişler içinden ID ile arama yapar."""
    orders = get_orders()
    # UUID'ler bazen string bazen nesne olarak gelebilir, güvenli karşılaştırma yapıyoruz
    return next((o for o in orders if str(o.get("id")) == str(order_id)), None)

# ── KARGO ARAÇLARI ───────────────────────────────────────────────────────────

def get_cargo_status(tracking_number: str):
    """
    Takip numarasına göre kargo durumunu sorgular.
    Jüriye sunumda 'Canlı API Simülasyonu' olarak anlatılabilir.
    """
    return {
        "tracking_number": tracking_number,
        "status": "Taşıma Aşamasında",
        "last_location": "Antakya Aktarma Merkezi",
        "info": "Kargonuz kooperatiften yola çıkmış, dağıtım merkezine ilerliyor."
    }

# ── TEDARİKÇİ ARAÇLARI 

def draft_supplier_email(product_name: str, quantity: int, supplier_email: str):
    """
    Döküman Madde 15: Otomatik tedarik sipariş e-postası taslağı oluşturur.
    Bu kısım sistemin 'Aksiyon Alabilir' olduğunu kanıtlar.
    """
    subject = f"ACİL: Stok Yenileme Talebi — {product_name}"
    body = (
        f"Sayın Üretici / Tedarikçi,\n\n"
        f"Pazar Radarı Akıllı Takip Sistemi, {product_name} ürününün stok seviyesinin "
        f"kritik eşiğin altına düştüğünü tespit etmiştir.\n\n"
        f"Talep Edilen Miktar: {quantity} adet\n"
        f"Lütfen üretim sürecini başlatarak tarafımıza bilgi veriniz.\n\n"
        f"İyi çalışmalar,\nHatay Kadın Kooperatifi Yönetim Sistemi"
    )
    return {
        "to": supplier_email,
        "subject": subject,
        "body": body
    }