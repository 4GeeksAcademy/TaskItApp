"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import cloudinary
import cloudinary.uploader

from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Task, StatusEnum, Address, Category, RoleEnum, Requester, TaskSeeker, Rating, Postulant, Notification, Chat, ChatMessage, AdminUser
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)



# Allow CORS requests to this API
CORS(api)

# TASKS BELOW
@api.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.filter(Task.status.notin_([StatusEnum.CANCELLED, StatusEnum.COMPLETED, StatusEnum.IN_PROGRESS])).all()
    return jsonify([task.serialize() for task in tasks]), 200

@api.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    title = data.get('title')
    description = data.get("description")
    delivery_location = data.get('delivery_location')
    delivery_lat = data.get('delivery_lat')
    delivery_lgt = data.get('delivery_lgt')
    pickup_location = data.get('pickup_location')
    pickup_lat = data.get('pickup_lat')
    pickup_lgt = data.get('pickup_lgt')
    due_date_str = data.get('due_date')
    requester_id = data.get('requester_id')
    category_id = data.get('category_id')
    budget = data.get('budget')

    if not all([title, description, due_date_str, requester_id, category_id, budget, delivery_location, delivery_lat, delivery_lgt, pickup_location, pickup_lat, pickup_lgt]):
            return jsonify({'error': 'Missing fields.'}), 400
    
    existing_requester = Requester.query.filter_by(user_id=requester_id).first()
    if not existing_requester: return jsonify({ 'error': 'Requester with given user ID not found.'}), 404

    existing_category = Category.query.get(category_id)
    if not existing_category: return jsonify({ 'error': 'Category not found.'}), 404
    
    try:
        due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid due date format"}), 400
    
    existing_delivery = Address.query.filter_by(address=delivery_location).first()
    if existing_delivery: delivery_address = existing_delivery
    else: 
        delivery_address = Address(address=delivery_location, latitude=delivery_lat, longitude=delivery_lgt)
        db.session.add(delivery_address)

    existing_pickup = Address.query.filter_by(address=pickup_location).first()
    if existing_pickup: pickup_address = existing_pickup
    else: 
        pickup_address = Address(address=pickup_location, latitude=pickup_lat, longitude=pickup_lgt)
        db.session.add(pickup_address)

    db.session.commit()
    
    new_task = Task(title=title, description=description, delivery_address=delivery_address, pickup_address=pickup_address, due_date=due_date, requester=existing_requester, category=existing_category, budget=budget)    
    
    existing_requester.total_requested_tasks += 1
    existing_requester.total_open_tasks += 1
    existing_requester.average_budget = (existing_requester.average_budget * (existing_requester.total_requested_tasks - 1) + float(budget)) / existing_requester.total_requested_tasks

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

    task.requester.total_open_tasks -= 1
    if task.seeker: task.seeker.total_ongoing_tasks -= 1

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
    new_category_id = data.get('category_id')
    new_seeker_id = data.get('seeker_id')
    new_budget = data.get('budget')

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
            if task.status == StatusEnum.CANCELLED or task.status == StatusEnum.COMPLETED:
                chat = Chat.query.filter_by(task_id=task.id).first()
                if chat: chat.archived = True
                if task.status == StatusEnum.COMPLETED and task.seeker:
                    task.seeker.total_completed_tasks += 1
                if task.seeker: task.seeker.total_ongoing_tasks -= 1
                task.requester.total_open_tasks -= 1
        except ValueError:
            return jsonify({"error": "Invalid status value."}), 400

    if new_category_id:
        existing_category = Category.query.get(new_category_id)
        if not existing_category:
            return jsonify({'error': 'Category not found.'}), 404
        task.category = existing_category

    if new_seeker_id:
        existing_seeker = TaskSeeker.query.get(new_seeker_id)
        if not existing_seeker:
            return jsonify({'error': 'Task seeker not found.'}), 404
        task.seeker = existing_seeker
        task.seeker.total_ongoing_tasks += 1

    if new_title: task.title = new_title
    if new_description: task.description = new_description

    if new_delivery_location:
        existing_delivery = Address.query.filter_by(address=new_delivery_location).first()
        if existing_delivery: task.delivery_location = existing_delivery
        else: 
            delivery_address = Address(address=new_delivery_location, latitude=data.get('delivery_lat'), longitude=data.get('delivery_lgt'))
            db.session.add(delivery_address)
            db.session.commit()
            task.delivery_location_id = delivery_address.id

    if new_pickup_location:
        existing_pickup = Address.query.filter_by(address=new_pickup_location).first()
        if existing_pickup: task.pickup_location = existing_pickup
        else:
            pickup_address = Address(address=new_pickup_location, latitude=data.get('pickup_lat'), longitude=data.get('pickup_lgt'))
            db.session.add(pickup_address)
            db.session.commit()
            task.pickup_location_id = pickup_address.id

    if new_budget:
        total_requested_tasks = task.requester.total_requested_tasks
        current_avg_budget = task.requester.average_budget
        current_budget = float(task.budget)
        
        new_total_budget = (current_avg_budget * total_requested_tasks) - current_budget + float(new_budget)
        task.requester.average_budget = new_total_budget / total_requested_tasks
        task.budget = new_budget

    db.session.commit()

    return jsonify({'message': 'Task edited successfully.'}), 200

