from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class ProductsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_json(200, {"status": "healthy", "service": "products"})
        elif self.path == '/api/products':
            self.get_products()
        else:
            self.send_error(404)
    
    def get_products(self):
        products = [
            {"id": 1, "name": "Running Shoes", "price": 99.99, "stock": 50},
            {"id": 2, "name": "Basketball Shoes", "price": 129.99, "stock": 30}
        ]
        self.send_json(200, {"products": products})
    
    def send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    HTTPServer(('', 80), ProductsHandler).serve_forever()