import React from 'react';
import './Track.css';

export default class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.preview = this.preview.bind(this);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return <button className='Track-action' onClick={this.removeTrack}>-</button>;
    } else {
      return <button className='Track-action' onClick={this.addTrack}>+</button>;
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  preview() {
    if (this.props.isRemoval) {
      return;
    } else {
      return <audio controls src={this.props.track.preview}></audio>;
    }
  }

  render() {
    return (
      <div className='Track'>
        <div className='Track-information'>
          <img src={this.props.track.cover} alt='album cover'/>
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
          {this.preview()}
        </div>
        {this.renderAction()}
      </div>
    );
  }
}