# ADDRESSES
@api.route('/addresses', methods=['GET'])
def get_addresses():
    all_addresses = Address.query.all()
    results = list(map(lambda address: address.serialize(), all_addresses))

    return jsonify(results), 200

@api.route('/addresses/<int:address_id>', methods=['GET'])
def get_address(address_id):
    address = Address.query.filter_by(id=address_id).first()
    return jsonify(address.serialize()), 200


@api.route('/addresses', methods=['POST'])
def create_address():
    data = request.json
    address = data.get('address')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    user_id = data.get('user_id')    

    if not address or not latitude or not longitude or not user_id:
        return jsonify({"error": "Missing fields."}), 400
    
    existing_user = User.query.get(user_id)
    if not existing_user:  return jsonify({"error": "User not found."}), 404
    
    address = Address(address=address, longitude=longitude, latitude=latitude, user=existing_user)
    
    db.session.add(address)
    db.session.commit()

    return jsonify({"message": "Address saved."}), 200

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

@api.route('/categories/<string:name>', methods=['GET'])
def get_category_by_name(name):
    category = Category.query.filter_by(name=name).first()
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
    
    if not username or not email or not password:
        return jsonify({ 'error': 'Missing fields.'}), 400
    
    existing_email = User.query.filter_by(email=email).first()
    existing_username = User.query.filter_by(username=username).first()
    if existing_email and existing_username: return jsonify({ 'error': 'Email and username already in use.'}), 400
    if existing_username: return jsonify({ 'error': 'Username already in use.'}), 400
    if existing_email: return jsonify({ 'error': 'Email already in use.'}), 400

    new_user = User(username=username, email=email, password=password)
    
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
    new_description = data.get('description')
        
    if new_role_str:
        try:
            new_role = RoleEnum(new_role_str)
            if new_role != user.role:
                if user.requester:
                    user.requester.archive()
                if user.task_seeker:
                    user.task_seeker.archive()
                
                if new_role == RoleEnum.REQUESTER or new_role == RoleEnum.BOTH:
                    requester = Requester(user=user)
                    db.session.add(requester)
                if new_role == RoleEnum.TASK_SEEKER or new_role == RoleEnum.BOTH:
                    task_seeker = TaskSeeker(user=user)
                    db.session.add(task_seeker)
                
                user.role = new_role
        except ValueError:
            return jsonify({"error": "Invalid role value."}), 400

    if new_username: user.username = new_username
    if new_email: user.email = new_email
    if new_password: user.password = new_password
    if new_full_name: user.full_name = new_full_name
    if new_description: user.description = new_description

    db.session.commit()

    return jsonify({'message': 'User edited successfully.'}), 200

