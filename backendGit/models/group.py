from db import db

class GroupModel(db.Model):
    __tablename__ = 'groups'

    # Atributos del Usuario
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    descripcion =db.Column(db.String(100), nullable=False)
    privado = db.Column(db.Boolean(), nullable=True)
    mazmorra = db.Column(db.String(100), nullable=False)
    dificultad = db.Column(db.String(100), nullable=False)
    roles = db.Column(db.String(200), nullable=True)
    participantes = db.relationship('UserModel', backref='group', cascade="delete")

    def __init__(self, name,descripcion,mazmorra,dificultad):
        self.name = name
        self.descripcion = descripcion
        self.mazmorra = mazmorra
        self.dificultad = dificultad


    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'descripcion': self.descripcion,
            'mazmorra': self.mazmorra,
            'dificultad':self.dificultad,
            'roles':self.roles
        }

    # Métodos definidos para el ORM SQLAlchemy
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()


