from flask import Flask, request, jsonify, session, render_template
from extensions import db, bcrypt, ma, cors
from models import User, user_schema, users_schema, Status, status_schema, statuses_schema, Artist, artist_schema, artists_schema, Track, track_schema, tracks_schema, Link, link_schema, links_schema, Tag, tag_schema, tags_schema

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Flask extensions
db.init_app(app)
bcrypt.init_app(app)
ma.init_app(app)
cors.init_app(app, supports_credentials=True, origins=['http://localhost:5555'])

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

    session['user_id'] = new_user.id

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


# ================ ARTISTS ================ #

# GET ALL ARTISTS #
@app.route('/artists', methods=['GET'])
def get_all_artists():
    artists = Artist.query.all()
    return artists_schema.jsonify(artists), 200

# GET ARTIST BY ID #
@app.route('/artists/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    artist = Artist.query.get(artist_id)
    return artist_schema.jsonify(artist), 200   

# CREATE ARTIST #
@app.route('/artists', methods=['POST'])
def create_artist():
    data = request.get_json()
    name = data.get('name')

    new_artist = Artist(name=name)
    db.session.add(new_artist)
    db.session.commit()

    return artist_schema.jsonify(new_artist), 201

# DELETE ARTIST #
@app.route('/artists/<int:artist_id>', methods=['DELETE'])
def delete_artist(artist_id):    
    artist = Artist.query.get_or_404(artist_id)
    db.session.delete(artist)
    db.session.commit()

    return jsonify({'message': 'Artist deleted'}), 200


# ================ TRACKS ================ #

# GET ALL TRACKS #
@app.route('/tracks', methods=['GET'])
def get_all_tracks():
    tracks = Track.query.all()
    return tracks_schema.jsonify(tracks), 200

# GET TRACK BY ID #
@app.route('/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    track = Track.query.get(track_id)
    return track_schema.jsonify(track), 200

# CREATE TRACK #
@app.route('/tracks', methods=['POST'])
def create_track():
    data = request.get_json()
    title = data.get('title')
    artist_id = data.get('artist_id')
    status_id = data.get('status_id')

    new_track = Track(title=title, artist_id=artist_id, status_id=status_id)
    db.session.add(new_track)
    db.session.commit()

    return track_schema.jsonify(new_track), 201

# UPDATE TRACK #
@app.route('/tracks/<int:track_id>', methods=['PATCH'])
def update_track(track_id):
    track = Track.query.get_or_404(track_id)
    data = request.get_json()
    
    if 'title' in data:
        track.title = data['title']
    if 'artist_id' in data:
        track.artist_id = data['artist_id']
    if 'status_id' in data:
        track.status_id = data['status_id']
    
    db.session.commit()
    return track_schema.jsonify(track), 200

# DELETE TRACK #
@app.route('/tracks/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    track = Track.query.get_or_404(track_id)
    db.session.delete(track)
    db.session.commit()
    
    return jsonify({'message': 'Track deleted'}), 200


# ================ LINKS ================ #

# GET ALL LINKS FOR A TRACK #
@app.route('/tracks/<int:track_id>/links', methods=['GET'])
def get_track_links(track_id):
    links = Link.query.filter_by(track_id=track_id).all()
    return links_schema.jsonify(links), 200

# CREATE A LINK FOR A TRACK #
@app.route('/tracks/<int:track_id>/links', methods=['POST'])
def create_link(track_id):
    data = request.get_json()
    link_type = data.get('link_type')
    link_url = data.get('link_url')
    
    new_link = Link(track_id=track_id, link_type=link_type, link_url=link_url)
    db.session.add(new_link)
    db.session.commit()
    
    return link_schema.jsonify(new_link), 201

# DELETE A LINK #
@app.route('/links/<int:link_id>', methods=['DELETE'])
def delete_link(link_id):
    link = Link.query.get_or_404(link_id)
    db.session.delete(link)
    db.session.commit()
    
    return jsonify({'message': 'Link deleted'}), 200


# ================ TAGS ================ #

# GET ALL TAGS #
@app.route('/tags', methods=['GET'])
def get_all_tags():
    tags = Tag.query.all()
    return tags_schema.jsonify(tags), 200

# CREATE A TAG #
@app.route('/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    name = data.get('name')
    
    new_tag = Tag(name=name)
    db.session.add(new_tag)
    db.session.commit()
    
    return tag_schema.jsonify(new_tag), 201

# ADD TAG TO TRACK #
@app.route('/tracks/<int:track_id>/tags/<int:tag_id>', methods=['POST'])
def add_tag_to_track(track_id, tag_id):
    track = Track.query.get_or_404(track_id)
    tag = Tag.query.get_or_404(tag_id)
    
    track.tags.append(tag)
    db.session.commit()
    
    return track_schema.jsonify(track), 200

# REMOVE TAG FROM TRACK #
@app.route('/tracks/<int:track_id>/tags/<int:tag_id>', methods=['DELETE'])
def remove_tag_from_track(track_id, tag_id):
    track = Track.query.get_or_404(track_id)
    tag = Tag.query.get_or_404(tag_id)
    
    track.tags.remove(tag)
    db.session.commit()
    
    return track_schema.jsonify(track), 200


# ================ COMMAND CENTER ================ #

# DISPLAY #
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

# SHOW ALL DATA #
@app.route('/command/data', methods=['GET'])
def show_all_data():
    users = User.query.all()
    statuses = Status.query.all()
    artists = Artist.query.all()
    tracks = Track.query.all()
    links = Link.query.all()
    tags = Tag.query.all()
    
    return jsonify({
        'users': users_schema.dump(users),
        'statuses': statuses_schema.dump(statuses),
        'artists': artists_schema.dump(artists),
        'tracks': tracks_schema.dump(tracks),
        'links': links_schema.dump(links),
        'tags': tags_schema.dump(tags)
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

# SEED DATABASE #
@app.route('/command/seed', methods=['POST'])
def seed_database():
    # Create statuses
    demo = Status(name='Demo')
    in_progress = Status(name='In Progress')
    completed = Status(name='Completed')
    released = Status(name='Released')
    
    db.session.add_all([demo, in_progress, completed, released])
    
    # Create sample artist
    artist = Artist(name='Beautifuls Dream')
    db.session.add(artist)
    
    # Create sample tags
    pop = Tag(name='Pop')
    electronic = Tag(name='Electronic')
    remix = Tag(name='Remix')
    acoustic = Tag(name='Acoustic')
    
    db.session.add_all([pop, electronic, remix, acoustic])
    
    db.session.commit()
    
    return jsonify({'message': 'Database seeded with statuses, artist, and tags!'}), 200


# CONTEXT RUN #
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5555)