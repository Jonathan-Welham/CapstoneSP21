import os
from db import DB
from mailer import Mailer
from datetime import date
from flask import Flask, render_template, request, jsonify, abort
from models import db
from models import App, Test, Test_Type

app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI', "")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/test', methods=['POST'])
def test_post():
    if request.method == "POST":
        body = request.json if request.content_type == "application/json" else request.form
        app_id = None
        test_type_id = None
        data = []

        # Grab the app id if the app is already in the db, or add it to the db and get its id
        app_info = App.query.filter_by(app=body['application']).first()
        if(app_info.app):
            app_id = app_info.app_id
        else:
            app_info = App(body['application'])
            db.session.add(app_info)
            db.session.flush()
            app_id = app_info.app_id

        # Grab the id for test type if it is already in the db, or add the test type and get its id
        test_type_info = Test_Type.query.filter_by(test_type=body['test_type']).first()
        if(test_type_info.test_type):
            test_type_id = test_type_id
        else:
            test_type_info = Test_Type(body['test_type'])
            db.session.add(test_type_info)
            db.session.flush()
            test_type_id = test_type_info.test_type_id

        # for every test in the json add it to the database.  If it is already in the database instead of adding it update it
        tests = body['tests']
        for test in tests:
            affected_row = Test.query.filter_by(test=test['test']).update({'execution_time': test['execution_time'], 'test_status': test['result'], 'times_run': (Test.times_run + 1)})

            if(affected_row < 1):
                temp_test = Test(app_id, test_type_id, test['test'], test['execution_time'], date.today(), test['result'])
                db.session.add(temp_test)

        db.session.commit()
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