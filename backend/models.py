from extensions import db, bcrypt, ma


# ================ USER ================ #

# MODEL #
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# SCHEMA #
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


# ================ STATUS ================ #

# MODEL #
class Status(db.Model):
    __tablename__ = 'status'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    
    def __init__(self, name):
        self.name = name


# SCHEMA #
class StatusSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Status
        load_instance = True

status_schema = StatusSchema()
statuses_schema = StatusSchema(many=True)


# ================ ARTIST ================ #

# MODEL #
class Artist(db.Model):
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    
    def __init__(self, name):
        self.name = name

# SCHEMA #
class ArtistSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Artist
        load_instance = True

artist_schema = ArtistSchema()
artists_schema = ArtistSchema(many=True)


# ================ TRACK ================ #

# MODEL #
class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    # Relationships
    artist = db.relationship('Artist', backref='tracks')
    status = db.relationship('Status', backref='tracks')
    
    def __init__(self, title, artist_id, status_id):
        self.title = title
        self.artist_id = artist_id
        self.status_id = status_id

# SCHEMA #
class TrackSchema(ma.SQLAlchemyAutoSchema):
    artist = ma.Nested(ArtistSchema)
    status = ma.Nested(StatusSchema)
    
    class Meta:
        model = Track
        load_instance = True
        include_fk = True

track_schema = TrackSchema()
tracks_schema = TrackSchema(many=True)