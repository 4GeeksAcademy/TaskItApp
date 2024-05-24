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
    nombre = data.get('nombre')
    
    if not nombre:
        return jsonify({'error': 'Nombre is required'}), 400
    
    new_category = Category(nombre=nombre)
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({'message': 'Category created successfully', 'category': new_category.serialize()}), 201

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
    nombre = data.get('nombre')
    
    if not nombre:
        return jsonify({'error': 'Nombre is required'}), 400
    
    category.nombre = nombre
    db.session.commit()
    
    return jsonify({'message': 'Category updated successfully', 'category': category.serialize()}), 200

@api.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 204





