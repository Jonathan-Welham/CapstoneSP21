import os
import json
import atexit
from mailer import Mailer
from datetime import datetime
from models import db, App, Test, Test_Type, Test_Run
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__, static_url_path='',
            static_folder='./build', template_folder='./build')

# SQLAlchemy configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI', "")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


def send_mail():
    with app.app_context():
        app_stats = get_app_stats()
        body = ""
        for app_stat in app_stats:
            title = f"\t\t<h2>Statistics for App: {app_stat['app']}, Total Pass Percentage: {(app_stat['total_pass'] / (app_stat['total_pass'] + app_stat['total_fail'])) * 100:.2f}%</h2>\n" \
                    f'\t\t<hr>\n'
            body += title
            for test in app_stat['tests']:
                stats = f"\t\t<h3><strong>Test Name:</strong> {test['test_name']}</h3>\n" \
                        f"\t\t<p>Test Type: {test['test_type']}</p>\n" \
                        f"\t\t<p>Times Run: {test['times_run']}</p>\n" \
                        "\t\t<p>Pass Percentage: {:.2f}%</p>\n".format((test['num_pass']/test['times_run']) * 100)
                body += stats
        mailer = Mailer()
        mailer.set_message(subject='Daily Testing Status Report',
                        body=body)
        recepients = ['capstoneg21@gmail.com']
        mailer.send(recepients)

def get_app_stats():
    """ Collect application statistics for an email update """

    """ Step #1:
        Collect all tests and gather any app, or test type information that pertains to them
        Convert data from a list of tuples (each index holding a different model - 0: test, 1: app, 2: test type) 
        into a dictionary that groups the data by app. The app name will serve as the key and its value will be a 
        list of dictionaries, each dictionary holding test information for said app
    """

    data = db.session.query(Test, App, Test_Type).select_from(Test).join(App).join(Test_Type).all()

    grouped_by_app = {}

    for test, app, test_type in data:
        # Each model can have its attributes prepared as a dictionary string 
        # Using json.loads() convert the dictionary string to a dictionary
        # Then, merge all dictionaries into one dictionary to remove overlapping attributes
        collection = { **json.loads(str(test)), **json.loads(str(app)), **json.loads(str(test_type))}

        # If this collection's app has not been set as a key in the dictionary grouping data by app, 
        # add it as a key with it's value being an empty list first, then append the collection to said list
        grouped_by_app.setdefault(collection['app'], []).append(collection)

    """ Step #2:
        Collect statistics for all apps, gather their app name, a list of test statistics, and a total number of passed/failed tests
        For each app, retrieve the history of each of its pertaining tests - how many times each of its tests has ran, passed, and failed
        Return these statistics to be used in an email update
    """

    # Create a list to hold dictionaries holding information for all of an app's test
    all_app_statistics = [] 

    for app, tests in grouped_by_app.items():
        # Compute the statistics for each app
        one_app_statistics = { 'app': app, 'tests': [], 'total_pass': 0, 'total_fail': 0 }

        # For each apps tests, compute how many times it ran, passed, and failed, 
        # and also track the total number of passed/failed tests for said app
        for test in tests:
            test_id, test_name, test_type = test['test_id'], test['test'], test['test_type']
            # Query the database for the history of each test by ID
            try:
                test_results = Test_Run.query.filter_by(test_id=test_id).all()

                num_pass, num_fail = 0, 0

                for test_result in test_results:
                    test_result = json.loads(str(test_result))

                    if test_result['test_status'] == "pass":
                        num_pass += 1
                    elif test_result['test_status'] == "fail":
                        num_fail +=1

                # Record this app's statistics
                one_app_statistics['tests'].append({ "test_name": test_name, "test_type": test_type, "times_run": len(test_results), "num_pass": num_pass, "num_fail": num_fail })
                one_app_statistics['total_pass'] += num_pass
                one_app_statistics['total_fail'] += num_fail
            except Exception as e:
                print(f"Error: {e}", flush=True)
                print(f"Could not process query of database for Test_Run with ID: {test_id}.", flush=True)
            
        all_app_statistics.append(one_app_statistics)
    
    return all_app_statistics
    
# create schedule for mailing status report
scheduler = BackgroundScheduler()
scheduler.start()

scheduler.add_job(
    func=send_mail,
    id='mailing_status_report',
    name='Mail every weekday at 5PM',
    trigger='cron',
    day_of_week='mon-fri',
    hour=17,  # 5PM
    minute=0,
    second=0,
    replace_existing=True)

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())


