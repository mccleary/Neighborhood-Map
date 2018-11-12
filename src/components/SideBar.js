//help from Ryan Waite
import React, { Component } from 'react';
import VenueList from './VenueList';

// SideBar venues listings 
class SideBar extends Component {
  state = {
    query: '',
    open: false
  }

  updateSearch = (query) => {
    this.setState({ query: query });
    this.props.filterVenueList(query);
  }

  render() {
    let displaySidebar = this.props.sidebarOpen ? "block" : "none";
    return (
      <section id="sidebar" style={{ display: displaySidebar }}>
        <div id="sidebar-filter">
          {
            <div>
              <input id="filter-box" role="application" aria-labelledby="label-filter" placeholder="Filter Search"
                value={this.props.query}
                onChange={(e) => { this.props.filterVenues(e.target.value) }}
              />
              <br/>
              <div className="sidebar-div">
                {
                  this.props.filteredVenues && this.props.filteredVenues.map((venue, key) => (
                    <VenueList key={key} venue={venue}
                      viewList={this.props.viewList}
                      // liKeyEnter={this.props.liKeyEnter}
                    />
                  ))
                }
              </div>
            </div>
          }
        </div>
      </section>
    );
  }
}

export default SideBar;
