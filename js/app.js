var infowindow = new google.maps.InfoWindow();
var markerList = [];
var viewModel = function(){
  var self = this;
  var infowindow = new google.maps.InfoWindow();

  self.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 15
  });

  var Point = function (map, name, lat, lon, id) {
    var marker;
    var markerLat = lat;
    var markerLon = lon;
    var markerName = name;

    this.name = ko.observable(name);
    this.lat  = ko.observable(lat);
    this.lon  = ko.observable(lon);
    this.id = ko.observable(id);

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      animation: google.maps.Animation.DROP
    });

    markerList.push(marker);


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

                var url = 'https://api.foursquare.com/v2/venues/search'+
                  '?client_id=PRENND0ZKZI4DRHMGHP5GMBASHGUI5FYL2R53VK5J5VVGQCB'+
                  '&client_secret=VHTNW4NDFQSZACFPINV0OC2YEWAISSPXTOHY1UIOZIFVGDLO'+
                  '&v=20130815'+
                  '&ll=' + markerLat + ',' + markerLon +
                  '&query=' + markerName;

                  $.getJSON(url, function(response){
                      var venue = response.response.venues[0];
                      var venueName = venue.name;
                      var venuePhone = venue.contact.formattedPhone;
                      var venueAddress = venue.location.formattedAddress;
                      infowindow.setContent('<p>' + venueName + '</p>' + '<p>' + venuePhone + '</p>' + '<p>' + venueAddress + '</p>')
          
                  });


                // set info window with a title and open the info window
                //infowindow.setTitle(marker.title);
                map.panTo(marker.getPosition());
                infowindow.open(map, marker);   
                markerList.push(marker);       

            };
        })(marker));
  
  }




  self.query = ko.observable('');
  
  self.points = ko.observableArray ([
  new Point(self.Map, 'El Camino', 45.415627, -75.688070, '51a7d672498e75eb9ec84dab'),
  new Point(self.Map, 'Nature Museum', 45.412961, -75.688534, '51a7d672498e75eb9ec84dab')
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
