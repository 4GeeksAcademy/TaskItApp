"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task, StatusEnum, Address, Category, RoleEnum, Requester, TaskSeeker
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# TASKS BELOW
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

# ADDRESSES
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

# CATEGORIES
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

# USERS
@api.route('/users', methods=['GET'])
def get_users():
    return jsonify([user.serialize() for user in User.query.all()]), 200


@api.route('/users', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    email = data.get("email")
    password = data.get('password')
    full_name = data.get('full_name')
    
    if not username or not email or not password or not full_name:
        return jsonify({ 'error': 'Missing fields.'}), 400
    
    existing_email = User.query.filter_by(email=email).first()
    if existing_email: return jsonify({ 'error': 'Email already used.'}), 400

    new_user = User(username=username, email=email, password=password, full_name=full_name)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.'}), 201


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)

    if not user: return jsonify({'error': 'User not found.'}), 404

    return jsonify(user.serialize()), 200

@api.route('/users/<string:username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()

    if not user: return jsonify({'error': 'User not found.'}), 404

    return jsonify(user.serialize()), 200


@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)

    if not user: return jsonify({'error': 'User not found.'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully.'}), 200


@api.route('/users/<int:id>', methods=['PUT'])
def edit_user(id):  
    user = User.query.get(id)

    if not user: return jsonify({'error': 'User not found.'}), 404

    data = request.json
    new_username = data.get('username')
    new_email = data.get("email")
    new_password = data.get('password')
    new_full_name = data.get('full_name')
    new_role_str = data.get('role')
        
    if new_role_str:
        try:
            new_role = RoleEnum(new_role_str)
            user.role = new_role
        except ValueError:
            return jsonify({"error": "Invalid role value."}), 400

    if new_username: user.username = new_username
    if new_email: user.email = new_email
    if new_password: user.password = new_password
    if new_full_name: user.full_name = new_full_name

    db.session.commit()

    return jsonify({'message': 'User edited successfully.'}), 200

# REQUESTERS
@api.route('/requesters', methods=['GET'])
def get_requesters():
    return jsonify([requester.serialize() for requester in Requester.query.all()]), 200


@api.route('/requesters', methods=['POST'])
def add_requester():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({ 'error': 'Missing user id.'}), 400
    
    existing_user = User.query.get(user_id)
    if not existing_user: return jsonify({ 'error': 'User not found.'}), 404

    if existing_user.role == RoleEnum.REQUESTER or existing_user.role == RoleEnum.BOTH:
        return jsonify({'error': 'User already has requester role.'}), 400

    new_requester = Requester(user=existing_user)
    if existing_user.role == RoleEnum.NONE: existing_user.role = RoleEnum.REQUESTER
    else: existing_user.role = RoleEnum.BOTH

    db.session.add(new_requester)
    db.session.commit()

    return jsonify({'message': 'Requester role successfully added to user.'}), 201


@api.route('/requesters/<int:id>', methods=['GET'])
def get_requester(id):
    requester = Requester.query.get(id)

    if not requester: return jsonify({'error': 'Requester not found.'}), 404

    return jsonify(requester.serialize()), 200


@api.route('/requesters/<int:id>', methods=['DELETE'])
def delete_requester(id):
    requester = Requester.query.get(id)

    if not requester: return jsonify({'error': 'Requester not found.'}), 404
    
    user = User.query.get(requester.user_id)
    if user.role == RoleEnum.REQUESTER: user.role = RoleEnum.NONE
    else: user.role = RoleEnum.TASK_SEEKER

    db.session.delete(requester)
    db.session.commit()

    return jsonify({'message': 'Removed requester role successfully.'}), 200


@api.route('/requesters/<int:id>', methods=['PUT'])
def edit_requester(id):  
    requester = Requester.query.get(id)

    if not requester: return jsonify({'error': 'Requester not found.'}), 404

    data = request.json
    new_overall_rating = data.get("overall_rating")
    new_total_requested_tasks = data.get("total_requested_tasks")
    new_total_reviews = data.get("total_reviews")
    new_average_budget = data.get("average_budget")

    if new_overall_rating: requester.overall_rating = new_overall_rating
    if new_total_requested_tasks: requester.total_requested_tasks = new_total_requested_tasks
    if new_total_reviews: requester.total_reviews = new_total_reviews
    if new_average_budget: requester.average_budget = new_average_budget

    db.session.commit()

    return jsonify({'message': 'Requested info edited successfully.'}), 200

# TASK SEEKERS
@api.route('/task-seekers', methods=['GET'])
def get_seekers():
    return jsonify([seeker.serialize() for seeker in TaskSeeker.query.all()]), 200


@api.route('/task-seekers', methods=['POST'])
def add_seeker():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({ 'error': 'Missing user id.'}), 400
    
    existing_user = User.query.get(user_id)
    if not existing_user: return jsonify({ 'error': 'User not found.'}), 404

    if existing_user.role == RoleEnum.TASK_SEEKER or existing_user.role == RoleEnum.BOTH:
        return jsonify({'error': 'User already has requester role.'}), 400

    new_seeker = TaskSeeker(user=existing_user)
    if existing_user.role == RoleEnum.NONE: existing_user.role = RoleEnum.TASK_SEEKER
    else: existing_user.role = RoleEnum.BOTH

    db.session.add(new_seeker)
    db.session.commit()

    return jsonify({'message': 'Task seeker role successfully added to user.'}), 201


@api.route('/task-seekers/<int:id>', methods=['GET'])
def get_seeker(id):
    seeker = TaskSeeker.query.get(id)

    if not seeker: return jsonify({'error': 'Seeker not found.'}), 404

    return jsonify(seeker.serialize()), 200


@api.route('/task-seekers/<int:id>', methods=['DELETE'])
def delete_seeker(id):
    seeker = TaskSeeker.query.get(id)

    if not seeker: return jsonify({'error': 'Seeker not found.'}), 404
    
    user = User.query.get(seeker.user_id)
    if user.role == RoleEnum.TASK_SEEKER: user.role = RoleEnum.NONE
    else: user.role = RoleEnum.REQUESTER

    db.session.delete(seeker)
    db.session.commit()

    return jsonify({'message': 'Removed seeker role successfully.'}), 200


@api.route('/task-seekers/<int:id>', methods=['PUT'])
def edit_seeker(id):  
    seeker = TaskSeeker.query.get(id)

    if not seeker: return jsonify({'error': 'Seeker not found.'}), 404

    data = request.json
    new_overall_rating = data.get("overall_rating")
    new_total_requested_tasks = data.get("total_requested_tasks")
    new_total_reviews = data.get("total_reviews")

    if new_overall_rating: seeker.overall_rating = new_overall_rating
    if new_total_requested_tasks: seeker.total_requested_tasks = new_total_requested_tasks
    if new_total_reviews: seeker.total_reviews = new_total_reviews

    db.session.commit()

    return jsonify({'message': 'Seeker info edited successfully.'}), 200