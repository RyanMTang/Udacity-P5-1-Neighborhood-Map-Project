var markers = [];
var places = [
  {
    name: 'El Camino',
    latlng: {lat: 45.415416, lng: -75.688027}
  },
  {
    name: 'Nature Museum',
    latlng: {lat: 45.412976, lng: -75.688523}
  }
];

var viewModel = function(){
  var self = this;

  self.points= ko.observableArray(places);

  self.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 15
  });

  for(var i=0; i<self.points().length; i++){
      var marker = new google.maps.Marker({
      position: self.points()[i].latlng,
      title: self.points().name,
      map: self.Map
    });
    markers.push(marker);
  };
  
  function clearMarkers(){
    for (var i=0; i<markers.length; i++) {
      if (markers[i].title.toLowerCase().index(self.userInput()) >=0) {
        markers[i].setMap(null);
      }
    }
  }

  

  


  self.userInput = ko.observable('');


  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.points(), function(point){
      return point.name.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
    });
  });
}

ko.applyBindings(viewModel);
