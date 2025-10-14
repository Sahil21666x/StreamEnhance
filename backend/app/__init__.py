from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['MONGODB_URI'] = os.getenv('DATABASE_URL', 'mongodb://localhost:27017/')
app.config['DATABASE_NAME'] = os.getenv('DATABASE_NAME', 'rtsp_overlay_manager')

from app.routes import overlay_routes, stream_routes

app.register_blueprint(overlay_routes.bp)
app.register_blueprint(stream_routes.bp)
