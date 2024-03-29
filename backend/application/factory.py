import os
import redis
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import config

db = SQLAlchemy()
jwt = JWTManager()
revoked_store = redis.StrictRedis(
    host=getattr(config[os.getenv('FLASK_ENV')], 'REDIS_HOST'),
    port=getattr(config[os.getenv('FLASK_ENV')], 'REDIS_PORT'),
    db=0,
    decode_responses=True
)


def create_app(config_name=None):

    config_name = config_name if config_name else os.getenv('FLASK_ENV')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)

    from .api import api_blueprint
    from .auth import auth_blueprint
    app.register_blueprint(api_blueprint)
    app.register_blueprint(auth_blueprint)

    return app
