"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task, StatusEnum, Address, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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
        return jsonify({"error": "Invalid due date format"}), 400
    
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
            new_due_date = datetime.strptime(new_due_date_str, '%Y-%m-%d')
            task.due_date = new_due_date
        except ValueError:
            return jsonify({"error": "Invalid due date format."}), 400
        
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



@api.route('/addresses', methods=['GET'])
def get_addresses():
    all_addresses = Address.query.all()
    print(all_addresses)
    results = list(map(lambda address: address.serialize(), all_addresses))
    print(results)


    return jsonify(results), 200



@api.route('/addresses/<int:address_id>', methods=['GET'])
def get_address(address_id):
    address = Address.query.filter_by(id=address_id).first()
    return jsonify(address.serialize()), 200


@api.route('/addresses', methods=['POST'])
def create_address():
    data = request.json
    if not "address" in data:
        return jsonify({"message": "You must enter an address"}), 400
    if data["address"] == "":
        return jsonify({"message": "The address cannot be empty"}), 400
    # Create new street
    addre = Address(**data)
    db.session.add(addre)
    db.session.commit()

    response_body = {
        "message": "Address created"
    }

    return jsonify(response_body), 200
@api.route('/addresses/<int:id>', methods=['DELETE'])
def delete_address(id):
    # Buscar la direccion por su ID en la base de datos
    address = Address.query.get(id)

    # Si no se encuentra la dirección, devuelve un error 404
    if address is None:
        return jsonify({"error": "address not found"}), 404

    # Eliminar dirección de la base de datos
    db.session.delete(address)
    db.session.commit()

    # Devolver una respuesta exitosa
    return jsonify({"message": "Address successfully deleted"}), 200

@api.route('/addresses/<int:id>', methods=['PUT'])
def update_address(id):
    address = Address.query.get(id)
    if address is None:
        return jsonify({"error": "Address not found"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "address" in data and data["address"] == "":
        return jsonify({"message": "The address cannot be empty"}), 400

    # Update address fields
    for key in data:
        if hasattr(address, key):
            setattr(address, key, data[key])

    db.session.commit()
    return jsonify({"message": "Address successfully updated"}), 200

@api.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    name = data.get('name')
    
    if not name:
        return jsonify({'error': 'Name is required.'}), 400
    
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({'message': 'Category created successfully'}), 201

@api.route('/categories/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    return jsonify({'category': category.serialize()}), 200

@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify({'categories': [category.serialize() for category in categories]}), 200

@api.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    name = data.get('name')
    
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    category.name = name
    db.session.commit()
    
    return jsonify({'message': 'Category updated successfully'}), 200

@api.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 200

