const WebSocket = require('ws');
const { Window } = require('./services/window');
const { Gateway } = require('./services/gateway');
const { Server } = require('./services/server');

class Ralph{
	constructor(options){
		this.wsPort = options['gateway']['port']

		this.server = new Server(options['http'], options['machines'])
		this.gateway = new Gateway(options['machines'])
		this.window = false;
		if(options['window'])
			this.window = new Window(options['window']);

		this.wss = new WebSocket.Server({port: this.wsPort});
	}

	start(){
		var _this = this;
		this.server.start()
		//Start ws server
		_this.wss.on('connection', (connection)=>{
			var wsServiceSelected = false;
			connection.on('message', (message)=>{
				if(!wsServiceSelected){
					message = JSON.parse(message)
					if(message['service']=='gateway')
						_this.gateway.connect(connection)
					else if(message['service']=='window')
						_this.window.connect(connection)
					wsServiceSelected = true
				}
			})
		});
	}
}

module.exports = { Ralph }