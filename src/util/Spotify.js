let userAccessToken;
let expirationTime;
// regular expressions for match()
const accessTokenRegEx = /access_token=([^&]*)/;
const expirationRegEx = /expires_in=([^&]*)/;
const clientID = 'aad786ed32354277b723aa072cc2fe53';
const redirectURI= 'https://tylerjoseph27-jammming.netlify.app/';

let userID;

const Spotify = {
  getAccessToken() {
    // check for access token
    if (userAccessToken) {
      return userAccessToken;
    } else if (window.location.href.match(accessTokenRegEx) && window.location.href.match(expirationRegEx)) {
      // get access token and expiration time from url
      userAccessToken = window.location.href.match(accessTokenRegEx)[1];
      expirationTime = window.location.href.match(expirationRegEx)[1];
      // wipe access token and url parameters from browser history
      window.setTimeout(() => userAccessToken = '', Number(expirationTime) * 1000);
      window.history.pushState('Access Token', null, '/');

      return userAccessToken
    } else {
      // redirect if no access token
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.tracks.items.length === 0) {
        return [];
      } else {
        const tracks = jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview: track.preview_url,
            cover: track.album.images[0].url
          };
        });
        return tracks;
      }
    })
    .catch(error => console.log(error));
  },

  getUserID() {
    if (userID) {
      let promise = new Promise((resolve) => resolve(userID));
      return promise;
    } else {
      const accessToken = Spotify.getAccessToken();

      return fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.id)
      .catch(error => console.log(error));
    }
  },
  
  async savePlaylist(name, trackURIs) {
    if (name && trackURIs) {
      const accessToken = Spotify.getAccessToken();
      const headers =  { Authorization: `Bearer ${accessToken}` };
      userID = await Spotify.getUserID();

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: name })
      })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ uris: trackURIs })
        })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.snapshot_id)
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    } else {
      return;
    }
  },

  async getUserPlaylists() {
    const accessToken = Spotify.getAccessToken();
    userID = await Spotify.getUserID();

    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.items.length === 0) {
        return [];
      } else {
        const playlists = jsonResponse.items.map(playlist => {
          return {
            id: playlist.id,
            name: playlist.name
          };
        });
        return playlists;
      }
    })
    .catch(error => console.log(error));
  },

  async getPlaylistTracks(playlistID) {
    const accessToken = Spotify.getAccessToken();
    userID = await Spotify.getUserID();

    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.json())
    .then(jsonResponse => {
      const playlist = jsonResponse.items.map(playlist => {
        return {
          id: playlist.track.id,
          name: playlist.track.name,
          artist: playlist.track.artists[0].name,
          album: playlist.track.album.name,
          uri: playlist.track.uri,
          cover: playlist.track.album.images[0].url
        };
      });
      return playlist;
    })
    .catch(error => console.log(error));
  },

  async getPlaylistName(playlistID) {
    const accessToken = Spotify.getAccessToken();
    userID = await Spotify.getUserID();

    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.name)
    .catch(error => console.log(error));
  }
};

export default Spotify;