from db import db


class CharacterModel(db.Model):
    __tablename__ = 'characters'

    # Atributos del Usuario
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    realm = db.Column(db.String(100), unique=False)
    clase = db.Column(db.String(100), unique=False)
    elo = db.Column(db.String(100), unique=False)
    rol = db.Column(db.String(100), unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    img_url = db.Column(db.String(500), unique=False)
    spec = db.Column(db.String(50), unique=False)
    profile_url = db.Column(db.String(200), unique=False)

    def __init__(self, name,realm,clase,elo,rol,user_id,img_url,spec,profile_url):
        self.name = name
        self.realm = realm
        self.clase = clase
        self.elo = elo
        self.rol = rol
        self.user_id = user_id
        self.img_url = img_url
        self.spec = spec
        self.profile_url = profile_url

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'realm': self.realm,
            'rol': self.rol,
            'clase': self.clase,
            'elo':self.elo,
            'user_id':self.user_id,
            'img_url':self.img_url,
            'spec':self.spec,
            'profile_url':self.profile_url
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
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()




