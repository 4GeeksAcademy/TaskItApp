  
import os
from flask_admin import Admin
from .models import db, User, Task, Category, Address, Requester, TaskSeeker, Rating, Postulant, Notification, Chat, AdminUser, ChatMessage
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Task, db.session))
    admin.add_view(ModelView(Category, db.session))
    admin.add_view(ModelView(Address, db.session))
    admin.add_view(ModelView(Requester, db.session))
    admin.add_view(ModelView(TaskSeeker, db.session))
    admin.add_view(ModelView(Rating, db.session))
    admin.add_view(ModelView(Postulant, db.session))
    admin.add_view(ModelView(Notification, db.session))
    admin.add_view(ModelView(Chat, db.session))
    admin.add_view(ModelView(ChatMessage, db.session))
    admin.add_view(ModelView(AdminUser, db.session))
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))