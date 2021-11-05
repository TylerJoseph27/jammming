import React from 'react';
import TrackList from '../TrackList/TrackList.js';
import './Playlist.css';

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loadingScreen: <div className='Blank'></div> }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  handleClick() {
    this.setState({ loadingScreen: (
      <div className='LoadingScreen'>
        <div className='LoadingBar'></div>
      </div>
    ) });
    this.props.onSave()
    .then(() => {
      this.setState({ loadingScreen: <div className='Blank'></div> });
    });
  }

  render() {
    return (
      <div className='Playlist'>
        <input id='playlistName' defaultValue={'New Playlist'} onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <button className='Playlist-save' onClick={this.handleClick}>SAVE TO SPOTIFY</button>
        {this.state.loadingScreen}
      </div>
    );
  }
}