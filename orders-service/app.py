import os
from flask import Flask, jsonify, request
from database import get_db_connection  # ← NUEVA IMPORTACIÓN

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    conn = get_db_connection()  # ← VERIFICA CONEXIÓN BD
    if conn:
        conn.close()
        return jsonify({"status": "healthy", "service": "orders", "database": "connected"})
    else:
        return jsonify({"status": "unhealthy", "service": "orders", "database": "disconnected"}), 500

@app.route('/api/orders/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        conn = get_db_connection()  # ← CONEXIÓN REAL
        
        # Aquí tu lógica para guardar en BD
        # Por ahora mantenemos la simulación
        
        cart_item = {
            "id": 1,  # Simulado
            "product_id": data.get('product_id'),
            "product_name": data.get('product_name'),
            "price": data.get('price'),
            "quantity": data.get('quantity', 1)
        }
        
        return jsonify({
            "message": "Item added to cart",
            "cart_item": cart_item
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ... resto de endpoints
