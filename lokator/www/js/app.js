var sensor = Core.Sensor.init();
var streamer  = Core.Streamer.init();
var storage = Core.Storage;

var status = {
	streaming :  false,
	speed : 0,
	distance : 0,
	startTime : 0
};

document.addEventListener('deviceready', function () {
	sensor.onDeviceReady();
    StatusBar.overlaysWebView( false );
    StatusBar.backgroundColorByHexString('#ffffff');
    StatusBar.styleDefault();
    FastClick.attach(document.body);
    if (navigator.notification) { // Override default HTML alert with native dialog
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "Workshop", // title
                'OK'        // buttonName
            );
        };
    }
}, false);



jQuery( document ).ready(function( $ ) {
	/* record buttons */
	var $locate = $("#locate"),
  		$brdcst = $("#broadcast"),
  		$record = $("#record"),
  		$map  	= $("#map_record"),
  		$stats  = $('#record_stats');

	var $ss 	= $("#ss");
	$map.hide();
	
	reactor.addEventListener('sensor-ready', function(e){
		alert('ready to go');
	});
	reactor.addEventListener('track:started', function(e) {
		alert('ready to go');
	});
	reactor.addEventListener('change-position', function(e){
		alert('aaaa');
	});

	//listeners 
	$ss.on('focusout', function(e) {
		alert('server set to: ', $(this).val());
	});

	$locate.on('click', function (e) {
    	var map = app.map;
		map.getCurrentPosition();
	});

	$brdcst.on('click', function (e) {
		var _t = $(this);
		_t.toggleClass('recording')
		status.streaming = _t.hasClass('recording');
	});

	$record.on('click', function (e) {	
		alert('cm');
	    var _t = $(this);
	    _t.toggleClass('recording')
	    $stats.show();

	    if (!_t.hasClass('recording'))
	      streamer.newSession('anon');

	});


});