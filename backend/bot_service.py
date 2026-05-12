import os
import threading
import requests
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, CommandHandler,
    MessageHandler, filters, ContextTypes, CallbackQueryHandler
)
from dotenv import load_dotenv

# Supabase veri fonksiyonlarını dahil ediyoruz
from database import get_orders, get_stock, get_critical_stock, get_delayed_cargo

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# ── YARDIMCI FONKSİYONLAR ──

def send_telegram_alert(message: str):
    """Sistem genelinden (FastAPI/Scheduler) çağrılan bildirim gönderici."""
    if not TOKEN or not CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": message, "parse_mode": "Markdown"}
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"Telegram bildirim hatası: {e}")

def check_stock_and_notify():
    """Kritik stokları kontrol eder ve bildirim atar."""
    rows = get_critical_stock()
    if rows:
        msg = "🚨 *PAZAR RADARI — KRİTİK STOK UYARISI*\n\n"
        for r in rows:
            msg += f"• *{r['name']}*: {r['stock_quantity']} {r['unit']} kaldı (eşik: {r['critical_threshold']})\n"
        msg += "\n_Sistem tedarikçi sipariş taslağı hazırladı._"
        send_telegram_alert(msg)

# ── KOMUTLAR ──

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📦 Sipariş Sorgula", callback_data="order_query")],
        [InlineKeyboardButton("📊 Stok Durumu", callback_data="stock_status")],
        [InlineKeyboardButton("🚚 Geciken Kargolar", callback_data="delayed_cargo")],
        [InlineKeyboardButton("❓ Yardım", callback_data="help")],
    ]
    await update.message.reply_text(
        f"👋 Merhaba *{update.effective_user.first_name}*!\n\n"
        "🎯 *Pazar Radarı Akıllı Asistanı*'na hoş geldiniz.\n\n"
        "Aşağıdaki işlemleri hızlıca gerçekleştirebilirsiniz:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📖 *Kullanım Kılavuzu*\n\n"
        "• Sipariş sorgulamak için numarasını yazın (Örn: `101`)\n"
        "• /stok → Stok durumu\n"
        "• /gecikmeler → Geciken kargolar\n"
        "• /start → Ana menü\n\n"
        "_Hatay Kadın Kooperatifi veri sistemine bağlıdır._",
        parse_mode="Markdown"
    )

# ── BUTON TIKLAMALARI ──

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "order_query":
        await query.edit_message_text(
            "📦 *Sipariş Sorgulama*\n\nSorgulamak istediğiniz sipariş numarasını gönderin.\nÖrnek: `101`",
            parse_mode="Markdown"
        )

    elif query.data == "stock_status":
        rows = get_stock()
        if rows:
            msg = "📊 *Stok Durumu*\n\n"
            for r in rows:
                icon = "🔴" if float(r["stock_quantity"]) <= float(r["critical_threshold"]) else "🟢"
                msg += f"{icon} *{r['name']}*: {r['stock_quantity']} {r['unit']}\n"
            msg += "\n🔴 Kritik  |  🟢 Normal"
        else:
            msg = "Stok verisi bulunamadı."
        await query.edit_message_text(msg, parse_mode="Markdown")

    elif query.data == "delayed_cargo":
        rows = get_delayed_cargo()
        if rows:
            msg = "🚨 *Geciken Kargolar*\n\n"
            for r in rows:
                msg += (
                    f"📦 Kargo: `{r.get('cargo_company', 'Bilinmiyor')}`\n"
                    f"🔗 Sipariş No: {r.get('order_number', '-')}\n"
                    f"📍 Konum: {r.get('last_location', '-')}\n"
                    f"📅 Tahmini Varış: {r.get('estimated_delivery', '-')}\n"
                    "─────────────────\n"
                )
        else:
            msg = "✅ Geciken kargo bulunmuyor."
        await query.edit_message_text(msg, parse_mode="Markdown")

    elif query.data == "help":
        await help_command(update, context)

# ── DETAYLI SİPARİŞ MESAJI YÖNETİMİ ──

async def handle_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    
    # Tüm siparişleri çekip order_number ile eşleştiriyoruz
    orders_list = get_orders()
    order = next((o for o in orders_list if str(o.get('order_number')) == text), None)

    if order:
        # Gecikme uyarısını koruyoruz
        delayed_warn = ""
        if order.get('is_anomaly') or order.get('delayed'):
            delayed_warn = "\n⚠️ _Kargonuz gecikme yaşıyor, özür dileriz._"
            
        response = (
            f"✅ *Sipariş Bulundu!*\n\n"
            f"🔖 *No:* `#{order.get('order_number')}`\n"
            f"👤 *Müşteri:* {order.get('customer_name', '-')}\n"
            f"🛒 *Ürün:* {order.get('products', {}).get('name') if order.get('products') else 'Belirtilmedi'}\n"
            f"📋 *Sipariş Durumu:* `{order.get('status', '-').upper()}`\n"
            "───────────────────\n"
            "🚚 *Lojistik Bilgisi*\n"
            f"🏢 *Kargo:* {order.get('cargo_company', '-')}\n"
            f"📍 *Son Konum:* {order.get('last_location', '-')}\n"
            f"📅 *Tahmini Varış:* {order.get('estimated_delivery', '-')}"
            f"{delayed_warn}\n\n"
            "📌 _Yeni bir sorgulama için sadece numara yazmanız yeterli._"
        )
    else:
        response = (
            f"❌ *{text}* numaralı sipariş bulunamadı.\n\n"
            "Lütfen sipariş numaranızı kontrol edin.\n"
            "Örnek: `1`, `10`,`102`"
        )

    await update.message.reply_text(response, parse_mode="Markdown")

# ── BOTU ÇALIŞTIRMA ──

def run_bot():
    if not TOKEN:
        print("⚠️ TELEGRAM_BOT_TOKEN bulunamadı!")
        return

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    app = ApplicationBuilder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("stok", lambda u, c: stok_command(u, c)))
    app.add_handler(CallbackQueryHandler(button_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_messages))

    print("🚀 Pazar Radarı Telegram Botu aktif!")
    app.run_polling(drop_pending_updates=True, stop_signals=None)

def start_bot_thread():
    threading.Thread(target=run_bot, daemon=True).start()

if __name__ == "__main__":
    run_bot()