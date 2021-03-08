from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Adding a new table to test sqlalchemy, will be trashed later
class User(db.Model):
    _id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age