var place = function(name,lat,lng) {
  this.name = name,
  this.lat = lat,
  this.lng = lng
};

var model = [
  new place('El Camino', 45.415687, -75.688241)
];


function initMap() {
  var myLatLng = {lat: 45.4214, lng: -75.6919};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng
  });

  for(var i=0; i<model.length; i++) {
    var marker = new google.maps.Marker({
      position: {lat: model[i].lat, lng: model[i].lng},
      map: map,
      title: 'Hello World!'
    });
  }
}

var ViewModel = function() {
      var self = this;

};

    ko.applyBindings(new ViewModel());