
var Record = {

	map 	: null,
	socket	: null,
	storage : null,
	servers : [],
	_coords	: {},

	init : function () {
		/* type less */
		this.storage =  {
			get :  function(key) {
				return window.localStorage.getItem(key);
			},
			set : function(key) {
				return window.localStorage.setItem(key);
			}
		};

		this._initMap('map_record');
		//this.socket = io.connect("http://localhost:8001"); 
	},

	_initMap : function (id) {
		var _this = this;
		var _st = this.storage;
		var geo =  window.navigator.geolocation;

		var opts = {
			   center: {
				   	lat: _st.get('lst_lat') || 0,
				   	lng: _st.get('lst_lon') || 0
			   },
			   zoom: 4,
			   scrollwheel :false,
			   disableDefaultUI: true
	 	};

		this.map = new google.maps.Map(document.getElementById(id), opts);

		geo.getCurrentPosition(function(location) {
			var coords 	= location.coords,
				pos 	= new google.maps.LatLng(coords.latitude, coords.longitude),
				zoom 	= _this.map.getZoom();

			_this.map.setCenter(pos);

		});
	}, 
	

};



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


