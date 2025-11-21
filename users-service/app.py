from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import psycopg2
import os

class UsersHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_json(200, {"status": "healthy", "service": "users"})
        elif self.path == '/api/users':
            self.get_users()
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/api/users/login':
            self.send_json(200, {"token": "fake-token", "user_id": 1})
        elif self.path == '/api/users/register':
            self.send_json(201, {"message": "User registered"})
        else:
            self.send_error(404)
    
    def get_users(self):
        self.send_json(200, {"users": [{"id": 1, "email": "test@example.com"}]})
    
    def send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    HTTPServer(('', 80), UsersHandler).serve_forever()