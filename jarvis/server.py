
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
 
data = {'result': 'this is a test'}
host = ('localhost', 8888)
 
class Resquest(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.end_headers()
        print(self.path)
        valueInputs=self.path.split("?")[1]
        self.wfile.write(json.dumps(updates(valueInputs)).encode())
def updates(strings):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",}
    url = "http://api.qingyunke.com/api.php?key=free&appid=0&msg="+strings
    response = requests.get(url, headers=headers).text
    a=response.split("\"")
    print(a[5])
    return a[5]
if __name__ == '__main__':
    server = HTTPServer(host, Resquest)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()


