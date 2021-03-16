from sqlalchemy import *
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

class App(db.Model):
    __tablename__ = 'App'
    app_id = Column('app_id', Integer, autoincrement=True, primary_key=True)
    app = Column('app', String(255))

    def __init__(self, app):
        self.app_id = None
        self.app = app
    
    def __str__(self):
        return "{" + f"app: {self.app} \n appID: {self.app_id}" + "}"

class Test_Type(db.Model):
    __tablename__ = 'Test_Type'
    test_type_id = Column('test_type_id', Integer, autoincrement=True, primary_key=True)
    test_type = Column('test_type', String(64))

    def __init__(self, test_type):
        self.test_type_id = None
        self.test_type = test_type

    def __str__(self):
        return "{" + f"test_type: {self.test_type} \n test_type_id: {self.test_type_id}" + "}"

class Test(db.Model):
    __tablename__ = "Test"
    test_id = Column('test_id', Integer, primary_key=True)
    app_id = Column('app_id', Integer, ForeignKey("App.app_id"))
    test_type_id = Column('test_type_id', Integer, ForeignKey("Test_Type.test_type_id"))
    test = Column('test', String(255), unique=True)
    execution_time = Column('execution_time', Float)
    entry_date = Column('entry_date', Date)
    test_status = Column('test_status', String(64))
    times_run = Column('times_run', INT)

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
        return "{" + f"test: {self.test}\n test_id: {self.test_id}\n app_id: {self.app_id}\n test_type_id: {self.test_type_id}\n "
        + f"execution_time: {self.execution_time}\n entry_date: {self.entry_date}\n test_status: {self.test_status}" + "}"