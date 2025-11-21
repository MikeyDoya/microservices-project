from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class OrdersHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_json(200, {"status": "healthy", "service": "orders"})
        elif self.path == '/api/orders':
            self.get_orders()
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/api/orders':
            self.create_order()
        else:
            self.send_error(404)
    
    def get_orders(self):
        self.send_json(200, {"orders": [{"id": 1, "total": 99.99}]})
    
    def create_order(self):
        self.send_json(201, {"order_id": 1, "status": "created"})
    
    def send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    HTTPServer(('', 80), OrdersHandler).serve_forever()