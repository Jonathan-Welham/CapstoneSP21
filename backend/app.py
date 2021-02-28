from flask import Flask, render_template
import os
 

app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')
 
 
@app.route('/')
def hello():
    return render_template("index.html")
 
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000));
    app.run(host='0.0.0.0', port=port)