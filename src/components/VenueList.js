import React, { Component } from 'react';

/* List of  venues with name and address. */
class VenueList extends Component {
  render() {
    const { venue } = this.props;
    return (
        <div className="venue-div" tabIndex="0" role="button" onClick={() =>
          { this.props.viewList(venue) }}
        >
            <h2>
            <span className="venue-name"
              onKeyPress={(event) => { this.linkspanKeyEnter(event, venue) }}
            >
              { venue.name }
            </span>
            </h2>
      </div>
    );
  }
}

export default VenueList;
