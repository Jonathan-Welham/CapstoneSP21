from flask import Flask, render_template, jsonify, abort
from flask import request as req
import os
from db import DB

app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')
db = DB()

@app.route('/api/test', methods = ['POST'])
def test():
    if req.method == "POST":
        body = req.json if req.content_type == "application/json" else req.form
        app_ID = None
        testType_ID = None
        data = []

        # Get appID, insert app into db if it is not already in there
        app_info = db.execute("SELECT * FROM App WHERE app=?;", (body['application'],))
        if(app_info[0] != 0):
            app_ID = app_info[2][0][0]
        else:
            app_ID = db.execute("INSERT INTO App VALUES(?,?);", (None, body['application']))[1]

        # Get testTypeID, insert testType into db if it is not already in there
        testType_info = db.execute("SELECT * FROM TestType WHERE testType=?;", (body['testType'],))
        if(testType_info[0] != 0):
            testType_ID = testType_info[2][0][0]
        else:
            testType_ID = db.execute("INSERT INTO TestType VALUES(?,?);", (None, body['testType']))[1]

        # format the tests into an array of tuples to prepare them for insert into the db
        tests = body['tests']
        for test in tests:
            data.append((None, app_ID, testType_ID, test['test'], test['executionTime'], test['result'], test['result']))
        
        # run an insert sql query, and insert the data
        db.executemany("INSERT INTO Test VALUES(?,?,?,?,?,CURDATE(),?,1) ON DUPLICATE KEY UPDATE testStatus=?, timesRun=timesRun + 1;", data)
    else:
        # send a 404 error on bad data requests
        abort(404)
    return "", 200

@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000));
    app.run(host='0.0.0.0', port=port)