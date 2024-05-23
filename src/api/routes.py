"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Address
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


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