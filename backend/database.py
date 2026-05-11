import sqlite3
import json
from datetime import datetime, timedelta
import random

def get_connection():
    conn = sqlite3.connect("pazar_radari.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Tabloları oluştur
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer TEXT,
            product TEXT,
            status TEXT,
            cargo_code TEXT,
            created_at TEXT
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stock (
            product TEXT PRIMARY KEY,
            unit TEXT,
            quantity INTEGER,
            threshold INTEGER,
            supplier_email TEXT
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cargo (
            code TEXT PRIMARY KEY,
            order_id TEXT,
            status TEXT,
            estimated_delivery TEXT,
            delayed INTEGER,
            last_location TEXT
        )
    """)

    # Mock veri ekle
    cursor.execute("SELECT COUNT(*) FROM orders")
    if cursor.fetchone()[0] == 0:
        orders = [
            ("ORD001", "Ahmet Yılmaz", "Zeytinyağı 5L", "beklemede", "KARGO001", "2026-05-08"),
            ("ORD002", "Fatma Demir", "Doğal Sabun", "kargoda", "KARGO002", "2026-05-07"),
            ("ORD003", "Mehmet Kaya", "Çanta Deri", "teslim edildi", "KARGO003", "2026-05-06"),
            ("ORD004", "Ayşe Çelik", "Zeytinyağı 1L", "beklemede", "KARGO004", "2026-05-09"),
            ("ORD005", "Ali Şahin", "Organik Bal", "kargoda", "KARGO005", "2026-05-08"),
        ]
        cursor.executemany("INSERT INTO orders VALUES (?,?,?,?,?,?)", orders)

        stock = [
            ("Zeytinyağı 5L", "adet", 8, 10, "tedarikci@zeytinfarm.com"),
            ("Doğal Sabun", "adet", 45, 15, "tedarikci@sabun.com"),
            ("Çanta Deri", "adet", 3, 5, "tedarikci@dericanta.com"),
            ("Zeytinyağı 1L", "adet", 12, 10, "tedarikci@zeytinfarm.com"),
            ("Organik Bal", "kg", 6, 8, "tedarikci@bal.com"),
        ]
        cursor.executemany("INSERT INTO stock VALUES (?,?,?,?,?)", stock)

        cargo = [
            ("KARGO001", "ORD001", "depoda", "2026-05-12", 0, "İstanbul Depo"),
            ("KARGO002", "ORD002", "yolda", "2026-05-10", 1, "Ankara Şube"),
            ("KARGO003", "ORD003", "teslim edildi", "2026-05-09", 0, "Teslim Noktası"),
            ("KARGO004", "ORD004", "depoda", "2026-05-13", 0, "İstanbul Depo"),
            ("KARGO005", "ORD005", "yolda", "2026-05-11", 1, "İzmir Şube"),
        ]
        cursor.executemany("INSERT INTO cargo VALUES (?,?,?,?,?,?)", cargo)

    conn.commit()
    conn.close()
    print("Veritabanı hazır.")