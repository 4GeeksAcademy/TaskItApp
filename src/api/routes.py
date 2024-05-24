"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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





