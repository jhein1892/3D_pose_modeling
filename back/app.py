from flask import Flask, make_response, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
# cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# @app.route('/', methods=["GET"])
# def handle_request():
#     return "", 200

@app.route('/')
def hello():
    print("HERE")
    return make_response({"response" : "Hello World"})

@app.route('/upload', methods=["POST"])
def uploadVideo():
    print("Upload Complete")


if __name__ == "__main__":
    app.run()