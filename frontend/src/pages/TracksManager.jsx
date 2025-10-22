import { useState, useEffect } from 'react';
import { Music, Plus, Tag, Link as LinkIcon, Trash2, ExternalLink, Music2, Video, Image, FileText, Globe } from 'lucide-react';

function TracksManager() {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tags, setTags] = useState([]);

  const [newTrack, setNewTrack] = useState({ title: '', artist_id: '', status_id: '' });
  const [showLinkForm, setShowLinkForm] = useState(null);
  const [newLink, setNewLink] = useState({ link_type: '', link_url: '' });
  
  const [newArtist, setNewArtist] = useState('');
  const [showArtistForm, setShowArtistForm] = useState(false);

  const [editingTrack, setEditingTrack] = useState(null);
const [editForm, setEditForm] = useState({ title: '', artist_id: '' });

const [newTag, setNewTag] = useState('');
const [showTagForm, setShowTagForm] = useState(false);


  useEffect(() => {
    fetchTracks();
    fetchArtists();
    fetchStatuses();
    fetchTags();
  }, []);

  const getLinkIcon = (linkType) => {
  const type = linkType.toLowerCase();
  if (type.includes('spotify') || type.includes('music') || type.includes('soundcloud')) {
    return <Music2 size={16} />;
  }
  if (type.includes('youtube') || type.includes('video')) {
    return <Video size={16} />;
  }
  if (type.includes('artwork') || type.includes('cover') || type.includes('image')) {
    return <Image size={16} />;
  }
  if (type.includes('lyrics') || type.includes('doc')) {
    return <FileText size={16} />;
  }
  return <Globe size={16} />;
};

  const fetchTracks = async () => {
    const res = await fetch('/api/tracks');
    const data = await res.json();
    setTracks(data);
  };

  const fetchArtists = async () => {
    const res = await fetch('/api/artists');
    const data = await res.json();
    setArtists(data);
  };

  const fetchStatuses = async () => {
    const res = await fetch('/api/command/data');
    const data = await res.json();
    setStatuses(data.statuses);
  };

  const fetchTags = async () => {
    const res = await fetch('/api/tags');
    const data = await res.json();
    setTags(data);
  };

  const createTrack = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrack)
    });
    
    if (res.ok) {
      setNewTrack({ title: '', artist_id: '', status_id: '' });
      fetchTracks();
    }
  };

  const addTagToTrack = async (trackId, tagId) => {
    const res = await fetch(`/api/tracks/${trackId}/tags/${tagId}`, {
      method: 'POST'
    });
    
    if (res.ok) {
      fetchTracks();
    }
  };

  const removeTagFromTrack = async (trackId, tagId) => {
    const res = await fetch(`/api/tracks/${trackId}/tags/${tagId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      fetchTracks();
    }
  };

  const addLinkToTrack = async (trackId) => {
    const res = await fetch(`/api/tracks/${trackId}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink)
    });
    
    if (res.ok) {
      setNewLink({ link_type: '', link_url: '' });
      setShowLinkForm(null);
      fetchTracks();
    }
  };

  const removeLink = async (linkId) => {
    const res = await fetch(`/api/links/${linkId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      fetchTracks();
    }
  };

  const createArtist = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newArtist })
    });
    
    if (res.ok) {
      setNewArtist('');
      setShowArtistForm(false);
      fetchArtists();
    }
  };

  const updateTrackStatus = async (trackId, statusId) => {
    const res = await fetch(`/api/tracks/${trackId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_id: statusId })
    });
    
    if (res.ok) {
      fetchTracks();
    }
  };

  const deleteTrack = async (trackId) => {
    if (confirm('Are you sure you want to delete this track?')) {
      const res = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchTracks();
      }
    }
  };


  const startEditTrack = (track) => {
  setEditingTrack(track.id);
  setEditForm({ title: track.title, artist_id: track.artist_id });
};

