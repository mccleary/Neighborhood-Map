//this function created & recommended by Ryan Waite in the "Coding Session-Google Maps with React JS" video at marker 19.46. Video can be accessed here:"https://www.youtube.com/watch?v=5J6fs_BlVC0&feature=youtu.be" this function makes it easy to load Google Maps directly.

// Google Maps API
export function getGoogleMaps() {
  return new Promise((resolve) => {
    // define the global callback that will run when google map is loaded
    window.resolveGoogleMapsPromise = () => {
      // resolve the google object
      resolve(window.google);
      // delete the global callback to tidy up since it is no longer needed
      delete window.resolveGoogleMapsPromise;
    };
    // Now, load the Google Maps API
    const script = document.createElement("script");
    const API = 'AIzaSyBKAhjUXlPp7ZPhzc7AacoRhFqBfd3sLZs';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}


// FourSquare API
export function loadVenues() {
  let city = 'Atlanta, GA';
  let query = 'Shopping';
  var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=0W2LOTRT115GNDKN4FDQEISOKW3QHUYDFY23ODPHN0ETFACC&client_secret=PG4JFVZFG524WLIPMC3KXJIPASZNN0ZRB1DKAUUSH5C1IEQP&v=20180323%20&limit=50&near=' + city + '&query=' + query + '';
  return fetch(apiURL).then(resp => resp.json())
}
