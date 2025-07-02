# Updated src/api/routes.py - Debug version

"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Customer, WorkOrder
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, decode_token
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# user routes
@api.route('/user/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({"msg": "no such user"}), 404
    if user.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": "owner"} 
    )
    return jsonify(access_token=access_token), 201


# customer routes
@api.route('/customer/signup', methods=['POST'])
def handle_customer_signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    address = request.json.get("address", None)
    phone = request.json.get("phone", None)
    if email is None or password is None or first_name is None or last_name is None or address is None or phone is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    customer = Customer(email=email, password=password, first_name=first_name, last_name=last_name, address=address, phone=phone, is_active=True)
    db.session.add(customer)
    db.session.commit()
    db.session.refresh(customer)
    response_body = {"msg": "Account succesfully created!", "customer":customer.serialize()}
    return jsonify(response_body), 201

@api.route('/customer/login', methods=['POST'])
def handle_customer_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer is None:
        return jsonify({"msg": "No such user"}), 404
    if customer.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    # Debug: print the secret key being used (use current_app instead of app)
    print(f"JWT Secret Key: {current_app.config.get('JWT_SECRET_KEY')}")
    
    access_token = create_access_token(
        identity=str(customer.id),
        additional_claims={"role": "customer"}
    )
    
    # Debug: print the token
    print(f"Created token: {access_token[:50]}...")

    return jsonify(access_token=access_token, customer_id=customer.id), 201


# Work Order routes
@api.route('/work-orders', methods=['GET'])
@jwt_required()
def get_work_orders():
    current_customer_id = int(get_jwt_identity())
    
    work_orders = WorkOrder.query.filter_by(customer_id=current_customer_id).all()
    
    return jsonify({
        "work_orders": [order.serialize() for order in work_orders]
    }), 200


@api.route('/work-order', methods=['POST'])
@jwt_required()
def create_work_order():
    print(f"JWT Secret Key in work-order: {current_app.config.get('JWT_SECRET_KEY')}")
    
    try:
        current_customer_id = int(get_jwt_identity())
        print(f"Successfully decoded customer ID: {current_customer_id}")
        
        # Get the data from request
        make = request.json.get("make", None)
        model = request.json.get("model", None)
        year = request.json.get("year", None)
        color = request.json.get("color", None)
        vin = request.json.get("vin", None)
        license_plate = request.json.get("license_plate", None)
        est_completion = request.json.get("est_completion", None)
        
        # Basic validation
        if not all([make, model, year, color, vin, license_plate, est_completion]):
            return jsonify({"msg": "All fields are required"}), 400
        
        # You'll need to assign a user_id (mechanic/technician)
        # For now, let's just use the first user in the system or create a default one
        user = User.query.first()
        if not user:
            # Create a default user if none exists
            user = User(
                email="default@mechanic.com",
                password="123456",
                is_active=True,
                first_name="Default",
                last_name="Mechanic"
            )
            db.session.add(user)
            db.session.commit()
            db.session.refresh(user)
        
        # Convert est_completion from string to date
        try:
            est_completion_date = datetime.strptime(est_completion, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Create the work order
        work_order = WorkOrder(
            user_id=user.id,
            customer_id=current_customer_id,
            make=make,
            model=model,
            year=year,
            color=color,
            vin=vin,
            license_plate=license_plate,
            est_completion=est_completion_date,
            current_stage="Car Accepted"
        )
        
        db.session.add(work_order)
        db.session.commit()
        db.session.refresh(work_order)
        
        return jsonify({
            "msg": "Work order created successfully!",
            "work_order": work_order.serialize()
        }), 201
        
    except Exception as e:
        print(f"Error in work-order endpoint: {str(e)}")
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/work-order/<int:work_order_id>', methods=['PUT'])
@jwt_required()
def update_work_order_stage(work_order_id):
    current_customer_id = int(get_jwt_identity())
    
    work_order = WorkOrder.query.filter_by(
        id=work_order_id, 
        customer_id=current_customer_id
    ).first()
    
    if not work_order:
        return jsonify({"msg": "Work order not found"}), 404
    
    new_stage = request.json.get("current_stage", None)
    if not new_stage:
        return jsonify({"msg": "Stage is required"}), 400
    
    work_order.current_stage = new_stage
    db.session.commit()
    
    return jsonify({
        "msg": "Work order updated successfully!",
        "work_order": work_order.serialize()
    }), 200