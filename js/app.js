function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    scrollwheel: true,
    zoom: 15
  });

   map.data.setStyle(function(feature) {
    return {
      title: feature.getProperty('name'),
      optimized: false
    };
  });
  map.data.addGeoJson(places);
}

var places = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-75.6879, 45.4149]},
    properties: {name: 'El Camino', category: 'restaurant'}
  }, {
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-75.688577, 45.413891]},
    properties: {name: 'Nature Museum', category: 'museum'}
  }, {
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-75.691868, 45.427893]},
    properties: {name: 'Cacao 70', category: 'restaurant'}
  }, {
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-75.691273, 45.422303]},
    properties: {name: 'Ottawa City Hall', category: 'restaurant'}
  }, {
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-75.692169, 45.428032]},
    properties: {name: 'Vittoria Trattoria', category: 'restaurant'}
  }]
};

var viewModel = function(){
  var self = this;
  self.points = ko.observableArray(places.features);

  self.query = ko.observable('');

  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.points(), function(point){
      return point.properties.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;

    });
  });

}

ko.applyBindings(viewModel());




