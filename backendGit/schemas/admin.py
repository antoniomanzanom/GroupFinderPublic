from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from models.admin import AdminModel

# ESQUEMA PARA SERIALIZAR EL MODELO LOVER
class AdminSchema(SQLAlchemySchema):
    class Meta:
        model = AdminModel

    id = auto_field()
    username = auto_field()
    password = auto_field()
    email = auto_field()
    role_type = auto_field()