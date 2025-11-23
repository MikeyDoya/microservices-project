import os
from flask import Flask, jsonify, request
from database import get_db_connection

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint para ALB Target Groups"""
    try:
        conn = get_db_connection()
        if conn:
            conn.close()
            return jsonify({
                "status": "healthy", 
                "service": "products", 
                "database": "connected",
                "port": os.getenv('PORT', 3002)
            }), 200
        else:
            return jsonify({
                "status": "unhealthy", 
                "service": "products", 
                "database": "disconnected"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "service": "products", 
            "error": str(e)
        }), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    """Obtener todos los productos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name, description, price, category, stock FROM products')
        products = cursor.fetchall()
        
        products_list = []
        for product in products:
            products_list.append({
                "id": product[0],
                "name": product[1],
                "description": product[2],
                "price": float(product[3]),
                "category": product[4],
                "stock": product[5]
            })
        
        return jsonify(products_list), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Obtener producto específico por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, name, description, price, category, stock FROM products WHERE id = %s',
            (product_id,)
        )
        
        product = cursor.fetchone()
        if product:
            return jsonify({
                "id": product[0],
                "name": product[1],
                "description": product[2],
                "price": float(product[3]),
                "category": product[4],
                "stock": product[5]
            }), 200
        else:
            return jsonify({"error": "Product not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/products', methods=['POST'])
def create_product():
    """Crear nuevo producto"""
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            '''INSERT INTO products (name, description, price, category, stock) 
               VALUES (%s, %s, %s, %s, %s) RETURNING id''',
            (data.get('name'), data.get('description'), data.get('price'), 
             data.get('category'), data.get('stock', 0))
        )
        
        product_id = cursor.fetchone()[0]
        conn.commit()
        
        return jsonify({
            "id": product_id,
            "name": data.get('name'),
            "description": data.get('description'),
            "price": data.get('price'),
            "category": data.get('category'),
            "stock": data.get('stock', 0),
            "message": "Product created successfully"
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Actualizar producto existente"""
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            '''UPDATE products SET name = %s, description = %s, price = %s, 
               category = %s, stock = %s WHERE id = %s''',
            (data.get('name'), data.get('description'), data.get('price'),
             data.get('category'), data.get('stock'), product_id)
        )
        
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "Product updated successfully"}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Eliminar producto"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM products WHERE id = %s', (product_id,))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "Product deleted successfully"}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3002))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('DEBUG', False))
