from sqlalchemy import *
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy(session_options={"autoflush": False})

class App(db.Model):
    __tablename__ = 'App'
    app_id = Column('app_id', Integer, autoincrement=True, primary_key=True)
    app = Column('app', String(255))

    def __init__(self, app):
        self.app_id = None
        self.app = app
    
    def __str__(self):
        return f'{{ "app": "{self.app}", "appID": "{self.app_id}" }}'

class Test_Type(db.Model):
    __tablename__ = 'Test_Type'
    test_type_id = Column('test_type_id', Integer, autoincrement=True, primary_key=True)
    test_type = Column('test_type', String(64))

    def __init__(self, test_type):
        self.test_type_id = None
        self.test_type = test_type

    def __str__(self):
        return f'{{ "test_type": "{self.test_type}", "test_type_id": "{self.test_type_id}" }}'

class Test(db.Model):
    __tablename__ = "Test"
    test_id = Column('test_id', Integer, primary_key=True)
    app_id = Column('app_id', Integer, ForeignKey("App.app_id"))
    test_type_id = Column('test_type_id', Integer, ForeignKey("Test_Type.test_type_id"))
    test = Column('test', String(255), unique=True)
    execution_time = Column('execution_time', Float)
    entry_date = Column('entry_date', DateTime)
    test_status = Column('test_status', String(64))
    times_run = Column('times_run', INT)

    __table_args__ = (
        # this can be db.PrimaryKeyConstraint if you want it to be a primary key
        db.UniqueConstraint('test', 'app_id', name='unique_testname'),
    )

    def __init__(self, app_id, test_type_id, test, execution_time, entry_date, test_status):
        self.test_id = None
        self.app_id = app_id
        self.test_type_id = test_type_id
        self.test = test
        self.execution_time = execution_time
        self.entry_date = entry_date
        self.test_status = test_status
        self.times_run = 1

    def __str__(self):
        return f'{{ "test": "{self.test}", "test_id": "{self.test_id}", "app_id": "{self.app_id}", "test_type_id": "{self.test_type_id}", "execution_time": "{self.execution_time}", "entry_date": "{self.entry_date}", "test_status": "{self.test_status}" }}'

class Test_Run(db.Model):
    __tablename__ = "Test_Run"
    test_id = Column('test_id', Integer, ForeignKey("Test.test_id"))
    execution_time = Column('execution_time', Float)
    entry_date = Column('entry_date', DateTime)
    test_status = Column('test_status', String(64))

    __table_args__ = (
        # this can be db.PrimaryKeyConstraint if you want it to be a primary key
        db.PrimaryKeyConstraint('test_id', 'entry_date'),
        db.UniqueConstraint('test_id', 'entry_date', name='unique_testrun'),
    )

    def __init__(self, test_id, execution_time, entry_date, test_status):
        self.test_id = test_id
        self.execution_time = execution_time
        self.entry_date = entry_date
        self.test_status = test_status

    def __str__(self):
        return f'{{ "test_id": "{self.test_id}", "execution_time": "{self.execution_time}", "entry_date": "{self.entry_date}", "test_status": "{self.test_status}" }}'

