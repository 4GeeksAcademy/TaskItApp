from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from enum import Enum

db = SQLAlchemy()

class RoleEnum(Enum):
    TASK_SEEKER = "task_seeker"
    REQUESTER = "requester"
    BOTH = "both"
    NONE = "none"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    full_name = db.Column(db.String(120), unique=False, nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=True, default=RoleEnum.NONE)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role.value
        }
    
class Requester(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User')
    overall_rating = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_reviews = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_requested_tasks = db.Column(db.Integer, unique=False, nullable=True, default=0)
    average_budget = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_open_tasks = db.Column(db.Integer, unique=False, nullable=True, default=0)

    def __repr__(self):
        return f'<Requester {self.user.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "user_id": self.user_id,
            "overall_rating": self.overall_rating,
            "total_reviews": self.total_reviews,
            "total_requested_tasks": self.total_requested_tasks,
            "average_budget": self.average_budget,
            "total_open_tasks": self.total_open_tasks
        }
    
class TaskSeeker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User')
    overall_rating = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_reviews = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_completed_tasks = db.Column(db.Integer, unique=False, nullable=True, default=0)
    total_ongoing_tasks = db.Column(db.Integer, unique=False, nullable=True, default=0)

    def __repr__(self):
        return f'<Requester {self.user.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "user_id": self.user_id,
            "overall_rating": self.overall_rating,
            "total_reviews": self.total_reviews,
            "total_completed_tasks": self.total_completed_tasks,
            "total_ongoing_tasks": self.total_ongoing_tasks
        }
    
class StatusEnum(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(500), unique=False, nullable=False)
    creation_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum(StatusEnum), nullable=False, default=StatusEnum.PENDING)
    delivery_location = db.Column(db.String(120), nullable=False)
    pickup_location = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Task {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "creation_date": self.creation_date.isoformat(),
            "due_date": self.due_date.isoformat(),
            "status": self.status.value,
            "delivery_location": self.delivery_location,
            "pickup_location": self.pickup_location
        }

    
class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(120), unique=True, nullable=False)
    latitude = db.Column(db.Float, unique=False, nullable=False)
    longitude = db.Column(db.Float, unique=False, nullable=False)

    def __repr__(self):
        return f'<Address {self.address}>'

    def serialize(self):
        return {
            "id": self.id,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }
    
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<User %r {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    
