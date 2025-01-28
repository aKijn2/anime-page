from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
from database import db, User, AnimeList

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db/anime_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Jikan API base URL
JIKAN_API_URL = "https://api.jikan.moe/v4"

# Create tables
with app.app_context():
    db.create_all()

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Login a user
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username, password=password).first()

    if user:
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

# Search anime using Jikan API
@app.route('/search', methods=['GET'])
def search_anime():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    response = requests.get(f"{JIKAN_API_URL}/anime?q={query}")
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({"error": "Failed to fetch data from Jikan API"}), 500

# Add anime to a user's list
@app.route('/add-to-list', methods=['POST'])
def add_to_list():
    data = request.json
    user_id = data.get('user_id')
    title = data.get('title')
    status = data.get('status')

    if not user_id or not title or not status:
        return jsonify({"error": "Missing required fields"}), 400

    new_entry = AnimeList(user_id=user_id, title=title, status=status)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Anime added to list"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)