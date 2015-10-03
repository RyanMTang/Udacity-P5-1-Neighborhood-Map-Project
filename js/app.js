var infowindow = new google.maps.InfoWindow();
var marker;
var markerList = ko.observableArray([]);
var windowContent;
var center;
//Start viewModel
var viewModel = function(){
  var self = this;

  var infowindow = new google.maps.InfoWindow();

//Create map and set initial coordinates and zoom level
  self.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4214, lng: -75.6919},
    zoom: 12,
    scrollWheel: false
  });

  //Map resizes and centers when the window is resized
  google.maps.event.addDomListener(window, "resize", function() {
    var center = self.Map.getCenter();
    google.maps.event.trigger(map, "resize");
    self.Map.setCenter(center); 
  });

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

    this.isVisible = ko.observable(false);

    //Determines whether or not marker appears on the map
    this.isVisible.subscribe(function(currentState) {
      if (currentState) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });

    this.isVisible(true);

    //Fetches information from foursquare on marker click
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
                      var windowContent ='<p>' + venueName + '</p>' + '<p>' + venuePhone + '</p>' + '<p>' + venueAddress + '</p>'
                      infowindow.setContent(windowContent);
          
                  });//End of .getJSON


                //Open infowindow and pan to clicked marker
                marker.setAnimation(google.maps.Animation.BOUNCE); //Makes marker bounce
                setTimeout(function(){marker.setAnimation(null); }, 750) //Makes marker stop bouncing after one bounce
                map.panTo(marker.getPosition());
                infowindow.open(map, marker);        

            }; //End of return function()
        })(marker)); //End of click event listener

  } //End of Point function

  //Triggers marker click when corresponding list item is clicked
  self.listClick = function(clicked){
      var pos = self.points().indexOf(this);
      google.maps.event.trigger(markerList()[pos], 'click');
    }

  self.query = ko.observable('');

  //Model with all points
  self.points = ko.observableArray ([
  new Point(self.Map, 'El Camino', 45.415597, -75.688027),
  new Point(self.Map, 'Nature Museum', 45.412999, -75.688523),
  new Point(self.Map, 'Shawarma Palace', 45.431761, -75.679836),
  new Point(self.Map, 'The Horn of Africa', 45.432591, -75.676121),
  new Point(self.Map, 'Ottawa City Hall', 45.443206, -75.659874),
  new Point(self.Map, 'Canadian War Museum', 45.417355, -75.716931)
  ]);

  //Filters list items and markers based on user input in the search bar
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
