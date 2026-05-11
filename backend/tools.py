import sqlite3
from database import get_connection

def get_orders():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_stock():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM stock")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_critical_stock():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM stock WHERE quantity <= threshold")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_cargo_status(cargo_code: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cargo WHERE code = ?", (cargo_code,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_delayed_cargo():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cargo WHERE delayed = 1")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_order_by_id(order_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def draft_supplier_email(product: str, quantity: int, supplier_email: str):
    return {
        "to": supplier_email,
        "subject": f"Stok Yenileme Talebi — {product}",
        "body": f"""Sayın Tedarikçi,

{product} ürününün stok seviyesi kritik eşiğin altına düşmüştür.
{quantity} adet sipariş verilmesini talep ediyoruz.

İyi çalışmalar,
Pazar Radarı Sistemi"""
    }