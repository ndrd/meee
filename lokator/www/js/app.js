var app = {};

function initMap() {
	app.map = Core.Map.init('map_record', true);
}

document.addEventListener('deviceready', function () {
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
	var map = app.map;
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
  		app.getCurrentPosition();
  	});

  	$brdcst.on('click', function (e) {
  		alert('emit to socket');
  	});

  	$record.on('click', function (e) {	
  		alert('saving track');
  	})

});