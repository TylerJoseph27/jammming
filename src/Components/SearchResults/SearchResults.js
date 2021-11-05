import React from 'react';
import TrackList from '../TrackList/TrackList.js';
import './SearchResults.css';

export default class SearchResults extends React.Component {
  render() {
    return (
      <div className='SearchResults'>
        <h2>Results</h2>
        <div className='TrackContainer'>
          <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} />
        </div>
        {this.props.children}
      </div>
    );
  }
}