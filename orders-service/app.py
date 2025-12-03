import os
from flask import Flask, jsonify, request
from database import get_db_connection

app = Flask(__name__)

@app.route('/api/orders/health', methods=['GET'])
def health_orders():
    return health()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint para ALB Target Groups"""
    try:
        conn = get_db_connection()
        if conn:
            conn.close()
            return jsonify({
                "status": "healthy", 
                "service": "orders", 
                "database": "connected",
                "port": os.getenv('PORT', 3001)
            }), 200
        else:
            return jsonify({
                "status": "unhealthy", 
                "service": "orders", 
                "database": "disconnected"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "service": "orders", 
            "error": str(e)
        }), 500

@app.route('/api/orders/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insertar en la tabla orders/cart
        cursor.execute(
            '''INSERT INTO orders (user_id, product_id, product_name, price, quantity) 
               VALUES (%s, %s, %s, %s, %s) RETURNING id''',
            (data.get('user_id'), data.get('product_id'), data.get('product_name'), 
             data.get('price'), data.get('quantity', 1))
        )
        
        order_id = cursor.fetchone()[0]
        conn.commit()
        
        cart_item = {
            "id": order_id,
            "user_id": data.get('user_id'),
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
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/orders/user/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    """Obtener órdenes por usuario"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, product_id, product_name, price, quantity, created_at FROM orders WHERE user_id = %s',
            (user_id,)
        )
        
        orders = cursor.fetchall()
        orders_list = []
        for order in orders:
            orders_list.append({
                "id": order[0],
                "product_id": order[1],
                "product_name": order[2],
                "price": float(order[3]),
                "quantity": order[4],
                "created_at": order[5].isoformat() if order[5] else None
            })
        
        return jsonify(orders_list), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Eliminar orden específica"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM orders WHERE id = %s', (order_id,))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "Order deleted successfully"}), 200
        else:
            return jsonify({"error": "Order not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('DEBUG', False))
