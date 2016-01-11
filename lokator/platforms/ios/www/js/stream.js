document.addEventListener("deviceready", onDeviceReady, false);

var strmr_conf = {
	servers : ['http://192.168.0.6:8001'],
	getHost : () => {
		return 
	}
}


var Stream = {
	socket : null,

	init : function (conf) {
		var sckt = st.socket;
		sckt = io.connect(st.getHost(conf.servers));

		sckt.on ('connect', (e) => {
			alert('conectado');
		});

	},
	_getHost : function(servers) {
		return servers[Math.floor(Math.random() * servers.length)];
	}


}

function onDeviceReady() {
    alert("REady!");
}