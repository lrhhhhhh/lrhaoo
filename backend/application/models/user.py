from .. import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    email = db.Column(db.String(64), nullable=False)
    username = db.Column(db.String(64), nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)

    black = db.Column(db.Boolean, default=False)
    about_me = db.Column(db.Text)
    register_time = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)

    comments = db.relationship('Comment', backref='user', lazy='dynamic')

    # 被relationship()中的backref隐式定义的字段:
    # role
    # reply_from
    # reply_to

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def json(self):
        return {
            'email': self.email,
            'username': self.username,
            'uid': self.id
        }






