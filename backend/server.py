from flask import Flask, request, jsonify, session, render_template
from extensions import db, bcrypt, ma, cors
from models import User, user_schema, users_schema

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Flask extensions
db.init_app(app)
bcrypt.init_app(app)
ma.init_app(app)
cors.init_app(app)

# ================ USER ================ #

# REGISTER #
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'message': 'User already exists'}), 400

    # Create new user
    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    session['user_id'] = new_user.id  # Log them in!

    return user_schema.jsonify(new_user), 201


# LOGIN #
@app.route('/login', methods=['POST'])
def login():    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        return user_schema.jsonify(user), 200
    return jsonify({'message': 'Invalid username or password'}), 401


# LOGOUT #
@app.route('/logout', methods=['POST'])
def logout():    
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'}), 200  


# CHECK SESSION #
@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return user_schema.jsonify(user), 200
    return jsonify({'message': 'Not logged in'}), 401

# ================ COMMAND CENTER ================ #

@app.route('/command-center')
def command_center():
    return render_template('command_center.html')

# HEALTH CHECK #
@app.route('/command/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'connected',
        'users_count': User.query.count()
    }), 200

# WHO'S LOGGED IN #
@app.route('/command/sessions', methods=['GET'])
def check_sessions():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return jsonify({
            'logged_in': True,
            'user': user_schema.dump(user)
        }), 200
    return jsonify({'logged_in': False}), 200

# SHOW ALL USERS #
@app.route('/command/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify({
        'count': len(users),
        'users': users_schema.dump(users)
    }), 200

# NUKE DB #
@app.route('/command/nuke', methods=['POST'])
def nuke_database():
    db.drop_all()
    return jsonify({'message': 'Database nuked!'}), 200

# RESET DB #
@app.route('/command/reset', methods=['POST'])
def reset_database():
    db.drop_all()
    db.create_all()
    return jsonify({'message': 'Database reset!'}), 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5555)