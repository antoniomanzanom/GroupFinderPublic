from flask_restful import Resource, reqparse

from utils import generate_token_email, verify_token_email, EmailConfirmationService

# Model imports
from models.user import UserModel
from models.role import RoleModel
from models.admin import AdminModel
from models.character import CharacterModel
# Schemas import
from schemas.user import UserSchema
from schemas.admin import AdminSchema
from schemas.character import CharacterSchema

import requests
import json

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
    create_refresh_token
)
from blacklist import BLACKLIST

#REGISTER DE CHARACTER USANDO DATOS DE RAIDER.IO
_characterAPI_register_parser = reqparse.RequestParser()
_characterAPI_register_parser.add_argument('name',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_characterAPI_register_parser.add_argument('realm',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )

class CharacterRegister(Resource):
    def post(self,user_id):
        #Datos del personaje introducidos por el usuario
        data = _characterAPI_register_parser.parse_args()
        
        #Petición a Raider.io para recoger los datos del personaje en cuestión
        response = requests.get("https://raider.io/api/v1/characters/profile?region=eu&realm="+data['realm']+"&name="+data['name']+"&fields=mythic_plus_scores_by_season%3Acurrent")       
        if response.status_code==400:
            return {"message":"Character not found"},400
        response = response.json()
        
        #Creación del modelo de nuestro personaje
        character = CharacterModel(response['name'],response['realm'],response['class'],response["mythic_plus_scores_by_season"][0]["scores"]["all"],response['active_spec_role'],user_id,response["thumbnail_url"],response["active_spec_name"],response["profile_url"])

        #Comprobamos que el personaje no esta ya en nuestra base de datos
        if CharacterModel.find_by_name(name=data['name'].capitalize()):
            return {"message": "This character alreadys exists"}, 400
        
        #Guardamos en la base de datos el personaje
        try:
            character_schema = CharacterSchema()
            character_json = character_schema.dump(character)
            character.save_to_db()
            return character_json

        except:
            return {"message": "An error occurred creating the character."}, 500

class CharactersOfUser(Resource):
    def get(self,user_id):
        
        characterlist=[]
        characters = CharacterModel.query.filter_by(user_id=user_id).all()
        
        for character in characters:
            characterlist.append(character.json())

        return {"characters": characterlist}

class CharactersOfGroup(Resource):
    def get(self,group_id):
        
        characterList=[]
        try:
            users = UserModel.query.filter_by(group_id=group_id,status="ACCEPTED").all()
            
            for user in users:
                character= CharacterModel.query.filter_by(name=user.json()['current_character']).first()
                characterJSON= character.json()
                characterJSON["battletag"]=user.json()['battletag']
                characterList.append(characterJSON)
        except:
            return{"message":"Error finding user or characters"}

        return {"characters":characterList}

class CharactersQueue(Resource):
    def get(self,group_id):
        
        characterList=[]
        try:
            users = UserModel.query.filter_by(group_id=group_id,status='PENDING').all()

            for user in users:
                
                character = CharacterModel.query.filter_by(name=user.json()['current_character']).first()

                characterJSON= character.json()
                
                characterJSON["battletag"]=user.json()['battletag']
                characterList.append(characterJSON)
        except:
            return{"message":"Error finding user or characters"}

        return {"characters":characterList}