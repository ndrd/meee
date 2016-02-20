var Core = Core || {};

function Event(name){
  this.name = name;
  this.callbacks = [];
}
Event.prototype.registerCallback = function(callback){
  this.callbacks.push(callback);
}

function Reactor(){
  this.events = {};
}

Reactor.prototype.registerEvent = function(eventName){
  var event = new Event(eventName);
  this.events[eventName] = event;
};

Reactor.prototype.fire = function(eventName, eventArgs){
  this.events[eventName].callbacks.forEach(function(callback){
    callback(eventArgs);
  });
};

Reactor.prototype.addEventListener = function(eventName, callback){
  this.events[eventName].registerCallback(callback);
};

var reactor = new Reactor();

Core.Storage = {
	get :  function(key) {
		return window.localStorage.getItem(key);
	},
	set : function(key, value) {
		return window.localStorage.setItem(key, value);
	}, 

};

Core.Streamer = {
	servers : ['http://localhost:8001'],
	instance : null,
	storage : Core.Storage,
	currentChannel : null,
	callbacks  : {},


	init : function (events) {
		if (this.instance != null)
			return this;
		else
			this.instance = sckt = io.connect(this.getHost());
		return this;
	},

	getHost : function () {
		return this.servers[Math.floor(Math.random() * this.servers.length)];
	},

	newSession : function (callback) {
		this.callbacks['track:started'] = callback;
		this.instance.emit('track:start', 'anon');
	},

	testConn : function (e) {
		alert('Conectado con el streamer');
	},

	sendPosition : function (data) {
		var self = this;
		
		if (!self.currentChannel) {
			self.newSession(function(data) {
				self.currentChannel = data.uid;
			});
		}

		this.instance.emit('track:update', {
			lat : data.latitude,
			lon : data.longitude,
			t : new Date().getTime(),
			s : data.speed,
			uid : self.currentChannel
		});
	}
};

Core.Map = {
	storage : Core.Storage,
	instance : null,
	map : null,
	location : null,
	locations : [],
	
	_styles :  [
	  {
	    "stylers": [
	      { "invert_lightness": true },
	      { "weight": 2.2 }
	    ]
	  }
	],

	init : function (id, wCurrentPos) {
		if (this.instance)
			return this;

		var _this = this;
		var _st = this.storage;

		var opts = {
			   center: {
				   	lat: _st.get('lst_lat') || 0,
				   	lng: _st.get('lst_lon') || 0
			   },
			   zoom: 4,
			   scrollwheel :false,
			   disableDefaultUI: true,
			   styles : this._styles
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
				fillColor: 'orange',
				strokeColor: 'orange',
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

			if (zoom < 16) {
			    _this.map.setZoom(16);
			}

			if (_this.location == null ||
				_this.location.latitude != coords.latitude
				&& _this.location.longitude != coords.longitude ) {
				_this.location = coords;
				_this.setMarkerPosition(coords);

			}

		});
	},
};