# REQUESTERS
@api.route('/requesters', methods=['GET'])
def get_requesters():
    return jsonify([requester.serialize() for requester in Requester.query.all()]), 200

@api.route('/requesters/user_id/<int:id>', methods=['GET'])
def get_requester_by_username(id):
    requester = Requester.query.filter_by(user_id=id).first()

    if not requester: return jsonify({'error': 'Requester not found.'}), 404

    return jsonify(requester.serialize()), 200

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

@api.route('/task-seekers/user_id/<int:id>', methods=['GET'])
def get_seeker_by_username(id):
    seeker = TaskSeeker.query.filter_by(user_id=id).first()

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

# ratings

@api.route('/ratings', methods=['POST'])
def add_rating():
    data = request.json
    stars = data.get('stars')
    seeker_id = data.get('seeker_id')
    requester_id = data.get('requester_id')
    task_id = data.get('task_id')
    review = data.get('review')

    if not all([stars, task_id]) or (not seeker_id and not requester_id) or (seeker_id and requester_id):
        return jsonify({'error': 'Missing fields.'}), 400

    if stars < 1 or stars > 5:
        return jsonify({'error': 'Stars must be between 1 and 5'}), 400
    
    seeker = None
    requester = None

    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task with given ID does not exist'}), 400

    if seeker_id:
        seeker = User.query.get(seeker_id)
        if not seeker:
            return jsonify({'error': 'Seeker with given ID does not exist'}), 400
        existing_rating = Rating.query.filter_by(seeker_id=seeker_id, task_id=task_id).first()
        if existing_rating:
            return jsonify({'error': 'You have already rated this user for this task.'}), 400

    if requester_id:
        requester = User.query.get(requester_id)
        if not requester:
            return jsonify({'error': 'Requester with given ID does not exist'}), 400
        existing_rating = Rating.query.filter_by(requester_id=requester_id, task_id=task_id).first()
        if existing_rating:
            return jsonify({'error': 'You have already rated this user for this task.'}), 400

    new_rating = Rating(stars=stars, seeker_id=seeker_id, requester_id=requester_id, task_id=task_id, review=review)

    if seeker:
        seeker.task_seeker.total_reviews += 1
        seeker.task_seeker.overall_rating = (seeker.task_seeker.overall_rating * (seeker.task_seeker.total_reviews - 1) + int(stars)) / seeker.task_seeker.total_reviews

    if requester:
        requester.requester.total_reviews += 1
        requester.requester.overall_rating = (requester.requester.overall_rating * (requester.requester.total_reviews - 1) + int(stars)) / requester.requester.total_reviews

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": "User rated successfully."}), 201

@api.route('/ratings', methods=['GET'])
def get_ratings():
    ratings = Rating.query.all()
    return jsonify([rating.serialize() for rating in ratings]), 200

@api.route('/ratings/<int:rating_id>', methods=['GET'])
def get_rating(rating_id):
    rating = Rating.query.get(rating_id)
    if rating is None:
        return jsonify({'error': 'Rating not found'}), 404
    return jsonify(rating.serialize()), 200

@api.route('/ratings/<int:rating_id>', methods=['PUT'])
def update_rating(rating_id):
    rating = Rating.query.get(rating_id)
    if not rating:
        return jsonify({'error': 'Rating not found'}), 404

    data = request.json
    stars = data.get('stars')
    review = data.get('review')

    if stars:
        rating.stars = stars

    if review: rating.review = review
    
    db.session.commit()
    return jsonify({'message': 'Rating updated successfully'}), 200

