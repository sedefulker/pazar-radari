import asyncio
import os
import sqlite3
from dotenv import load_dotenv
from telegram import Bot

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# --- YENİ EKLENEN ASENKRON GÖNDERİCİ ---
async def send_telegram_alert(message):
    """Genel mesaj gönderme aracı"""
    bot = Bot(token=TOKEN)
    await bot.send_message(chat_id=CHAT_ID, text=message, parse_mode='Markdown')

# --- MAIN.PY'NİN ARADIĞI KRİTİK FONKSİYON ---
def check_stock_and_notify():
    """Kritik stokları kontrol eder ve bildirim atar"""
    try:
        # Veritabanına bağlanıyoruz
        conn = sqlite3.connect("pazar_radari.db") 
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Eşik değerinin altındaki ürünleri çekiyoruz
        cursor.execute("SELECT product, quantity, threshold FROM stock WHERE quantity <= threshold")
        critical_items = cursor.fetchall()
        
        if critical_items:
            alert_text = "🚨 *PAZAR RADARI KRİTİK STOK UYARISI*\n\n"
            for item in critical_items:
                alert_text += f"• *{item['product']}*: {item['quantity']} adet kaldı!\n"
            
            # Asenkron işlemi senkron dünyada çalıştırıyoruz
            asyncio.run(send_telegram_alert(alert_text))
        
        conn.close()
    except Exception as e:
        print(f"Bot servis hatası: {e}")

# --- SENİN TEST FONKSİYONUN ---
async def send_test_message():
    bot = Bot(token=TOKEN)
    await bot.send_message(
        chat_id=CHAT_ID,
        text="🚀 *Pazar Radarı Sistemi Bağlandı!*\n\nAI destekli proaktif sistem aktif.",
        parse_mode="Markdown"
    )

if __name__ == "__main__":
    print("Test mesajı gönderiliyor...")
    asyncio.run(send_test_message())