$(function() {
	var _main_map = Core.Map.init('map_record', true);

	/* record buttons */
	var $locate = $("#locate"),
		$brdcst = $("#broadcast"),
		$record = $("#record");

	var $ss 	= $("#ss");
	
	/* listeners */
	$ss.on('focusout', (e) => {
		alert('server set to: ', $(this).val());
	});

	$locate.on('click', (e) => {
		_main_map.getCurrentPosition();
	});

	$brdcst.on('click', (e) => {
		alert('emit to socket');
	});

	$record.on('click', (e) => {	
		alert('saving track');
	})


});