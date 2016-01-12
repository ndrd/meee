var app = {};

function initMap() {
	app.map = Core.Map.init('map_record', true);
}

// document.addEventListener('deviceready', function () {
//     StatusBar.overlaysWebView( false );
//     StatusBar.backgroundColorByHexString('#ffffff');
//     StatusBar.styleDefault();
//     FastClick.attach(document.body);
//     if (navigator.notification) { // Override default HTML alert with native dialog
//         window.alert = function (message) {
//             navigator.notification.alert(
//                 message,    // message
//                 null,       // callback
//                 "Workshop", // title
//                 'OK'        // buttonName
//             );
//         };
//     }
// }, false);

jQuery( document ).ready(function( $ ) {
	var map = app.map;

  var streamer  = Core.Streamer.init([
      'track:started',

    ]);
  var storage = Core.Storage;
	/* record buttons */
	var $locate = $("#locate"),
  		$brdcst = $("#broadcast"),
  		$record = $("#record");

	var $ss 	= $("#ss");

	//listeners 
	$ss.on('focusout', function(e) {
		alert('server set to: ', $(this).val());
	});

	$locate.on('click', function (e) {
    var map = app.map;
		map.getCurrentPosition();
	});

	$brdcst.on('click', function (e) {
		streamer.sendPosition(app.map.location);
	});

	$record.on('click', function (e) {	
    var _t = $(this);
    _t.toggleClass('recording')
    if (!_t.hasClass('recording'))
      streamer.newSession(function(data) {
        _t.find('i').text('stop');
        storage.set('track_details', data)
        this.currentChannel = data.uid;
      });

	});

  console.log('loades');

});