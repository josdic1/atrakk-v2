from extensions import db, bcrypt, ma

################# MODELS #################

# ================ USER ================ #
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


# ================ STATUS ================ #
class Status(db.Model):
    __tablename__ = 'status'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    
    def __init__(self, name):
        self.name = name


# ================ ARTIST ================ #
class Artist(db.Model):
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    
    def __init__(self, name):
        self.name = name


# ================ ASSOCIATION TABLE ================ #
track_tags = db.Table('track_tags',
    db.Column('track_id', db.Integer, db.ForeignKey('tracks.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=db.func.now())
)


# ================ TRACK ================ #
class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    artist = db.relationship('Artist', backref='tracks')
    status = db.relationship('Status', backref='tracks')
    tags = db.relationship('Tag', secondary=track_tags, back_populates='tracks')
    
    def __init__(self, title, artist_id, status_id):
        self.title = title
        self.artist_id = artist_id
        self.status_id = status_id


# ================ LINK ================ #
class Link(db.Model):
    __tablename__ = 'links'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    link_type = db.Column(db.String(50), nullable=False)
    link_url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    track = db.relationship('Track', backref='links')
    
    def __init__(self, track_id, link_type, link_url):
        self.track_id = track_id
        self.link_type = link_type
        self.link_url = link_url


# ================ TAG ================ #
class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    tracks = db.relationship('Track', secondary=track_tags, back_populates='tags')
    
    def __init__(self, name):
        self.name = name


################# SCHEMAS #################

# ============ USER ============ #
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


# ============ STATUS ============ #
class StatusSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Status
        load_instance = True

status_schema = StatusSchema()
statuses_schema = StatusSchema(many=True)


# ============ ARTIST ============ #
class ArtistSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Artist
        load_instance = True

artist_schema = ArtistSchema()
artists_schema = ArtistSchema(many=True)


# ============ LINK ============ #
class LinkSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Link
        load_instance = True
        include_fk = True

link_schema = LinkSchema()
links_schema = LinkSchema(many=True)


# ============ TAG ============ #
class TagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        load_instance = True

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)


# ============ TRACK ============ #
class TrackSchema(ma.SQLAlchemyAutoSchema):
    artist = ma.Nested(ArtistSchema)
    status = ma.Nested(StatusSchema)
    links = ma.Nested(LinkSchema, many=True)
    tags = ma.Nested(TagSchema, many=True)
    
    class Meta:
        model = Track
        load_instance = True
        include_fk = True

track_schema = TrackSchema()
tracks_schema = TrackSchema(many=True)