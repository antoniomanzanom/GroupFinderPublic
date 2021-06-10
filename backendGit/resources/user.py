from flask_restful import Resource, reqparse
from db import db
from utils import generate_token_email, verify_token_email, EmailConfirmationService

# Model imports
from models.user import UserModel
from models.role import RoleModel
from models.admin import AdminModel
# Schemas import
from schemas.user import UserSchema
from schemas.admin import AdminSchema
from werkzeug.security import check_password_hash

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
    create_refresh_token
)
from blacklist import BLACKLIST

# REQUEST PARSER - REGISTRO DE USUARIO
_user_register_parser = reqparse.RequestParser()
_user_register_parser.add_argument('username',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_user_register_parser.add_argument('battletag',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_user_register_parser.add_argument('password',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )
_user_register_parser.add_argument('email',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )

_user_register_parser.add_argument('role_type',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )


# REQUEST PARSER - LOGIN DE USUARIO
_user_login_parser = reqparse.RequestParser()
_user_login_parser.add_argument('username',
                                type=str,
                                required=True,
                                help="This field cannot be blank."
                                )
_user_login_parser.add_argument('password',
                                type=str,
                                required=True,
                                help="This field cannot be blank."
                                )
#REQUEST PARSER- PETI DE GRUPO
_group_request_parser = reqparse.RequestParser()
_group_request_parser.add_argument('current_character',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )

#REQUEST PARSER - CAMBIO DE BATTLETAG
_user_battletag_ = reqparse.RequestParser()
_user_battletag_.add_argument('battletag',
                                   type=str,
                                   required=True,
                                   help="This field cannot be blank."
                                   )

class User(Resource):
    @jwt_required()
    def get(self, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        return user.json()

    @jwt_required()
    def delete(self, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        user.delete_from_db()
        return {'message': 'User Deleted'}, 200



class UserRegister(Resource):
    def post(self):
        data = _user_register_parser.parse_args()

        if data['role_type'] not in RoleModel.ROLES:
            return {"message": "This roles doesnt exists"}, 400

        if data['role_type'] == "user":
            user = UserModel(**data)
            if UserModel.find_by_username(username=data['username']) or AdminModel.find_by_username(username=data['username']):
                return {"message": "This username alreadys exists"}, 400

            if UserModel.find_by_email(email=data['email']) or AdminModel.find_by_email(email=data['email']) :
                return {"message": "This email alreadys exists"}, 400

            try:
                user.save_to_db()
            except:
                return {"message": "An error occurred creating the user."}, 500

            email_token_confirmation = generate_token_email(user.email, salt='activate')
            print(email_token_confirmation)

            email_confirmation_service = EmailConfirmationService(email_token_confirmation, user.email)
            email_confirmation_service.send_email_confirmation()

            return {"message": "User created successfully."}, 201

        
        if data['role_type'] == "admin":
            admin = AdminModel(**data)

            if AdminModel.find_by_username(username=data['username']) or UserModel.find_by_username(username=data['username']):
                return {"message": "This username alreadys exists"}, 400

            if AdminModel.find_by_email(email=data['email']) or UserModel.find_by_email(email=data['email']):
                return {"message": "This email alreadys exists"}, 400

            try:
                admin.save_to_db()
            except:
                return {"message": "An error occurred creating the user."}, 500

            email_token_confirmation = generate_token_email(admin.email, salt='activate')
            print(email_token_confirmation)

            email_confirmation_service = EmailConfirmationService(email_token_confirmation, admin.email)
            email_confirmation_service.send_email_confirmation()

            return {"message": "User created successfully."}, 201


class UserLogin(Resource):
    def post(self):
        data = _user_login_parser.parse_args()
        
        user = UserModel.find_by_username(data['username'])
        admin = AdminModel.find_by_username(data['username'])

        if user:

            user_schema = UserSchema()
            user_json = user_schema.dump(user)
            
            if user and (check_password_hash(user.password, data['password']) and user.email_confirmed):
            #if user and check_password_hash(user.password,data['password']):
                access_token = "Bearer " + create_access_token(identity=user.id, fresh=True,expires_delta=False)
                refresh_token = "Bearer " + create_refresh_token(user.id)
                return {'user': user_json, 'access_token': access_token, 'refresh_token': refresh_token}, 200
            else:
                return{"message":"Wrong credentials or activation needed"},400

        if admin:

            admin_schema = AdminSchema()
            admin_json = admin_schema.dump(admin)

            if admin and (admin.password == data['password']):
                access_token = "Bearer " + create_access_token(identity=admin.id, fresh=True)
                refresh_token = "Bearer " + create_refresh_token(admin.id)
                return {'user': admin_json, 'access_token': access_token, 'refresh_token': refresh_token}, 200

        return {'message': 'Wrong credentials!!!'}, 401


class UserActivate(Resource):
    def post(self, token):
        email = verify_token_email(token, max_age=1800, salt='activate')
        if email is False:
            return {'msg': 'invalid token or token expired'}, 400

        user = UserModel.find_by_email(email=email)
        admin = AdminModel.find_by_email(email=email)

        if user:
            user.email_confirmed = True
            user.save_to_db()
            return {'msg': 'User verificated correctly! User'}, 200

        if admin:
            admin.email_confirmed = True
            admin.save_to_db()
            return {'msg': 'User verificated correctly! ADMIN'}, 200

        if not user and not admin:
            return {'msg': 'user not found'}, 400




class UserLogout(Resource):
    @jwt_required()
    def post(self):
        # Añadimos token a la BLACKLIST para después comprobarlo en JWT decorator
        jti = get_jwt()['jti']
        BLACKLIST.add(jti)
        return {'message': 'Successfully logged out.'}, 200


class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = "Bearer " + create_access_token(identity=current_user, fresh=False)
        return {'new_access_token' : new_token}

class UserSendRequest(Resource):
    def post(self,user_id,group_id):
        data = _group_request_parser.parse_args()
        
        user = UserModel.query.filter_by(id=user_id).first()
        
        if user.status == "ACCEPTED":
            
            return{"message":"User already in a group"},400
        else:
            user.current_character = data['current_character']
            user.status="PENDING"
            user.liderDeGrupo=False
            user.group_id=group_id
            db.session.commit()
            
            return{"message":"Group request correctly send"},200

class UserUpdateBattletag(Resource):
    def put(self,user_id):
        
        data = _user_battletag_.parse_args()
        user = UserModel.query.filter_by(id=user_id).first()
        if user and data['battletag']!="":
            user.battletag = data['battletag']
            db.session.commit()
            return{"message":"Battletag changed succesfully"},200
        else:
            return{"User not found/battletag cant be blank"}