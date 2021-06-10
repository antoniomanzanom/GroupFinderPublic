from flask_restful import Resource, reqparse
from sqlalchemy.sql.elements import Null
from db import db
from utils import generate_token_email, verify_token_email, EmailConfirmationService

# Model imports
from models.user import UserModel
from models.role import RoleModel
from models.admin import AdminModel
from models.group import GroupModel
from models.character import CharacterModel
# Schemas import
from schemas.user import UserSchema
from schemas.admin import AdminSchema

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
    create_refresh_token
)
from blacklist import BLACKLIST

# REQUEST PARSER - Creación de grupo
_group_creation_parser = reqparse.RequestParser()
_group_creation_parser.add_argument('name',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_group_creation_parser.add_argument('descripcion',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_group_creation_parser.add_argument('dificultad',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_group_creation_parser.add_argument('mazmorra',
                                    type=str,
                                    required=True,
                                    help="This field cannot be blank."
)
_group_creation_parser.add_argument('character_name',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )

class GroupCreation(Resource):
    def post(self, user_id):
        
        data = _group_creation_parser.parse_args()
        group = GroupModel(data['name'],data['descripcion'],data['mazmorra'],data['dificultad'])
        user = UserModel.query.filter_by(id=user_id).first()
        
        if GroupModel.find_by_name(name=data['name']):
            return {"message": "Group with this name already exists"}, 400
            
        if not user:
            return {"message":"User not found"}
        
        
        if user.json()['group_id']!= None:
            return {"message":"User already has a group"}       
        
        try:

            group.save_to_db()
            groupQuery=GroupModel.query.filter_by(name=data['name']).first()
            personaje = CharacterModel.query.filter_by(name=data['character_name']).first()
            user.group_id = groupQuery.json()["id"]
            user.current_character = data['character_name']
            user.status = "ACCEPTED"
            groupQuery.roles = personaje.json()["rol"]
            user.liderDeGrupo = True
            db.session.commit()

            return { "message" : "Grupo creado correctamente","group_id":groupQuery.id},200
        
        except:
            return{"message":"Error BackConnection"}

class GroupById(Resource):
    def get(self,group_id):
        
        try:
            group = GroupModel.query.filter_by(id=group_id).first()
            return group.json(),200
        except:
            return {"message":"Error finding the group"},400

class AddToGroup(Resource):
    def post(self,user_id):
        
        user = UserModel.query.filter_by(id=user_id).first()
        try:
            group = GroupModel.query.filter_by(id=user.group_id).first()
            character = CharacterModel.query.filter_by(name=user.current_character).first()
            group.roles=group.roles+","+character.rol
            user.status="ACCEPTED"
            db.session.commit()
            return {"message":"User added to group correctly"},200
        except:
            return {"message":"Failed to add user to group"},400

class DeleteOfGroup(Resource):
    def delete(self,user_id):

        user = UserModel.query.filter_by(id=user_id).first()

        try:
            group = GroupModel.query.filter_by(id=user.group_id).first()
            character = CharacterModel.query.filter_by(name=user.json()['current_character']).first()
            listaroles=group.roles.split(",")
            if user.status=="ACCEPTED":
                if character.rol in listaroles:
                    listaroles.remove(character.rol)
                    newrol=','.join(listaroles)
                    group.roles=newrol
            user.status="DENIED"
            db.session.commit()
            return {"message":"User deleted from queue correctly"},200

        except:
            return {"message":"Failed to delete user from queue"},400

class DeleteOfQueue(Resource):
    def delete(self,user_id):

        user = UserModel.query.filter_by(id=user_id).first()

        try:
            user.status="DENIED"
            db.session.commit()
            return {"message":"User deleted from group correctly"},200

        except:
            return {"message":"Failed to delete user from group"},200

class AllGroups(Resource):
    def get(self):
        grupos = GroupModel.query.all()
        groupList=[]
        for grupo in grupos:
            grupoJSON= grupo.json()
            groupList.append(grupoJSON)
        
        return {"groups":groupList},200

class DeleteGroup(Resource):
    def delete(self,group_id):
        try:
            users=UserModel.query.filter_by(group_id=group_id).all()
            for user in users:
                user.group_id = None
                user.status = "DENIED"
            db.session.commit()

            GroupModel.query.filter_by(id=group_id).delete()
            db.session.commit()
            return {"message":"Group deleted correctly"},200
        except:
            return{"message":"Error deleting the group"},400
        
        
        
        
        

