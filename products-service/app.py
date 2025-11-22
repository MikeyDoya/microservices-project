import os
from flask import Flask, jsonify
from database import get_db_connection  # ← NUEVA IMPORTACIÓN
from sample_data import sample_products

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    conn = get_db_connection()  # ← VERIFICA CONEXIÓN BD
    if conn:
        conn.close()
        return jsonify({"status": "healthy", "service": "products", "database": "connected"})
    else:
        return jsonify({"status": "unhealthy", "service": "products", "database": "disconnected"}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products - PRIMERO intenta BD, luego datos de ejemplo"""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM products')
            products = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify(products)
        else:
            # Fallback a datos de ejemplo si BD no conecta
            return jsonify(sample_products)
    except Exception as e:
        # Fallback a datos de ejemplo si hay error
        return jsonify(sample_products)

# ... resto de endpoints similares
