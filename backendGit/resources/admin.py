from flask_restful import Resource, reqparse

from utils import generate_token_email, verify_token_email, EmailConfirmationService

# Model imports
from models.user import UserModel
from models.role import RoleModel
from models.admin import AdminModel
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

class Admin(Resource):
    @jwt_required()
    def get(self, admin_id):
        admin = AdminModel.find_by_id(admin_id)
        if not Admin:
            return {'message': 'User not found'}, 404
        return admin.json()

    @jwt_required()
    def delete(self, admin_id):
        admin = AdminModel.find_by_id(admin_id)
        if not admin:
            return {'message': 'User not found'}, 404
        admin.delete_from_db()
        return {'message': 'User Deleted'}, 200