@app.route('/api/post-tests', methods=['POST'])
def post_tests():
    if request.method == "POST":
        body = request.json if request.content_type == "application/json" else request.form
        app_id = None
        test_type_id = None

        # Checks that app info was given in the body
        if(not ('application' in body) or not body['application']):
            return jsonify({'success': False, 'message': "No application given"}), 404

        try:
            # Grab the app id if the app is already in the db, or add it to the db and get its id
            app_info = App.query.filter_by(app=body['application']).first()
            if(app_info):
                app_id = app_info.app_id
            else:
                app_info = App(body['application'])
                db.session.add(app_info)
                db.session.flush()
                app_id = app_info.app_id

            # checks that a test type was given in the body
            if(not ('test_type' in body) or not body['test_type']):
                return jsonify({'success': False, 'message': "No test_type given"}), 404

            # Grab the id for test type if it is already in the db, or add the test type and get its id
            test_type_info = Test_Type.query.filter_by(
                test_type=body['test_type']).first()
            if(test_type_info):
                test_type_id = test_type_info.test_type_id
            else:
                test_type_info = Test_Type(body['test_type'])
                db.session.add(test_type_info)
                db.session.flush()
                test_type_id = test_type_info.test_type_id

            # for every test in the json add it to the database.  If it is already in the database instead of adding it update it
            tests = body['tests']
            tests_badly_formatted = []
            tests_total = 0
            tests_entered = 0
            for test in tests:
                # if not in proper format do not add to database, and sendback its formatted wrong
                tests_total = tests_total + 1
                if(not ('test' in test) or not test['test']):
                    tests_badly_formatted.append(test)
                    continue

                test_name = test['test']
                execution_time = test['execution_time'] if 'execution_time' in test and test['execution_time'] else None
                test_status = test['result'] if 'result' in test and test['result'] else None
                entry_date = datetime.today()

                # if the test is already in the database update its information
                affected_row = Test.query.filter_by(test=test_name, app_id=app_id).update(
                    {'execution_time': execution_time, 'test_status': test_status, 'times_run': (Test.times_run + 1), 'entry_date': entry_date})
                temp_test_run = None
                # if no rows were affected on the update then it is not already in the database so add it and create a new test_run entry
                if(affected_row < 1):
                    temp_test = Test(
                        app_id, test_type_id, test['test'], test['execution_time'], entry_date, test['result'])
                    db.session.add(temp_test)
                    db.session.flush()
                    test_id = temp_test.test_id
                    temp_test_run = Test_Run(
                        test_id, temp_test.execution_time, temp_test.entry_date, temp_test.test_status)
                # find the test_id of the test and create a new test_run entry
                else:
                    test_id = db.session.query(Test.test_id).filter_by(
                        test=test['test']).first()[0]
                    temp_test_run = Test_Run(
                        test_id, test['execution_time'], entry_date, test['result'])
                # add test_run entry
                db.session.add(temp_test_run)

                tests_entered = tests_entered + 1
            db.session.commit()
        except Exception as e:
            print(f"error: {e}", flush=True)
            return jsonify({"success": False, "message": "Error: failed to to process data. Please try again"}), 200
        finally:
            db.session.close()
    else:
        # send a 404 error on bad data requests
        abort(404)

    if(len(tests_badly_formatted) > 0):
        return jsonify({"success": True, "message": f"{tests_entered} tests have been logged out of {tests_total}", "tests_badly_formatted": tests_badly_formatted}), 200
    return jsonify({"success": True, "message": f"{tests_entered} tests have been logged out of {tests_total}"}), 200


@app.route('/api/query-tests', methods=['GET'])
def get_tests():
    # Query tests without any filters
    apply_filters = request.args['apply_filters'] if 'apply_filters' in request.args else False
    if not apply_filters:
        try:
            raw_results = db.session.query(Test, App, Test_Type).select_from(
                Test).join(App).join(Test_Type).all()
            query_results = list(map(lambda result: {**{'app': result[1].app, 'test_type': result[2].test_type}, **{
                                 c.name: str(getattr(result[0], c.name)) for c in result[0].__table__.columns}}, raw_results))
            return jsonify({'success': True, 'message': 'Query processed', 'query_results': query_results})
        except:
            return jsonify({'success': False, 'message': 'Error processing query'})

    # Make a dictionary of attr. to filter tests by after validating keys from query
    test_query_pairs = {key: value for key,
                        value in request.args.items() if hasattr(Test, key)}
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
            test_type_result = Test_Type.query.filter_by(
                test_type=test_type).first()
            if test_type_result is None:
                return jsonify({'success': False, 'message': f'No test type with matching name: {test_type}'})
            test_type_id = test_type_result.test_type_id
            test_query_pairs['test_type_id'] = test_type_id
        except:
            return jsonify({'success': False, 'message': f'Error processing query searching for test type with matching name: {test_type}'})

    # Get tests using all processed filters
    try:
        raw_results = db.session.query(Test, App, Test_Type).select_from(
            Test).filter_by(**test_query_pairs).join(App).join(Test_Type).all()
        query_results = list(map(lambda result: {**{'app': result[1].app, 'test_type': result[2].test_type}, **{
                             c.name: str(getattr(result[0], c.name)) for c in result[0].__table__.columns}}, raw_results))
        return jsonify({'success': True, 'message': 'Query processed', 'query_results': query_results})
    except:
        return jsonify({'success': False, 'message': 'Error processing query'})


