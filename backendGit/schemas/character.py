from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from models.character import CharacterModel


# ESQUEMA PARA SERIALIZAR EL MODELO CHARACTER
class CharacterSchema(SQLAlchemySchema):
    class Meta:
        model = CharacterModel

    id = auto_field()
    name = auto_field()
    realm = auto_field()
    clase = auto_field()
    elo = auto_field()
    rol = auto_field()
    img_url = auto_field()
    spec = auto_field()
    profile_url = auto_field()


