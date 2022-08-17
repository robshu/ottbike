/* global config csv2geojson turf Assembly $ */
'use strict';

mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;

let geojsonData = {};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};

const map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.center,
  zoom: config.zoom,
  transformRequest: transformRequest,
});

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 15,
  });
}

function createPopup(currentFeature) {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popups[0]) popups[0].remove();
  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties[config.popupInfo[0]] + '</h3>' + '<h4>' + currentFeature.properties[config.popupInfo[1]] + '</h4>')
    .addTo(map);
}




function buildLocationList(locationData) {
  /* Add a new listing section to the sidebar. */
  const listings = document.getElementById('listings');
  listings.innerHTML = '';
  locationData.features.forEach((location, i) => {
    const prop = location.properties;

    const link = listings.appendChild(document.createElement('button'));
    /* Assign a unique `id` to the listing. */
    link.id = 'link-' + prop.id;

    /* Assign the `item` class to each listing for styling. */
    link.className = 'item';

    /* Add the link to the individual listing created above. */
    const listingTitle = link.appendChild(document.createElement('div'));
    listingTitle.className = 'title';
    listingTitle.id = 'listingTitle-' + prop.id;
    listingTitle.innerHTML =
      '<p style="line-height: 1.25">' + prop[columnHeaders[0]] + '</p>';

    /* Add details to the individual listing. */
    const details = link.appendChild(document.createElement('div'));
    details.className = 'content';

    for (let i = 1; i < columnHeaders.length; i++) {
      const div = document.createElement('div');
      div.innerText += prop[columnHeaders[i]];
      div.className;
      details.appendChild(div);
    }

    link.addEventListener('click', function () {
      const clickedListing = location.geometry.coordinates;
      flyToLocation(clickedListing);
      createPopup(location);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  });
}




map.on('load', () => {
  map.addControl(new mapboxgl.NavigationControl());

  // csv2geojson - following the Sheet Mapper tutorial https://www.mapbox.com/impact-tools/sheet-mapper
  console.log('loaded');
  $(document).ready(() => {
    console.log('ready');
    $.ajax({
      type: 'GET',
      url: config.CSV,
      dataType: 'text',
      success: function (csvData) {
        makeGeoJSON(csvData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
      csvData,
      {
        latfield: 'Latitude',
        lonfield: 'Longitude',
        delimiter: ',',
      },
      (err, data) => {
        data.features.forEach((data, i) => {
          data.properties.id = i;
        });

        geojsonData = data;
        // Add the the layer to the map
        map.addLayer({
          id: 'locationData',
          type: 'circle',
          source: {
            type: 'geojson',
            data: geojsonData,
          },
          paint: {
            'circle-radius': 5, // size of circles
            'circle-color': {
                property: 'Status',
                type: 'categorical',
                stops: [
                ['Planned', '#FD7596'],
                ['Built', '#75FBFD']]
                } 
          },
        });
      },
    );

    map.on('click', 'locationData', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['locationData'],
      });
      const clickedPoint = features[0].geometry.coordinates;
      flyToLocation(clickedPoint);
      createPopup(features[0]);
      
    });

    map.on('mouseenter', 'locationData', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', () => {
      map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
    
  }

  

});



function transformRequest(url) {
  const isMapboxRequest =
    url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';
  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
  };
}









