var viewModel = function(){
  var self = this;
  var infowindow = new google.maps.InfoWindow();

  self.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 15
  });

  var Point = function (map, name, lat, lon, text) {
    var marker;

    this.name = ko.observable(name);
    this.lat  = ko.observable(lat);
    this.lon  = ko.observable(lon);
    this.text = ko.observable(text);

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      animation: google.maps.Animation.DROP
    });


    this.isVisible = ko.observable(false);

    this.isVisible.subscribe(function(currentState) {
      if (currentState) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });

    this.isVisible(true);

    google.maps.event.addListener(marker, 'click', (function(marker)  {
            return function() {

                // set info window with a title and open the info window
                //infowindow.setTitle(marker.title);
                map.panTo(marker.getPosition());
                infowindow.setContent(Point.name);
                infowindow.open(map, marker);          

            };
        })(marker));
  }


  self.query = ko.observable('');
  
  self.points = ko.observableArray ([
  new Point(self.Map, 'El Camino', 45.415627, -75.688070, 'Hi'),
  new Point(self.Map, 'Nature Museum', 45.412961, -75.688534, 'Hi')
  ]);

  self.filterPoints = ko.computed(function () {
    var search  = self.query().toLowerCase();

    return ko.utils.arrayFilter(self.points(), function (point) {
        var doesMatch = point.name().toLowerCase().indexOf(search) >= 0;

        point.isVisible(doesMatch);

        return doesMatch;
    });
  });

}

ko.applyBindings(viewModel);