const updateTrack = async (trackId) => {
  const res = await fetch(`/api/tracks/${trackId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editForm)
  });
  
  if (res.ok) {
    setEditingTrack(null);
    fetchTracks();
  }
};

const cancelEdit = () => {
  setEditingTrack(null);
  setEditForm({ title: '', artist_id: '' });
};

const createTag = async (e) => {
  e.preventDefault();
  const res = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newTag })
  });
  
  if (res.ok) {
    setNewTag('');
    setShowTagForm(false);
    fetchTags();
  }
};

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Music size={32} />
        Tracks Manager
      </h1>

      {/* Create Artist Form */}
      {showArtistForm ? (
        <div style={{
          border: '2px solid #4a3f2a',
          padding: '20px',
          borderRadius: '8px',
          background: '#2c2416',
          marginBottom: '20px'
        }}>
          <h2>Create New Artist</h2>
          <form onSubmit={createArtist} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Artist Name"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', flex: 1 }}
              required
            />
            <button type="submit" style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#4a3f2a',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Create
            </button>
            <button type="button" onClick={() => setShowArtistForm(false)} style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <button onClick={() => setShowArtistForm(true)} style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: '#4a3f2a',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          + Create New Artist
        </button>
      )}

      {showTagForm ? (
  <div style={{
    border: '2px solid #4a3f2a',
    padding: '20px',
    borderRadius: '8px',
    background: '#2c2416',
    marginBottom: '20px'
  }}>
    <h2>Create New Tag</h2>
    <form onSubmit={createTag} style={{ display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Tag Name (e.g., Lofi, Trap, R&B)"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', flex: 1 }}
        required
      />
      <button type="submit" style={{
        padding: '10px 20px',
        fontSize: '16px',
        background: '#4a3f2a',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Create
      </button>
      <button type="button" onClick={() => setShowTagForm(false)} style={{
        padding: '10px 20px',
        fontSize: '16px',
        background: '#666',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Cancel
      </button>
    </form>
  </div>
) : (
  <button onClick={() => setShowTagForm(true)} style={{
    padding: '10px 20px',
    fontSize: '16px',
    background: '#4a3f2a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px'
  }}>
    + Create New Tag
  </button>
)}

      {/* Create Track Form */}
      <div style={{
        border: '2px solid #4a3f2a',
        padding: '20px',
        borderRadius: '8px',
        background: '#2c2416',
        marginBottom: '30px'
      }}>
        <h2>Create New Track</h2>
        <form onSubmit={createTrack} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Track Title"
            value={newTrack.title}
            onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          />
          
          <select
            value={newTrack.artist_id}
            onChange={(e) => setNewTrack({...newTrack, artist_id: e.target.value})}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          >
            <option value="">Select Artist</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
          </select>
          
          <select
            value={newTrack.status_id}
            onChange={(e) => setNewTrack({...newTrack, status_id: e.target.value})}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          >
            <option value="">Select Status</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          
          <button type="submit" style={{
            padding: '15px',
            fontSize: '16px',
            background: '#4a3f2a',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Create Track
          </button>
        </form>
      </div>

      {/* Track List */}
      <div style={{ marginTop: '30px' }}>
        <h2>All Tracks</h2>
        {tracks.length === 0 ? (
          <p>No tracks yet. Create one!</p>
        ) : (
          tracks.map(track => (
            <div key={track.id} style={{
              border: '2px solid #333',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  {editingTrack === track.id ? (
  <div style={{ marginBottom: '10px' }}>
    <input
      type="text"
      value={editForm.title}
      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
      style={{ 
        padding: '8px', 
        fontSize: '18px', 
        marginRight: '10px',
        width: '300px'
      }}
    />
    <select
      value={editForm.artist_id}
      onChange={(e) => setEditForm({...editForm, artist_id: e.target.value})}
      style={{ 
        padding: '8px', 
        fontSize: '16px',
        marginRight: '10px'
      }}
    >
      {artists.map(artist => (
        <option key={artist.id} value={artist.id}>{artist.name}</option>
      ))}
    </select>
    <button
      onClick={() => updateTrack(track.id)}
      style={{
        background: '#4a3f2a',
        color: '#fff',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px'
      }}
    >
      Save
    </button>
    <button
      onClick={cancelEdit}
      style={{
        background: '#666',
        color: '#fff',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Cancel
    </button>
  </div>
) : (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <h3>{track.title}</h3>
    <button
      onClick={() => startEditTrack(track)}
      style={{
        background: '#4a3f2a',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      Edit
    </button>
  </div>
)}
<p>Artist: {track.artist?.name}</p>
                  
                  {/* Tags */}
                  <div style={{ marginTop: '10px' }}>
                    <strong>Tags: </strong>
                    {track.tags?.map(tag => (
                      <span 
                        key={tag.id} 
                        onClick={() => removeTagFromTrack(track.id, tag.id)}
                        style={{
                          background: '#444',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginRight: '5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Click to remove"
                      >
                        {tag.name} ✕
                      </span>
                    ))}
                    
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          addTagToTrack(track.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        marginLeft: '10px',
                        background: '#4a3f2a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">+ Add Tag</option>
                      {tags.filter(tag => !track.tags?.find(t => t.id === tag.id)).map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Links */}
                  <div style={{ marginTop: '10px' }}>
  <strong>Links: </strong>
  {track.links?.map(link => (
    <div key={link.id} style={{ 
      marginLeft: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '5px',
      padding: '6px 10px',
      background: '#1a1a1a',
      borderRadius: '6px',
      width: 'fit-content'
    }}>
      {getLinkIcon(link.link_type)}
      <span style={{ fontWeight: 'bold', minWidth: '80px' }}>{link.link_type}</span>
      <a 
        href={link.link_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          color: '#4a9eff',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '14px'
        }}
      >
        View <ExternalLink size={12} />
      </a>
      <button 
        onClick={() => removeLink(link.id)}
        style={{
          background: '#8b0000',
          color: '#fff',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginLeft: '8px'
        }}
      >
        ✕
      </button>
    </div>
  ))}
                    
                    {showLinkForm === track.id ? (
                      <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                        <input
                          type="text"
                          placeholder="Link Type (Spotify, YouTube, etc.)"
                          value={newLink.link_type}
                          onChange={(e) => setNewLink({...newLink, link_type: e.target.value})}
                          style={{ padding: '5px', marginRight: '5px' }}
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          value={newLink.link_url}
                          onChange={(e) => setNewLink({...newLink, link_url: e.target.value})}
                          style={{ padding: '5px', marginRight: '5px', width: '300px' }}
                        />
                        <button
                          onClick={() => addLinkToTrack(track.id)}
                          style={{
                            background: '#4a3f2a',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '5px'
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowLinkForm(null)}
                          style={{
                            background: '#666',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowLinkForm(track.id)}
                        style={{
                          background: '#4a3f2a',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginLeft: '10px',
                          marginTop: '5px'
                        }}
                      >
                        + Add Link
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Track Button */}
                <button
                  onClick={() => deleteTrack(track.id)}
                  style={{
                    background: '#8b0000',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Delete Track"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TracksManager;