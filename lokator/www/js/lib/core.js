var Core = Core || {};

Core.Storage = {
	get :  function(key) {
		return window.localStorage.getItem(key);
	},
	set : function(key, value) {
		return window.localStorage.setItem(key, value);
	}
};

Core.Socket = {
};

Core.Map = {
	storage : Core.Storage,
	instance : null,
	map : null,
	location : null,
	locations : [],

	init : function (id, wCurrentPos) {
		console.log(this);
		if (this.instance)
			return this;

		var _this = this;
		var _st = this.storage;
		console.log(this.storage);

		var opts = {
			   center: {
				   	lat: _st.get('lst_lat') || 0,
				   	lng: _st.get('lst_lon') || 0
			   },
			   zoom: 4,
			   scrollwheel :false,
			   disableDefaultUI: true
	 	};

		this.instance = this.map = new google.maps.Map(document.getElementById(id), opts);
		
		if (wCurrentPos)
			this.getCurrentPosition();

		return this;
	},

	setMarkerPosition : function (coords) {
		var marker = new google.maps.Marker({
			map : this.map,
			position : new google.maps.LatLng(coords.latitude, coords.longitude),
			icon : {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 3,
				fillColor: 'blue',
				strokeColor: 'blue',
				strokeWeight: 3
			}
		});
	},

	getCurrentPosition : function () {
		var geo 	=  window.navigator.geolocation,
			_this 	= this;

		geo.getCurrentPosition(function(location) {
			var coords 	= location.coords,
				pos 	= new google.maps.LatLng(coords.latitude, coords.longitude),
				zoom 	= _this.map.getZoom();

			_this.map.setCenter(pos);

			if (_this.location == null ||
				_this.location.latitude != coords.latitude
				&& _this.location.longitude != coords.longitude ) {
				_this.location = coords;
				_this.setMarkerPosition(coords);

			}

		});
	},
};

