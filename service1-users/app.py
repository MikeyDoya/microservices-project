from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'password')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'users_db')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))

mysql = MySQL(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for ECS"""
    try:
        # Test database connection
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT 1')
        cursor.close()
        return jsonify({
            'status': 'healthy',
            'service': 'users-service',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'users-service',
            'database': 'disconnected'
        }), 503

@app.route('/users', methods=['GET'])
def get_users():
    """Get all users from database"""
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, username, email FROM users')
        users = cursor.fetchall()
        cursor.close()
        
        user_list = []
        for user in users:
            user_list.append({
                'id': user[0],
                'username': user[1],
                'email': user[2]
            })
        
        return jsonify({
            'success': True,
            'count': len(user_list),
            'users': user_list
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json(force=True, silent=True)
        
        if data is None:
            return jsonify({
                'success': False,
                'error': 'Invalid or missing JSON data'
            }), 400
        
        username = data.get('username')
        email = data.get('email')
        
        if not username or not email:
            return jsonify({
                'success': False,
                'error': 'Username and email are required'
            }), 400
        
        cursor = mysql.connection.cursor()
        cursor.execute(
            'INSERT INTO users (username, email) VALUES (%s, %s)',
            (username, email)
        )
        mysql.connection.commit()
        user_id = cursor.lastrowid
        cursor.close()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'id': user_id,
                'username': username,
                'email': email
            }
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID"""
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, username, email FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            return jsonify({
                'success': True,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2]
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
