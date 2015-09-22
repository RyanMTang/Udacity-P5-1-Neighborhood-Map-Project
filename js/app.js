function initMap() {
  var myLatLng = {lat: 45.4214, lng: -75.6919};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 15
  });
  var natureMuseum = {lat: 45.4214, lng: -75.6919};
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: natureMuseum,
    title: 'Nature Museum'
  });
}