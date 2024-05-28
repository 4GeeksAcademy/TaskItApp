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
    description = db.Column(db.String(500), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role.value,
            "description": self.description,
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
        return f'<Seeker {self.user.username}>'

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
    requester_id = db.Column(db.Integer, db.ForeignKey('requester.id'), nullable=False)
    requester = db.relationship('Requester', backref=db.backref('tasks', lazy=True))
    seeker_id = db.Column(db.Integer, db.ForeignKey('task_seeker.id'), nullable=True)
    seeker = db.relationship('TaskSeeker', backref=db.backref('tasks', lazy=True))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category', backref=db.backref('tasks', lazy=True))

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
            "pickup_location": self.pickup_location,
            "seeker_id": self.seeker_id if self.seeker else None,
            "requester_id": self.requester_id,
            "category_id": self.category_id,
            "category_name": self.category.name
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
    

class Rating(db.Model):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key=True)
    stars = db.Column(db.Integer, nullable=False)
    seeker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    
    # Relationships
    seeker = db.relationship('User', foreign_keys=[seeker_id], backref=db.backref('seeker_ratings', lazy=True))
    requester = db.relationship('User', foreign_keys=[requester_id], backref=db.backref('requester_ratings', lazy=True))
    task = db.relationship('Task', foreign_keys=[task_id], backref=db.backref('task_ratings', lazy=True))

    def __repr__(self):
        return f'<Rating id={self.id}, stars={self.stars}>'

    def serialize(self):
        return {
            "id": self.id,
            "stars": self.stars,
            "seeker_id": self.seeker_id,
            "requester_id": self.requester_id,
            "task_id": self.task_id,
            "seeker_username": self.seeker.username if self.seeker else None,  
            "requester_username": self.requester.username if self.requester else None,
            "task_description": self.task.description if self.task else None   
        }
    
class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<AdminUser {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }


