//this function created & recommended by Ryan Waite in the "Coding Session-Google Maps with React JS" to make it easy to load Google Maps directly (video at marker 19.46 can be accessed here:"https://www.youtube.com/watch?v=5J6fs_BlVC0&feature=youtu.be")


import idb from 'idb';

export const dbPromise = idb.open('restaurants-app-db', 1, upgradeDB => {
  upgradeDB.createObjectStore('ajax_fetches');
  var venues_store = upgradeDB.createObjectStore('venues', { keyPath: 'id' });
  venues_store.createIndex('id', 'id');
});

export function getAJAXfetches(key) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  return dbPromise.then(db => {
    return db.transaction('ajax_fetches').objectStore('ajax_fetches').get(key);
  })
}

export function getVenues() {
  return dbPromise.then(db => {
    return db.transaction('venues').objectStore('venues').getAll();
  })
}

export function storeAJAXfetch(key, value) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  if(!value) {
    console.log(value);
    return Promise.reject('"value" argument is required');
  }
  return dbPromise.then(db => {
    const tx = db.transaction('ajax_fetches', 'readwrite');
    let store = tx.objectStore('ajax_fetches');
    store.put(value, key);
    return tx.complete;
  });
}

export function storeVenues(venues) {
  if(!venues || !Array.isArray(venues)) {
    console.log(venues);
    return Promise.reject('"venues" argument must be an array');
  }
  if(venues.length === 0) {
    console.log(venues);
    return Promise.reject('"venues" array length must be greater than 1');
  }
  for(let v of venues) {
    if(v.constructor !== Object) {
      console.log(v);
      return Promise.reject('each item in "venues" must be an object literal');
    }
    if(!v.id) {
      console.log(v);
      return Promise.reject('each item in "venues" must have "id" property');
    }
  }
  return dbPromise.then(db => {
    const tx = db.transaction('venues', 'readwrite');
    let store = tx.objectStore('venues');
    venues.forEach(venue => { store.put(venue) });
    return tx.complete;
  });
}

/* Sort array by name ascending because by default array comes in with no sorting. */
export function sort_by(array, property, direction) {
  let tempArray = array;
  tempArray.sort(function(a, b){
    var x = ( a[property].constructor === String && a[property].toLowerCase() ) || a[property];
    var y = ( b[property].constructor === String && b[property].toLowerCase() ) || b[property];
    let value = ( direction && String(direction) ) || "asc";
    switch(value) {
      case "asc":
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      case "desc":
        // desc
        if (x > y) {return -1;}
        if (x < y) {return 1;}
        return 0;
      default:
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    }
  });
  return tempArray;
}

export function aft(l) {
  let s = "";
  let i = 0;
  let e = l.length - 1;
  for(i = 0; i < e; i++) {
    s += (l[i] + "<br/>")
  }
  s += l[i];
  return s;
}


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
  return new Promise(function(resolve, reject){
    getVenues()
    .then(venues => {
      if(venues.length > 0) {
        return resolve(venues) ;
      }

      let city = 'Atlanta, GA';
      let query = 'Shopping';
      var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=0W2LOTRT115GNDKN4FDQEISOKW3QHUYDFY23ODPHN0ETFACC&client_secret=PG4JFVZFG524WLIPMC3KXJIPASZNN0ZRB1DKAUUSH5C1IEQP&v=20180323%20&limit=50&near=' + city + '&query=' + query + '';
      fetch(apiURL).then(resp => resp.json())
      .then(json => {
       let { venues } = json.response;
       storeVenues(venues)
       .then(res => {
         // console.log('Venues stored.');
         return resolve(venues);
       })
     })
     .catch(error => {
       reject(error);
     })
   })
   .catch(error => {
     reject(error);
   })
 });
}

export function getGoogleImage(venue) {
 return 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + venue.location.lat + ',' + venue.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyB6N63ZIGH4b8Hgm9KhodA87Guuiem3C8Y'
}
