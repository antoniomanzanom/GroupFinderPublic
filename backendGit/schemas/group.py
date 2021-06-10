from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from models.group import GroupModel


# ESQUEMA PARA SERIALIZAR EL MODELO CHARACTER
class GroupSchema(SQLAlchemySchema):
    class Meta:
        model = GroupModel

    id = auto_field()
    name = auto_field()
    descripcion = auto_field()
    privado = auto_field()
    mazmorra = auto_field()
    dificultad = auto_field()
    roles = auto_field()

 