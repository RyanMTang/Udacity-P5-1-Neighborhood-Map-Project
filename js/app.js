
var markerList = ko.observableArray([]);

function initMap(){
  //Create map and set initial coordinates and zoom level
  this.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 12,
  });
  var center = self.Map.getCenter();
  //Map resizes and centers when the window is resized
  google.maps.event.addDomListener(window, "resize", function() {
    google.maps.event.trigger(self.Map, "resize");
    self.Map.setCenter(center); 
  });

  this.infowindow = new google.maps.InfoWindow();
  //Function for creating points at different locations on the map
  var Point = function (map, name, lat, lon, id, marker) {
    var marker;
    var markerLat = lat;
    var markerLon = lon;
    var markerName = name;

    this.name = ko.observable(name);
    this.lat  = ko.observable(lat);
    this.lon  = ko.observable(lon);
    this.marker = ko.observable(marker);

    //Places a marker on the map
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      animation: google.maps.Animation.DROP,
      name: markerName
    });

    //Pushes marker into an observable array
    markerList.push(marker);

    //Fetches information from foursquare on marker click
    google.maps.event.addListener(marker, 'click', (function(marker)  {
            return function() {

              $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search'+
                  '?client_id=PRENND0ZKZI4DRHMGHP5GMBASHGUI5FYL2R53VK5J5VVGQCB'+
                  '&client_secret=VHTNW4NDFQSZACFPINV0OC2YEWAISSPXTOHY1UIOZIFVGDLO'+
                  '&v=20130815'+
                  '&ll=' + markerLat + ',' + markerLon +
                  '&query=' + markerName,
                dataType: 'json',
                success: function(response) {
                      var venue = response.response.venues[0];
                      var venueName = venue.name;
                      var venuePhone = venue.contact.formattedPhone;
                      var venueAddress = venue.location.formattedAddress;
                      var windowContent ='<p>' + venueName + '</p>' + '<p>' + venuePhone + '</p>' + '<p>' + venueAddress + '</p>';
                      infowindow.setContent(windowContent);
                },
                error: function(){
                  alert('Unable to retrieve Fourquare data');
                }

              });

                



                //Open infowindow and pan to clicked marker
                marker.setAnimation(google.maps.Animation.BOUNCE); //Makes marker bounce
                setTimeout(function(){marker.setAnimation(null); }, 750); //Makes marker stop bouncing after one bounce
                map.panTo(marker.getPosition());
                infowindow.open(map, marker);        

            }; //End of return function()
        })(marker)); //End of click event listener

  }; //End of Point function

   //Model with all points
  points = ko.observableArray ([
  new Point(this.Map, 'El Camino', 45.415597, -75.688027),
  new Point(this.Map, 'Nature Museum', 45.412999, -75.688523),
  new Point(this.Map, 'Shawarma Palace', 45.431761, -75.679836),
  new Point(this.Map, 'The Horn of Africa', 45.432591, -75.676121),
  new Point(this.Map, 'Ottawa City Hall', 45.443206, -75.659874),
  new Point(this.Map, 'Canadian War Museum', 45.417355, -75.716931)
  ]);
};

//Start viewModel
var viewModel = function(){
  var self = this;

  //Triggers marker click when corresponding list item is clicked
  self.listClick = function(clicked){
      var pos = markerList().indexOf(this);
      google.maps.event.trigger(markerList()[pos], 'click');
    };

  self.query = ko.observable('');

  //Filters list items and markers based on user input in the search bar
  self.filterPoints = ko.computed(function () {
    var search  = self.query().toLowerCase();
    if (!search) {
      for (i=0; i<markerList().length; i++) {
        markerList()[i].setMap(this.Map);
        infowindow.close(this.Map);
      }
      return markerList();
    } else {
    return ko.utils.arrayFilter(markerList(), function (marker) {
        var doesMatch = marker.name.toLowerCase().indexOf(search) >= 0;
        if (doesMatch){
          marker.setMap(this.Map);
        } else {
          marker.setMap(null);
        }
        return doesMatch;
      });
    }
  });
  //End self.filterPoints

}
ko.applyBindings(viewModel);
