import os
from db import DB
from mailer import Mailer
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')
db = DB()

@app.route('/api/test', methods = ['POST'])
def test_post():
    if req.method == "POST":
        body = request.json if request.content_type == "application/json" else request.form
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

@app.route('/api/test-get', methods=['GET'])
def test_get():
    application_name = request.args['application_name'] if 'application_name' in request.args else None
    test_type = request.args['test_type'] if 'test_type' in request.args else None
    status = request.args['status'] if 'status' in request.args else None
    date = request.args['date'] if 'date' in request.args else None

    app_ID, test_type_ID = None, None

    if application_name is not None:
        print(f'Searching for Application with Name: {application_name}', flush=True)

        query, values = "SELECT appID FROM App WHERE app = ?;", (application_name,)
        query_results = db.execute(query, values)
        if query_results[0] == 0:
            return jsonify({'error': f'Invalid application_name: {application_name}'})
        app_ID = query_results[2][0][0]
    
    if test_type is not None:
        print(f'Searching for Test Type with Name: {test_type}', flush=True)

        query, values = "SELECT testTypeID FROM TestType WHERE testType = ?;", (test_type,)
        query_results = db.execute(query, values)
        if query_results[0] == 0:
            return jsonify({'error': f'Invalid test_type: {test_type}'})
        test_type_ID = query_results[2][0][0]

    where = []
    values = []

    if app_ID is not None:
        where.append(' appId = ?')
        values.append(app_ID)
    
    if test_type_ID is not None:
        if len(where) == 0:
            where.append(' testTypeID = ?')
        else:
            where.append('AND testTypeID = ?')
        values.append(test_type_ID)
    
    if status is not None:
        if len(where) == 0:
            where.append(' testStatus = ?')
        else:
            where.append('AND testStatus = ?')
        values.append(status)
    
    if date is not None:
        if len(where) == 0:
            where.append(' entryDate = ?')
        else:
            where.append('AND entryDate = ?')
        values.append(date)
    
    query = 'SELECT * FROM Test WHERE' + ', '.join(where)
    values = tuple(values)
    
    print(f'Query: {query}\nValues: {values}', flush=True)

    query_results = db.execute(query, values)

    return jsonify({'query': query, 'values': values, 'query_results': query_results})

@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
