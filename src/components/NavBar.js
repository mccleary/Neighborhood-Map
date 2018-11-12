import React, { Component } from 'react';

/* Navigation Bar and toggle button */
class NavBar extends Component {
  render() {
    return (
      <nav id="navbar">
        <h1 id="header-text">Neighborhood Maps</h1>
        <div className="hamburger-menu">
          <button className="hamburger" aria-label="menu"><i className="fa fa-bars" onClick={this.props.toggleSideBar}/></button>
        </div>
      </nav>
    );
  }
}

export default NavBar;
