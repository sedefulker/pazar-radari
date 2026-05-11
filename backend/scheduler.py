from apscheduler.schedulers.background import BackgroundScheduler
from agent import generate_daily_summary
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def morning_summary():
    logger.info("Günlük özet hazırlanıyor...")
    summary = generate_daily_summary()
    logger.info(f"GÜNLÜK ÖZET:\n{summary}")

def start_scheduler():
    scheduler.add_job(morning_summary, "cron", hour=8, minute=0)
    scheduler.start()
    logger.info("Scheduler başlatıldı.")

def stop_scheduler():
    scheduler.shutdown()