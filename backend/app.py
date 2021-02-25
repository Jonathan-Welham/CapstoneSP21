import os

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello world!'
    # return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
    # app.run()