@app.route('/api/get-dashboard-info', methods=['GET'])
def get_dashboard_info():
    if request.method == "GET":
        apps = get_apps()
        recent_tests = get_recent_tests()
        test_frequencies = get_test_frequencies(None)

        output = {}
        if(apps[0]):
            output["apps"] = apps[1]
        if(recent_tests[0]):
            output["tests"] = recent_tests[1]
        if(test_frequencies[0]):
            entries = test_frequencies[1]
            output["test_frequencies"] = {"dates": [], "counts": []}

            for entry in entries:
                output["test_frequencies"]["dates"].append(
                    str(entry[0].month) + "/" + str(entry[0].day))
                output["test_frequencies"]["counts"].append(entry[1])

        return jsonify(output), 200
    else:
        abort(404)


@app.route('/api/get-test-frequencies', methods=['GET'])
def get_test_frequencies_route():
    if request.method == "GET":
        entries = None

        if(request.args and request.args['app']):
            temp = get_test_frequencies(request.args['app'])
            if(temp[0]):
                entries = temp[1]
            else:
                return jsonify({"success": False, "message": "invalid query"}), 400
        else:
            temp = get_test_frequencies(None)
            if(temp[0]):
                entries = temp[1]
            else:
                return jsonify({"success": False, "message": "invalid query"}), 400

        if(not entries):
            return jsonify({"success": False, "message": "invalid query"}), 400

        output = {"success": True, "counts": [], "dates": []}
        for entry in entries:
            output["dates"].append(
                str(entry[0].month) + "/" + str(entry[0].day))
            output["counts"].append(entry[1])

        return jsonify(output), 200
    else:
        abort(404)


# Get test history for a specific Test
@app.route('/api/get-test-history', methods=['GET'])
def get_test_history_route():
    if request.method == "GET":
        if(request.args and request.args['test_id']):
            test_id = request.args['test_id']

            try:
                # Retrieves the test run history for a specific test by test id
                tests = db.session.query(Test_Run.test_id, Test_Run.entry_date, Test_Run.execution_time,
                                         Test_Run.test_status).filter(Test_Run.test_id == test_id).all()

                output = []
                for test in tests:
                    output.append({
                        "test_id": test[0],
                        "entry_date": test[1],
                        "execution_time": test[2],
                        "test_status": test[3]
                    })

                return jsonify(output)
            except Exception as e:
                print(f"error: {e}", flush=True)
                return jsonify({"success": False, "message": "Error processing query"}), 400
            finally:
                db.session.close()
        else:
            return jsonify({"success": False, "message": "Invalid query"}), 400
    else:
        abort(404)


# Returns the test frequencies for a specific app, or if given no app returns test frequencies for all apps.
# The data is returned as a array of tuples where the first element in each tuple is the date and the second
# element is the amount of tests run on that date.
def get_test_frequencies(app):
    try:
        print(f"app: {app}", flush=True)
        if(app):
            return (True, db.session.query(db.func.cast(Test.entry_date, db.Date), db.func.count(db.func.cast(Test.entry_date, db.Date))).join(App)
                    .filter(App.app == app).group_by(db.func.cast(Test.entry_date, db.Date)).all())
        else:
            return (True, db.session.query(db.func.cast(Test.entry_date, db.Date), db.func.count(db.func.cast(Test.entry_date, db.Date))).join(App)
                    .group_by(db.func.cast(Test.entry_date, db.Date)).all())
    except Exception as e:
        return (False,)


# returns the names of all apps
def get_apps():
    try:
        output = []
        for app in db.session.query(App.app).all():
            output.append({"app": app[0]})

        return (True, output)
    except:
        return (False,)
    finally:
        db.session.close()


# returns the most recent rows of tests as an array of jsons containing test id, app name, test type, test, execution time,
# entry date, test status, and times run in this order.
def get_recent_tests():
    args = (Test.test_id, App.app, Test_Type.test_type, Test.test, Test.execution_time,
            Test.entry_date, Test.test_status, Test.times_run)
    args_to_string = ["test_id", "app", "test_type", "test",
                      "execution_time", "entry_date", "test_status", "times_run"]

    try:
        tests = db.session.query(
            *args).join(App).join(Test_Type).order_by(Test.entry_date).limit(50).all()
        output = []

        # convert tests from an array format to an array of jsons
        for test in tests:
            temp = {}
            for n in range(0, len(test)):
                temp[args_to_string[n]] = test[n]

            output.append(temp)

        return (True, output)
    except Exception as e:
        print(f"error: {e}", flush=True)
        return (False,)
    finally:
        db.session.close()

@app.route('/test', methods=['GET'])
def test():
    data = get_app_stats()
    return jsonify(data)

@app.route('/')
def home():
    return render_template("index.html")


"""
    An application factory for tethering a database to SQLAlchemy models.
    For use in initialization or updates.
    In practice:
        Load in environment variables
        Navigate to the backend directory
        Import this function and run through a Python interactive session
        1. >>> from app import create_app 
        2. >>> from models import db      
        3. >>> db.create_all(app=create_app())
"""
def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='./build', template_folder='./build')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI', "")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    return app


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    # app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)
