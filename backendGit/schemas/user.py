from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from models.user import UserModel


# ESQUEMA PARA SERIALIZAR EL MODELO USER
class UserSchema(SQLAlchemySchema):
    class Meta:
        model = UserModel

    id = auto_field()
    username = auto_field()
    email = auto_field()
    group_id = auto_field()
    current_character= auto_field()
    role_type = auto_field()
    status = auto_field()
    liderDeGrupo = auto_field()
    email_confirmed = auto_field()