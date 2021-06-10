from db import db


class RoleModel(db.Model):
    __tablename__ = 'roles'

    ROLES = ["admin", "user"]

    # Atributos del Usuario
    id = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.String(80), unique=True)

    def __init__(self, role_type):
        self.role_type = role_type

    def json(self):
        return {
            'role_type': self.role_type
        }

    # Métodos definidos para el ORM SQLAlchemy
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_role_type(cls, role_type):
        return cls.query.filter_by(role_type=role_type).first()

