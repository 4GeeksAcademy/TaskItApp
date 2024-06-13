"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os

import cloudinary
import cloudinary.uploader

from flask import Flask, request, jsonify, url_for, send_from_directory, render_template
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Notification, User, Chat, Task, ChatMessage
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Cambia esto a tu propia clave secreta
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

usernames = {}
typing_users = {}

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@socketio.on('connect')
def handle_connect():
    username = request.args.get('username')
    if username:
        usernames[request.sid] = username
        emit('online_users', {'users': list(usernames.values())}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    remove_user_from_typing()
    if request.sid in usernames:
        del usernames[request.sid]
        emit('online_users', {'users': list(usernames.values())}, broadcast=True)

@socketio.on('message')
def handle_message(data):
    msg = data.get('message', 'No message provided')
    user = data.get('username')
    room = data.get('room')
    unique_id = data.get('client_generated_id')
    send({'client_generated_id': unique_id, 'room_name': room, 'message': msg, 'username': user}, room=room)
    emit('unseen_message', {'room': room}, room=room)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    leave_room(room)

@app.route('/send_notification/<string:room_name>', methods=['POST'])
def send_notification_to_room(room_name):
    data = request.json
    notification = data.get('notification')
    send_notification(room_name, notification)

    existing_user = User.query.filter_by(username=room_name).first()
    if not existing_user: return jsonify({ "error": "User does not exist." }), 404

    new_notification = Notification(user=existing_user, message=notification)
    db.session.add(new_notification)
    db.session.commit()
    return "Notification sent to room: " + room_name

def send_notification(room_name, notification):
    emit('notification', {'message': notification}, room=room_name, namespace='/')


@app.route('/chats', methods=['POST'])
def create_chat():
    data = request.get_json()
    room_name = data.get('room_name')
    requester_id = data.get('requester_id')
    seeker_id = data.get('seeker_id')
    task_id = data.get('task_id')
    
    if not room_name or not requester_id or not seeker_id or not task_id:
        return jsonify({'error': 'Missing fields.'}), 400
    
    existing_requester = User.query.get(requester_id)
    if not existing_requester: return jsonify({'error': 'Requester with given user id not found.'}), 404

    existing_seeker = User.query.get(seeker_id)
    if not existing_seeker: return jsonify({'error': 'Task seeker with given user id not found.'}), 404

    existing_task = Task.query.get(task_id)
    if not existing_task: return jsonify({'error': 'Task with given id not found.'}), 404
    
    chat = Chat(room_name=room_name, requester_user_id=requester_id, seeker_user_id=seeker_id, task_id=task_id)
    db.session.add(chat)
    db.session.commit()

    socketio.emit('new_chat', { 'room_name': room_name }, room=room_name)
    socketio.emit('new_chat', { 'room_name': room_name }, room=room_name)
    
    return jsonify({'message': 'Chat created successfully.'}), 200

@socketio.on('new_chat')
def handle_new_chat(data):
    room_name = data['room_name']
    join_room(room_name)
    emit('new_chat', {'message': f"New chat room '{room_name}' created"}, room=room_name)

@socketio.on('mark_message_as_seen')
def handle_mark_message_as_seen(data):
    message_id = data['message_id']
    user_id = data['user_id']
    chat_message = ChatMessage.query.filter_by(client_generated_id=message_id).first()
    if chat_message and chat_message.sender_user_id != user_id and not chat_message.seen:
        chat_message.seen = True
        db.session.commit()
        emit('message_seen', {'message_id': message_id}, room=chat_message.chat.room_name)

@socketio.on('typing')
def handle_typing(data):
    user = data.get('username')
    room = data.get('room')
    if user and room:
        if room not in typing_users:
            typing_users[room] = []
        if user not in typing_users[room]:
            typing_users[room].append(user)
        emit_typing_users(room)

@socketio.on('stop_typing')
def handle_stop_typing(data):
    user = data.get('username')
    room = data.get('room')
    if user and room and room in typing_users and user in typing_users[room]:
        typing_users[room].remove(user)
        if not typing_users[room]:
            del typing_users[room]
        emit_typing_users(room)

def emit_typing_users(room):
    emit('typing_status', {'room': room, 'users': typing_users.get(room, [])}, room=room, broadcast=True)

def remove_user_from_typing():
    rooms_to_remove = []
    for room, users in typing_users.items():
        if request.sid in users:
            users.remove(request.sid)
            if not users:
                rooms_to_remove.append(room)
    for room in rooms_to_remove:
        del typing_users[room]

cloudinary.config(
    cloud_name = 'doojwu2m7',
    api_key = '768687592778116',
    api_secret = 'V9KzZojFHOzBBT6R8IBFObKZmYc'
)

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    socketio.run(app, host='0.0.0.0', port=PORT, debug=True)
