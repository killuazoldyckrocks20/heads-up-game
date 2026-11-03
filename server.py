#!/usr/bin/env python3
"""
Heads Up! Local Game Server
Serves the web application locally and displays both localhost and LAN IP
so you can instantly open and play it on your smartphone!
"""

import http.server
import socket
import socketserver
import os
import sys

DEFAULT_PORT = 8080

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers for offline development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = DEFAULT_PORT

    # Find open port if 8080 is busy
    for p in range(DEFAULT_PORT, DEFAULT_PORT + 20):
        try:
            with socketserver.TCPServer(("", p), CustomHandler) as httpd:
                lan_ip = get_lan_ip()
                print("=" * 64)
                print("👑  HEADS UP! WEB APP SERVER READY")
                print("=" * 64)
                print(f"💻 On this computer:  http://localhost:{p}")
                print(f"📱 On your phone:     http://{lan_ip}:{p}")
                print("=" * 64)
                print("Press Ctrl+C to stop the server.")
                print("=" * 64)
                sys.stdout.flush()
                httpd.serve_forever()
        except OSError:
            continue

if __name__ == '__main__':
    main()
