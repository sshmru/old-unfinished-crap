from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser

PORT = 8000
Handler = SimpleHTTPRequestHandler
server = HTTPServer(('', PORT), Handler)
webbrowser.open('http://localhost:8000')
server.serve_forever()
print('server wystartowal na porcie', PORT)

