import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import PlaylistList from '../PlaylistList/PlaylistList.js';
import Spotify from '../../util/Spotify.js';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      localPlaylists: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.setPlaylist = this.setPlaylist.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.setState({ playlistTracks: [...this.state.playlistTracks, track] });
    }
  }

  removeTrack(track) {
    this.setState({ playlistTracks: this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id) });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    return Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => {
      this.setState({ playlistName: 'New Playlist', playlistTracks: [] });
      document.getElementById('playlistName').value = 'New Playlist';
      this.getLocalPlaylists();
    })
    .catch(error => console.log(error));
  }

  search(searchTerm) {
    if (searchTerm) {
      Spotify.search(searchTerm)
      .then(response => {
        // only display search results not already in playlist
        const trackIDs = this.state.playlistTracks.map(track => track.id);
        this.setState({ searchResults: response.filter(track => !trackIDs.includes(track.id)) });
      })
      .catch(error => console.log(error));
    } else {
      this.setState({ searchResults: [] });
    }
  }

  async getLocalPlaylists() {
    this.setState({ localPlaylists: await Spotify.getUserPlaylists() });
  }

  setPlaylist(name, tracks) {
    this.setState({ playlistName: name, playlistTracks: tracks });
    document.getElementById('playlistName').value = name;
  }

  render() {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search} />
          <div className='App-playlist'>
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} >
              <PlaylistList 
                localPlaylists={this.state.localPlaylists} 
                getPlaylistTracks={Spotify.getPlaylistTracks} 
                getPlaylistName={Spotify.getPlaylistName} 
                setPlaylist={this.setPlaylist} 
              />
            </SearchResults>
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    Spotify.getAccessToken();
    this.getLocalPlaylists();
  }
}