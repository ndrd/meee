function initMap() {
	var map = null;
	window.map_record = map =  new google.maps.Map(document.getElementById('map_record'), {
	   center: {lat: -34.397, lng: 150.644},
	   zoom: 15,
	   scrollwheel :false,
	   disableDefaultUI: true
	 });

	showCurrentPosition(map);
}

function showCurrentPosition(map) {
	var fgGeo = window.navigator.geolocation;

	// Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
	//  in order to prompt the user for Location permission.
	fgGeo.getCurrentPosition(function(location) {
	    var coords  = location.coords,
	        ll      = new google.maps.LatLng(coords.latitude, coords.longitude),
	        zoom    = map.getZoom();

	    map.setCenter(ll);
	    if (zoom < 15) {
	        map.setZoom(15);
	    }
	});

}


