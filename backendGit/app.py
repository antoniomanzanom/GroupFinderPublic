from resources.group import GroupCreation
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from blacklist import BLACKLIST
from models import RoleModel
from resources.user import UserRegister, UserLogin, UserLogout,UserActivate, TokenRefresh,UserSendRequest,User,UserUpdateBattletag
from resources.character import CharacterRegister,CharactersOfUser,CharactersOfGroup,CharactersQueue
from resources.admin import Admin
from resources.group import GroupCreation,GroupById,AddToGroup,DeleteOfGroup,AllGroups,DeleteOfQueue,DeleteGroup

# FLASK
app = Flask(__name__)

# CONFIGURACIÓN DE LA APLICACIÓN
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@db:5432/groupfinder'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.secret_key = '1234567890987654321'
CORS(app)
# FLASK_RESTFUL
api = Api(app)
    
@app.before_first_request
def create_tables_and_roles():
    # Crea las tablas de la BD e inserta los dos roles en la tabla Roles
    db.create_all()

    #Insert de los dos roles existentes. TODO: Hacer un seeder más eficiente
    try:
        admin = RoleModel("admin")
        user = RoleModel("user")
        
        db.session.add(admin)
        db.session.add(user)
        db.session.commit()
    except:
        db.session.rollback()
        pass


# FLASK JWT EXTENDED
jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(decrypted_token, jwt_load):
    # Busca el token en el set() BLACKLIST
    return jwt_load['jti'] in BLACKLIST


# RESOURCES

# Auth Resources
api.add_resource(UserRegister, '/user/register')
api.add_resource(UserLogin, '/user/login')
api.add_resource(UserLogout, '/user/logout')
api.add_resource(UserActivate, '/user/activate/<string:token>')
api.add_resource(TokenRefresh, '/refresh')  # Genera un nuevo token de acceso

# Character Resources
api.add_resource(CharacterRegister, '/character/register/<int:user_id>')
api.add_resource(CharactersOfUser, '/characters/<int:user_id>')
api.add_resource(CharactersOfGroup,'/characters/group/<int:group_id>')
api.add_resource(CharactersQueue,'/characters/queue/<int:group_id>')

#Admin Resources
api.add_resource(Admin, '/admin/<int:admin_id>')

#Group Resources
api.add_resource(GroupCreation, '/group/creation/<int:user_id>')
api.add_resource(GroupById,'/group/<int:group_id>')
api.add_resource(AddToGroup,'/group/user/<int:user_id>')
api.add_resource(DeleteOfGroup,'/group/user/<int:user_id>')
api.add_resource(AllGroups,'/groups')
api.add_resource(DeleteOfQueue,'/group/queue/user/<int:user_id>')
api.add_resource(DeleteGroup,'/group/<int:group_id>')

#User Resources
api.add_resource(UserSendRequest,'/group/<int:group_id>/request/<int:user_id>')
api.add_resource(User,'/user/<int:user_id>')
api.add_resource(UserUpdateBattletag,'/user/battletag/<int:user_id>')

if __name__ == '__main__':
    from db import db
    db.init_app(app)
    app.run(port=5000, debug=True,host='0.0.0.0')
