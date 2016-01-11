// var showHola = function () {
// 	$("#title").text("кати");
// };

// var cb = function () {
// 	var _main_map = Core.Map.init('map_record', true);

// 	/* record buttons */
// 	var $locate = $("#locate"),
// 		$brdcst = $("#broadcast"),
// 		$record = $("#record");

// 	var $ss 	= $("#ss");
	
// 	 listeners 
// 	$ss.on('focusout', (e) => {
// 		alert('server set to: ', $(this).val());
// 	});

// 	$locate.on('click', (e) => {
// 		_main_map.getCurrentPosition();
// 	});

// 	$brdcst.on('click', (e) => {
// 		alert('emit to socket');
// 	});

// 	$record.on('click', (e) => {	
// 		alert('saving track');
// 	})
// }


$.noConflict();

function initMap() {
	var map = null;
	window.map_record = map =  new google.maps.Map(document.getElementById('map_record'), {
	   center: {lat: -34.397, lng: 150.644},
	   zoom: 5,
	   scrollwheel :false,
	   disableDefaultUI: true
	 });
	alert("negros");
	alert(jQuery);

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
  // Code that uses jQuery's $ can follow here.
  $("#title").text('negros');
});