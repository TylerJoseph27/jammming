import React from 'react';

export default class PlaylistListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const tracks = await this.props.getPlaylistTracks(this.props.id);
    const name = await this.props.getPlaylistName(this.props.id);
    this.props.setPlaylist(name, tracks);
  }

  render() {
    return <h3 onClick={this.handleClick}>{this.props.name}</h3>;
  }
}