var places = [
  {
    name: 'El Camino',
    latlng: {lat: 45.415416, lng: -75.688027}
  },
  {
    name: 'Nature Museum',
    latlng: {lat: 45.412976, lng: -75.688523}
  }
]

var viewModel = function(){
  var self = this;

  self.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 15
  });

  self.placeContainer = [];
  places.forEach(function(place) {
    self.placeContainer.push(place);
    var marker = new google.maps.Marker({
      position: place.latlng,
      map: self.Map,
      title: place.name
    });
  });


  self.points= ko.observableArray(places);

  self.query = ko.observable('');

  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.points(), function(point){
      return point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });
}

ko.applyBindings(viewModel);
