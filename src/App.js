import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { getGoogleMaps, loadVenues } from './utils';
// import Map from './components/Map';
// import NavBar from './components/NavBar';
// import SideBar from './components/SideBar';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    let googleMapsPromise = getGoogleMaps();
    let venuesPromise = loadVenues();

    Promise.all([ googleMapsPromise, venuesPromise ])
    .then(values => {
      let google = values[0];
      let venues = values[1].response.venues;
      let markers = [];
      let infowindow = [];

      this.google = google;
      this.infowindow = new google.maps.InfoWindow();
      // this creates and loads map to page
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        scrollwheel: true,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
      });

      venues = (venue) => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          name: venue.name,
          id: venue.id,
          // icon: defaultIcon,
          animation: google.maps.Animation.DROP
        });
        markers.push(marker);
      }

      // Listing markers icon (styling)
      // let defaultIcon = makeMarkerIcon('0091ff');

      // Creates a "highlighted location" marker color when user mouses over marker.
      // let highlightedIcon = makeMarkerIcon('FFFF24');

    })
  }



  render() {
    return (
      <main>
        <div>
          <nav id="navbar">
            <h1 id="header-text">Neighborhood Map</h1>
          </nav>
          <div id="map"></div>
          <div id="sidebar">
            <input value={this.state.query} onChange={(e) => { this.filterVenues(e.target.value) }}/>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
