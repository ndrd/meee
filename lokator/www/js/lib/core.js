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
	console.log(eventName, eventArgs);
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
	servers : ['http://localhost:8080'],
	instance : null,
	storage : Core.Storage,
	currentChannel : null,
	callbacks  : {},


	init : function (events) {
		if (this.instance != null)
			return this;
		else
			this.instance = sckt = io.connect(this.getHost());

		reactor.registerEvent('start');
		reactor.registerEvent('end');
		reactor.registerEvent('update');
		reactor.registerEvent('track:started');

		sckt.on('track:started', function(e) {
			console.log('started', e);
			reactor.fire('track:started', e);
		});
		return this;
	},

	getHost : function () {
		return this.servers[Math.floor(Math.random() * this.servers.length)];
	},

	newSession : function () {
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

Core.Sensor = {
	currentPosition : null,

	init : function () {
		reactor.registerEvent('sensor-ready');
		reactor.registerEvent('change-position');
		return this;
	},

	onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.configureBackgroundGeoLocation();
        this.watchPosition();
    },
    receivedEvent: function(id) {
    	console.log('Received Event: ' + id);
	},
    configureBackgroundGeoLocation: function() {
        var fgGeo = window.navigator.geolocation,
            bgGeo = window.plugins.backgroundGeoLocation;

        this.onClickHome();

        /**
        * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
        */
        var yourAjaxCallback = function(response) {            
            bgGeo.finish();
        };

        /**
        * This callback will be executed every time a geolocation is recorded in the background.
        */
        var callbackFn = function(location) {
            this.setCurrentLocation(location);

            // After you Ajax callback is complete, you MUST signal to the native code, which is running a background-thread, that you're done and it can gracefully kill that thread.
            yourAjaxCallback.call(this);
        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        };

        // Only ios emits this stationary event
        bgGeo.onStationary(function(location) {

            var radius = (location.accuracy < location.radius) ? location.radius : location.accuracy;
            var center = new google.maps.LatLng(location.latitude, location.longitude);
            this.stationaryRadius.setRadius(radius);
            this.stationaryRadius.setCenter(center);

        });

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            url: 'http://data.darla.co.vu/track', // <-- Android ONLY:  your server url to send locations to
            params: {
                auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            },
            desiredAccuracy: 0,
            stationaryRadius: 10,
            distanceFilter: 10,
            notificationTitle: 'Tracker is in use', // <-- android only, customize the title of the notification
            notificationText: '', // <-- android only, customize the text of the notification
            activityType: 'AutomotiveNavigation',
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // <-- enable this to clear background location settings when the this terminates
        });
        
        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the this.
        var settings = 'true';
        bgGeo.start();
        bgGeo.changePace(true);
        reactor.fire('sensor-ready');
    },
    setCurrentLocation: function(location) {
    	//record later
    	reactor.fire('change-position', location);
        this.location = location;
    },

    onClickHome: function() {
    	var self =  this;
        var fgGeo = window.navigator.geolocation;

        // Your this must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
        //  in order to prompt the user for Location permission.
        fgGeo.getCurrentPosition(function(location) {
            var   coords  = location.coords;
            self.setCurrentLocation(coords);
        });
    },

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

		this.instance = this.map = new google.maps.Map(document.getElementById(id), opts) || null;
		
		if (wCurrentPos && this.map)
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

