"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task, StatusEnum
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify([task.serialize() for task in Task.query.all()]), 200


@api.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    title = data.get('title')
    description = data.get("description")
    delivery_location = data.get('delivery_location')
    pickup_location = data.get('pickup_location')
    due_date_str = data.get('due_date')

    if not title or not description or not delivery_location or not pickup_location or not due_date_str:
        return jsonify({ 'error': 'Missing fields.'}), 400
    
    try:
        due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid due_date format"}), 400
    
    new_task = Task(title=title, description=description, delivery_location=delivery_location, pickup_location=pickup_location, due_date=due_date)
    
    db.session.add(new_task)
    db.session.commit()

    return jsonify({'message': 'Task posted successfully.'}), 201


@api.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get(id)

    if not task: return jsonify({'error': 'Task not found.'}), 404

    return jsonify(task.serialize()), 200


@api.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)

    if not task: return jsonify({'error': 'Task not found.'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task deleted successfully.'}), 200


@api.route('/tasks/<int:id>', methods=['PUT'])
def edit_task(id):  
    task = Task.query.get(id)

    if not task: return jsonify({'error': 'Task not found.'}), 404

    data = request.json
    new_title = data.get('title')
    new_description = data.get("description")
    new_delivery_location = data.get('delivery_location')
    new_pickup_location = data.get('pickup_location')
    new_due_date_str = data.get('due_date')
    new_status = data.get('status')

    if new_due_date_str:
        try:
            new_due_date = datetime.strptime(new_due_date_str, '%d/%m/%Y')
            task.due_date = new_due_date
        except ValueError:
            return jsonify({"error": "Invalid due_date format."}), 400
        
    if new_status:
        try:
            new_status_enum = StatusEnum(new_status)
            task.status = new_status_enum
        except ValueError:
            return jsonify({"error": "Invalid status value."}), 400

    if new_title: task.title = new_title
    if new_description: task.description = new_description
    if new_delivery_location: task.delivery_location = new_delivery_location
    if new_pickup_location: task.pickup_location = new_pickup_location

    db.session.commit()

    return jsonify({'message': 'Task edited successfully.'}), 200

