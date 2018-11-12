import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
// usage of utils as suggested by Ryan Waite
import * as utils from './utils'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredVenuesVenues : null,
      sidebarOpen: false,
      query: "",
      showModal: false
    }
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.viewList = this.viewList.bind(this);
    this.filterVenues = this.filterVenues.bind(this);
  }


  toggleSideBar () {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  }

  /* Access Google Maps API and return it. Goes along with utils function created and suggested for use by Ryan Waite */
  getGoogleMaps() {
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(window.google);
          delete window.resolveGoogleMapsPromise;
        };
        const script = document.createElement("script");
        const API = 'AIzaSyB6N63ZIGH4b8Hgm9KhodA87Guuiem3C8Y';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  /* When user clicks on list in sidebar, the correct marker will animate, the modal will pop up and the marker will center itself on the map. */
  viewList(venue) {
    let marker = this.markers.filter(m => m.venue.id === venue.id)[0];
    let info_obj = this.info_boxes.filter(i => i.id === venue.id)[0];
    let infoBox = (info_obj && info_obj.contents) || "no info...";
    if(marker && infoBox) {
      if (marker.getAnimation() !== null) { marker.setAnimation(null); }
      else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
      setTimeout(() => { marker.setAnimation(null) }, 1000);

      this.infowindow.setContent(infoBox);
      this.map.setZoom(13);
      this.map.setCenter(marker.position);
      this.infowindow.open(this.map, marker);
    }
  }
  // this is to load & fetch API data from Google Maps API and Foursquare that is in th 'utils file'
  componentDidMount() {
    let get_google = this.getGoogleMaps();
    let get_venues = utils.loadVenues();

    Promise.all([ get_google, get_venues ])
    .then(values => {
      // console.log(values);
      let google = values[0];
      let venues = values[1];

      let markers = [];
      let info_boxes = [];

      /* Tells Google Maps map to to render to the page and create a center point on the map. */
      this.google = google;
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        scrollwheel: true,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
      });

      /* Collect the requested data below for each venue. */
      venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          formattedAddress: venue.location.formattedAddress,
          animation: google.maps.Animation.DROP,
          icon: {url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        });

        /* sending the data from venues to the Infowindow to render to the screen per the modal. */
        let infoBox = '<div class="info_box">' +
        '<h4>' + venue.name + '</h4>' +
        '<p>' + utils.aft(venue.location.formattedAddress) + '</p>' +
        '<img class="middlr" alt="' + venue.name + '" src="' + utils.getGoogleImage(venue) + '" />' +
        '</div>';

        /* Telling the marker to animate when the user clicks on it. */
        marker.addListener('click', () => {
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
				  else { marker.setAnimation(google.maps.Animation.BOUNCE); }
				  setTimeout(() => { marker.setAnimation(null) }, 700);
        });

        /* When the marker is clicked, the modal attaches the venue data and renders in the modal for user to view. */
        google.maps.event.addListener(marker, 'click', () => {
  			   this.infowindow.setContent(infoBox);
				   this.map.setZoom(15);
				   this.map.setCenter(marker.position);
				   this.infowindow.open(this.map, marker);
			  });
        markers.push(marker);
        info_boxes.push({ id: venue.id, name: venue.name, contents: infoBox });
      });

      this.venues = utils.sort_by(venues, "name", "asc");
      this.markers = utils.sort_by(markers, "name", "asc");
      this.info_boxes = utils.sort_by(info_boxes, "name", "asc");

      this.setState({ sidebarOpen: true, filteredVenues: this.venues });
    })
    .catch(error => {
      console.log(error);
      alert('Oh no, page is unable to load.');
    })
  }

  /* filtering through what the user enters in the Filter Search box whether inout is in lower case, uppercase or both */
  filterVenues(query) {
    let listViewFilter = this.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
      marker.setVisible(true) :
      marker.setVisible(false);
    });
    this.setState({ filteredVenues: listViewFilter, query });
  }


  render() {
    let displaySidebar = this.state.sidebarOpen ? "block" : "none";

    return (
      <div id="app-container">
        <NavBar
          sidebarOpen={this.state.sidebarOpen}
          toggleSideBar={this.toggleSideBar}
        />
        <SideBar
          query={this.state.query}
          filteredVenues={this.state.filteredVenues}
          sidebarOpen={this.state.sidebarOpen}
          toggleSideBar={this.toggleSideBar}
          filterVenues={this.filterVenues}
          viewList={this.viewList}
          displaySidebar={displaySidebar}
        />
        <Map />
      </div>
    );
  }
}

export default App;
