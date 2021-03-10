import os
from db import DB
from mailer import Mailer
from datetime import date
from flask import Flask, render_template, request, jsonify, abort
# remove 'as dB' once routes are converted to using sqlalchemy for database interaction
from models import db as dB
from models import App, Test, Test_Type

app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI', "")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = DB()
# replace with db.init_app(app) once converted to using sqlalchemy
dB.init_app(app)

@app.route('/api/test', methods=['POST'])
def test_post():
    if req.method == "POST":
        body = request.json if request.content_type == "application/json" else request.form
        app_ID = None
        testType_ID = None
        data = []

        # Get appID, insert app into db if it is not already in there
        app_info = db.execute(
            "SELECT * FROM App WHERE app=?;", (body['application'],))
        if(app_info[0] != 0):
            app_ID = app_info[2][0][0]
        else:
            app_ID = db.execute("INSERT INTO App VALUES(?,?);",
                                (None, body['application']))[1]

        # Get testTypeID, insert testType into db if it is not already in there
        testType_info = db.execute(
            "SELECT * FROM TestType WHERE testType=?;", (body['testType'],))
        if(testType_info[0] != 0):
            testType_ID = testType_info[2][0][0]
        else:
            testType_ID = db.execute(
                "INSERT INTO TestType VALUES(?,?);", (None, body['testType']))[1]

        # format the tests into an array of tuples to prepare them for insert into the db
        tests = body['tests']
        for test in tests:
            data.append((None, app_ID, testType_ID,
                         test['test'], test['executionTime'], test['result'], test['result']))

        # run an insert sql query, and insert the data
        db.executemany(
            "INSERT INTO Test VALUES(?,?,?,?,?,CURDATE(),?,1) ON DUPLICATE KEY UPDATE testStatus=?, timesRun=timesRun + 1;", data)
    else:
        # send a 404 error on bad data requests
        abort(404)
    return "", 200


@app.route('/api/query-tests', methods=['GET'])
def get_tests():
    # Make a dictionary of attr. to filter tests by after validating keys from query
    test_query_pairs = {key: value for key, value in request.args.items() if hasattr(Test, key)}
    """ 
        All valid keys derived from query string for filtering tests: 
            test_id
            app_id -> derived by 'app' if provided in request arguments
            test_type_id -> derived by 'test_type' if provided in request arguments
            test
            execution_time
            entry_date
            test_status
            times_run
    """

    app_id, test_type_id = None, None

    # Get app ID if query arg for app name is present, then insert into test_query_pairs
    app_name = str(request.args['app']) if 'app' in request.args else None
    if app_name is not None:
        try:
            app_result = App.query.filter_by(app=app_name).first()
            if app_result is None:
                return jsonify({'success': False, 'message': f'No app with matching name: {app_name}'})
            app_id = app_result.app_id
            test_query_pairs['app_id'] = app_id
        except:
            return jsonify({'success': False, 'message': f'Error processing query searching for application with matching name: {app_name}'})

    # Get test type ID if query arg for test type is present, then insert into test_query_pairs
    test_type = request.args['test_type'] if 'test_type' in request.args else None
    if test_type is not None:
        try:
            test_type_result = Test_Type.query.filter_by(test_type=test_type).first()
            if test_type_result is None:
                return jsonify({'success': False, 'message': f'No test type with matching name: {test_type}'})
            test_type_id = test_type_result.test_type_id
            test_query_pairs['test_type_id'] = test_type_id
        except:
            return jsonify({'success': False, 'message': f'Error processing query searching for test type with matching name: {test_type}'})
    
    # Get tests using all processed filters, TODO: Figure out how to compute joins to also include app names and test type names
    try:
        tests = Test.query.filter_by(**test_query_pairs).all()
        query_results = list(map(lambda test: {c.name: getattr(test, c.name) for c in test.__table__.columns}, tests))
        return jsonify({'success': True, 'message': 'Query processed', 'query_results': query_results})
    except:
        return jsonify({'success': False, 'message': 'Error processing query'})
    
@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)