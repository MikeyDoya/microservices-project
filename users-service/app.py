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
                "service": "users", 
                "database": "connected",
                "port": os.getenv('PORT', 3000)
            }), 200
        else:
            return jsonify({
                "status": "unhealthy", 
                "service": "users", 
                "database": "disconnected"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "service": "users", 
            "error": str(e)
        }), 500

@app.route('/api/users/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id',
            (data.get('name'), data.get('email'), data.get('password'))
        )
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        
        return jsonify({
            "id": user_id,
            "name": data.get('name'),
            "email": data.get('email'),
            "message": "User registered successfully"
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/users/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, name, email FROM users WHERE email = %s AND password_hash = %s',
            (data.get('email'), data.get('password'))
        )
        
        user = cursor.fetchone()
        if user:
            return jsonify({
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "message": "Login successful"
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    """Nuevo endpoint para listar usuarios"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name, email FROM users')
        users = cursor.fetchall()
        
        users_list = []
        for user in users:
            users_list.append({
                "id": user[0],
                "name": user[1],
                "email": user[2]
            })
        
        return jsonify(users_list), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('DEBUG', False))