@api.route('/ratings/<int:rating_id>', methods=['DELETE'])
def delete_rating(rating_id):
    rating = Rating.query.get(rating_id)
    if not rating:
        return jsonify({'error': 'Rating not found'}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({'message': 'Rating deleted successfully'}), 200


# POSTULANT

@api.route('/postulants', methods=['GET'])
def get_postulants():
    all_postulants = Postulant.query.all()
    print(all_postulants)
    results = list(map(lambda postulant: postulant.serialize(), all_postulants))
    print(results)


    return jsonify(results), 200


@api.route('/postulants/<int:postulant_id>', methods=['GET'])
def get_postulant(postulant_id):
    postulant = Postulant.query.filter_by(id=postulant_id).first()
    if not postulant:
        return jsonify({'error': 'Postulant not found'}), 404
    return jsonify(postulant.serialize()), 200


@api.route('/postulants', methods=['POST'])
def create_postulant():
    data = request.json
    status = "applied"
    seeker_id = data.get('seeker_id')
    price=data.get('price')
    task_id = data.get('task_id')

    if not seeker_id or not price: 
        return jsonify({ 'error': 'Missing fields.'}), 400
    
    existing_seeker = TaskSeeker.query.get(seeker_id)
    if not existing_seeker: return jsonify({ 'error': 'Task seeker with given user ID not found.'}), 404

    existing_task = Task.query.get(task_id)
    if not existing_task: return jsonify({ 'error': 'Task ID not found.'}), 404

    if existing_task.requester.user.id == existing_seeker.user.id:
        return jsonify({ 'error': "You can't apply to your own task." }), 400
    
    postul = Postulant(status=status, seeker=existing_seeker, price=price, task=existing_task)
    db.session.add(postul)
    db.session.commit()

    return jsonify({"message": "Applied successfully."}), 200

@api.route('/postulants/<int:id>', methods=['PUT'])
def update_postulant(id):
    postulant = Postulant.query.get(id)
    if postulant is None:
        return jsonify({"error": "Postulant not found"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    for key in data:
        if hasattr(postulant, key):
            setattr(postulant, key, data[key])

    db.session.commit()
    return jsonify({"message": "Postulant successfully updated"}), 200

@api.route('/postulants/<int:id>', methods=['DELETE'])
def delete_postulant(id):
    postulant = Postulant.query.get(id)

    if not postulant:
        return jsonify({'error': 'Postulant not found.'}), 404

    db.session.delete(postulant)
    db.session.commit()

    return jsonify({'message': 'Postulant deleted successfully.'}), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({'error': 'Invalid username or password.'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.serialize()), 200

@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify(valid=False), 404
    return jsonify(valid=True, user=user.serialize()), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'User logged out successfully.'}), 200

@api.route('/users/<int:index>/tasks', methods=['GET'])
def get_user_tasks(index):
    requester = Requester.query.filter_by(user_id=index).first()
    if not requester:
        return jsonify({"error": "Requester not found"}), 404

    tasks = Task.query.filter(
        Task.requester_id == requester.id,
        Task.status.notin_([StatusEnum.CANCELLED, StatusEnum.COMPLETED])
    ).all()
    return jsonify([task.serialize() for task in tasks]), 200

@api.route('/users/<int:index>/applied-to-tasks', methods=['GET'])
def get_applied_to_tasks(index):
    seeker = TaskSeeker.query.filter_by(user_id=index).first()
    if not seeker:
        return jsonify({"error": "Task seeker not found."}), 404
    
    tasks = Task.query.filter(
        Task.status.notin_([StatusEnum.CANCELLED, StatusEnum.COMPLETED])
    ).all()

    postulants = Postulant.query.filter(
        Postulant.seeker_id == seeker.id,
        Postulant.task_id.in_([task.id for task in tasks])
    ).all()

    applied_tasks = [postulant.task.serialize() for postulant in postulants]
    
    return jsonify(applied_tasks)

@api.route('/users/<int:index>/seeker/completed-tasks', methods=['GET'])
def get_seeker_completed_tasks(index):
    seeker = TaskSeeker.query.filter_by(user_id=index).first()
    if not seeker:
        return jsonify({"error": "Task seeker not found."}), 404
    
    completed_tasks = Task.query.filter(
        Task.seeker_id == seeker.id,
        Task.status.in_([StatusEnum.COMPLETED])
    ).all()

    return jsonify([task.serialize() for task in completed_tasks]), 200

@api.route('/users/<int:index>/requester/completed-tasks', methods=['GET'])
def get_requester_completed_tasks(index):
    requester = Requester.query.filter_by(user_id=index).first()
    if not requester:
        return jsonify({"error": "Requester not found."}), 404
    
    completed_tasks = Task.query.filter(
        Task.requester_id == requester.id,
        Task.status.in_([StatusEnum.COMPLETED])
    ).all()

    return jsonify([task.serialize() for task in completed_tasks]), 200

@api.route('/users/<int:index>/unseen-notifications', methods=['GET'])
def get_unseen_notifications(index):
    existing_user = User.query.get(index)
    if not existing_user: return jsonify({"error": "User does not exist."}), 404

    unseen_notifications = Notification.query.filter_by(user_id=index, seen=False).all()
    return jsonify([notification.serialize() for notification in unseen_notifications]), 200

@api.route('/notifications/<int:index>', methods=['PUT'])
def mark_as_seen(index):
    notification = Notification.query.get(index)
    if not notification: return jsonify({"error": "Notification not found."})
    notification.seen = True
    db.session.commit()
    return jsonify({"message": "Notification marked as seen successfully."}), 200

@api.route('/upload', methods=['POST'])
def upload_image():
    user_id = request.form.get('user_id')
    file_to_upload = request.files['file']
    if file_to_upload:
        upload_result = cloudinary.uploader.upload(file_to_upload)
        user = User.query.get(user_id)
        user.profile_picture = upload_result['url']
        db.session.commit()
        return jsonify({"message": "Image uploaded successfully", "url": upload_result['url']}), 200
    return jsonify({"error": "No file provided"}), 400

@api.route('users/<int:id>/chats', methods=['GET'])
def get_user_chats(id):
    chats = Chat.query.filter(
        ((Chat.requester_user_id == id) | (Chat.seeker_user_id == id)) &
        (Chat.archived == False)
    ).all()
    return jsonify([chat.serialize() for chat in chats]), 200

@api.route('/chats/<int:id>/messages', methods=['POST'])
def create_message(id):
    data = request.get_json()
    message = data.get('message')
    sender_id = data.get('sender_id')
    
    if not message or not sender_id:
        return jsonify({'error': 'Missing fields.'}), 400
    
    existing_sender = User.query.get(sender_id)
    if not existing_sender: return jsonify({'error': 'Sender with given user id not found.'}), 404

    existing_chat = Chat.query.get(id)
    if not existing_chat: return jsonify({'error': 'Chat with given id not found.'}), 404
    
    message = ChatMessage(chat_id=id, sender_user_id=sender_id, message=message)

    db.session.add(message)
    db.session.commit()
    
    return jsonify({'message': 'Message sent successfully.'}), 200

@api.route('/chats/<int:id>/messages', methods=['GET'])
def get_messages(id):
    existing_chat = Chat.query.get(id);
    if not existing_chat: return jsonify({'error': 'Chat does not exist.'}), 404
    return jsonify([message.serialize() for message in existing_chat.messages]), 200

@api.route('/users/<int:user_id>/chats/<int:chat_id>', methods=['GET'])
def has_unseen_messages(user_id, chat_id):
    existing_chat = Chat.query.get(chat_id);
    if not existing_chat: return jsonify({'error': 'Chat does not exist.'}), 404

    existing_user = User.query.get(user_id)
    if not existing_user: return jsonify({"error": "User does not exist."}), 404

    try:
        unseen_messages_count = ChatMessage.query.filter_by(chat_id=chat_id, seen=False).filter(ChatMessage.sender_user_id != user_id).count()
        return jsonify({"has_unseen_messages": bool(unseen_messages_count > 0)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# AdminUser CRUD Routes
@api.route('/admin-users', methods=['GET'])
def get_admin_users():
    admin_users = AdminUser.query.all()
    return jsonify([admin_user.serialize() for admin_user in admin_users]), 200

# Get a single admin user by ID
@api.route('/admin-users/<int:id>', methods=['GET'])
def get_admin_user(id):
    admin_user = AdminUser.query.get(id)
    if not admin_user:
        return jsonify({'error': 'AdminUser not found.'}), 404
    return jsonify(admin_user.serialize()), 200

# Create a new admin user
@api.route('/admin-users', methods=['POST'])
def create_admin_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password.'}), 400

    if AdminUser.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already used.'}), 400

    new_admin_user = AdminUser(email=email, password=password)
    db.session.add(new_admin_user)
    db.session.commit()

    return jsonify(new_admin_user.serialize()), 201

# Update an admin user
@api.route('/admin-users/<int:id>', methods=['PUT'])
def update_admin_user(id):
    admin_user = AdminUser.query.get(id)
    if not admin_user:
        return jsonify({'error': 'AdminUser not found.'}), 404

    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email:
        if AdminUser.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already used.'}), 400
        admin_user.email = email

    if password:
        admin_user.password = password

    db.session.commit()
    return jsonify(admin_user.serialize()), 200

# Delete an admin user
@api.route('/admin-users/<int:id>', methods=['DELETE'])
def delete_admin_user(id):
    admin_user = AdminUser.query.get(id)
    if not admin_user:
        return jsonify({'error': 'AdminUser not found.'}), 404

    db.session.delete(admin_user)
    db.session.commit()

    return jsonify({'message': 'AdminUser deleted successfully.'}), 200

@api.route('/admin/signup', methods=['POST'])
def admin_signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing fields.'}), 400

    existing_admin = AdminUser.query.filter_by(email=email).first()
    if existing_admin:
        return jsonify({'error': 'Email already used.'}), 400

    new_admin = AdminUser(email=email, password=password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({'message': 'Admin created successfully.'}), 201

@api.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin or admin.password != password:
        return jsonify({'error': 'Invalid email or password.'}), 401

    access_token = create_access_token(identity=admin.id)
    return jsonify(access_token=access_token, admin=admin.serialize()), 200

@api.route('/admin/validate-token', methods=['GET'])
@jwt_required()
def admin_validate_token():
    current_admin_id = get_jwt_identity()
    admin = AdminUser.query.get(current_admin_id)
    if not admin:
        return jsonify(valid=False), 404
    return jsonify(valid=True, admin=admin.serialize()), 200

@api.route('/admin/logout', methods=['POST'])
@jwt_required()
def admin_logout():
    # El cierre de sesión en JWT es manejado en el cliente, por lo tanto, aquí simplemente retornamos un mensaje.
    return jsonify({'message': 'Admin logged out successfully.'}), 200

@api.route('/users/<int:id>/reviews', methods=['GET'])
def get_last_three_reviews(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    reviews = []
    serialized_reviews = []

    if user.requester and not user.task_seeker:
        reviews = Rating.query.filter(Rating.requester_id == user.requester.id).order_by(Rating.id.desc()).limit(3).all()  
        serialized_reviews = [review.serialize() for review in reviews]
        return jsonify(serialized_reviews), 200

    if user.task_seeker and not user.requester:
        reviews = Rating.query.filter(Rating.seeker_id == user.task_seeker.id).order_by(Rating.id.desc()).limit(3).all()  
        serialized_reviews = [review.serialize() for review in reviews]
        return jsonify(serialized_reviews), 200
    
    reviews = Rating.query.filter((Rating.seeker_id == user.task_seeker.id) | (Rating.requester_id == user.requester.id)).order_by(Rating.id.desc()).limit(3).all()  

    serialized_reviews = [review.serialize() for review in reviews]
    return jsonify(serialized_reviews), 200

@api.route('/users/<int:id>/requester-reviews', methods=['GET'])
def get_last_three_requester_reviews(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    reviews = Rating.query.filter_by(requester_id=user.requester.id).order_by(Rating.id.desc()).limit(3).all()

    serialized_reviews = [review.serialize() for review in reviews]

    return jsonify(serialized_reviews), 200
