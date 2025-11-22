import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Establece conexión a RDS usando variables de entorno de ECS"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),  # ← Desde ECS
            port=os.getenv('DB_PORT')
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None
