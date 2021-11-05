import React from 'react';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem.js';

export default class PlaylistList extends React.Component {
  render() {
    const playlists = this.props.localPlaylists.map(playlist => {
      return <PlaylistListItem 
        key={playlist.id} 
        id={playlist.id} 
        name={playlist.name} 
        getPlaylistTracks={this.props.getPlaylistTracks} 
        getPlaylistName={this.props.getPlaylistName} 
        setPlaylist={this.props.setPlaylist}
      />
    });

    return (
      <div className='PlaylistContainer'>
        <h2>Local Playlists</h2>
        <div className='LocalPlaylists'>
          {playlists}
        </div>
      </div>
    );
  }
}