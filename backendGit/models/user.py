from db import db
from werkzeug.security import generate_password_hash,check_password_hash

class UserModel(db.Model):
    __tablename__ = 'users'

    # Atributos del Usuario
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    battletag = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    idioma = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(200), nullable=False)
    current_character = db.Column(db.String(200), nullable=True,default="")
    email_confirmed = db.Column(db.Boolean(80), nullable=True, default=False)
    liderDeGrupo = db.Column(db.Boolean(), nullable=True,default=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete="cascade"))
    personajes = db.relationship('CharacterModel', backref='user')
    role_type = db.Column(db.String(20), db.ForeignKey('roles.role_type'), nullable=False)
    role = db.relationship('RoleModel')
    status = db.Column(db.String(200), nullable=True,default="")

    def __init__(self, username,battletag, password, email, role_type):
        self.username = username
        self.battletag = battletag
        
        
        self.password = generate_password_hash(password) 
        self.email = email
        self.role_type = role_type

    def json(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role_type,
            'battletag': self.battletag,
            'liderDeGrupo':self.liderDeGrupo,
            'group_id':self.group_id,
            'current_character':self.current_character,
            'status':self.status,
            'email_confirmed':self.email_confirmed,
        }

    # Métodos definidos para el ORM SQLAlchemy
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()





