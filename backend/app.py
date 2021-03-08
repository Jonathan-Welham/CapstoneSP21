import os
from db import DB
from mailer import Mailer
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from models import db, User


app = Flask(__name__, static_url_path='', static_folder='./build', template_folder='./build')

# Flask SQLAlchemy Configuration...
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_DATABASE = os.environ.get('DB_DATABASE')

#Connection URI Format: mysql+pymysql://username:password@host/dbname
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_DATABASE}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/add-user', methods=['POST'])
def addUser():
    body = request.json
    name, email, age = body['name'], body['email'], body['age']

    try:
        user = User.query.filter_by(email=email).first()
        if user is not None:
            return jsonify({'success': False, 'message': 'An account with that email is taken!'})

        user = User(name, email, age)
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Account created!'})
    except:
        return jsonify({'success': False, 'message': 'Error registering for an account!'})


@app.route('/api/test-get', methods=['GET'])
def test_get():
    application_name = request.args['application_name'] if 'application_name' in request.args else None
    test_type = request.args['test_type'] if 'test_type' in request.args else None
    status = request.args['status'] if 'status' in request.args else None
    date = request.args['date'] if 'date' in request.args else None

    app_ID, test_type_ID = None, None

    if application_name is not None:
        print(
            f'Searching for Application with Name: {application_name}', flush=True)

        query, values = "SELECT appID FROM App WHERE app = ?;", (
            application_name,)
        query_results = db.execute(query, values)
        if query_results[0] == 0:
            return jsonify({'error': f'Invalid application_name: {application_name}'})
        app_ID = query_results[2][0][0]

    if test_type is not None:
        print(f'Searching for Test Type with Name: {test_type}', flush=True)

        query, values = "SELECT testTypeID FROM TestType WHERE testType = ?;", (
            test_type,)
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
