import http.server
import socketserver
import os
import zipfile
import webbrowser
import json

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_PATH = os.path.join(BASE_DIR, "tutorment-project.zip")
TARGET_DIR = os.path.join(BASE_DIR, "tutorment-project")
FRONTEND_DIR = os.path.join(TARGET_DIR, "frontend")

# 1. Unzip project if not extracted
if not os.path.exists(FRONTEND_DIR):
    print("📦 Extracting website files for the first time...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        for member in z.infolist():
            if '{' in member.filename or '}' in member.filename:
                continue
            target_path = os.path.join(TARGET_DIR, member.filename)
            if member.is_dir():
                os.makedirs(target_path, exist_ok=True)
            else:
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with z.open(member) as src, open(target_path, 'wb') as dst:
                    dst.write(src.read())
    print("✅ Extraction complete!")

class TutormentHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length > 0 else b''
        print(f"\n📩 Form / API request received: {self.path}")
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        reply = {"success": True, "message": "Local mock success", "token": "local-token-123"}
        self.wfile.write(json.dumps(reply).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

print(f"\n" + "="*50)
print(f"  🎉 THE TUTORMENT IS RUNNING LOCALLY!")
print(f"  👉 Website URL: http://localhost:{PORT}")
print(f"  Press Ctrl + C in Terminal to stop the server.")
print(f"="*50 + "\n")

# Open browser disabled for headless/sandboxed execution
with socketserver.TCPServer(("127.0.0.1", PORT), TutormentHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")
