const express = require('express')
const WebSocket = require('ws');
const { Server }	= require('./services/server');

class Ralph{
	constructor(options){
		this.httpPort = options['http']['port'] || 8080
		this.wsPort = options['ws']['port'] || 8081
		this.app = express();
		this.wss = new WebSocket.Server({port: this.wsPort});
		this.machines = options['machines'];

		this.server = false;
		if(options['monitor'])
			this.server = new Server(options['monitor']);
	}

	start(){
		var _this = this;
		
		//Start monitor if enabled
		if(_this.server){
			_this.server.start();
		}

		//Setup up http routes
		_this.app.get('/api/machines', (req, res)=>{
			var _machines = []
			for(let key in _this.machines){
				_machines.push({..._this.machines[key], 'name': key})
			}
			res.json(_machines);
			res.end();
		});
		_this.app.post('/api/onboardings/execute', (req, res)=>{
			console.log(req.headers)
			var _machines = []
			for(let key in _this.machines){
				_machines.push({..._this.machines[key], 'name': key})
			}
			res.json(_machines);
			res.end();
		});
		_this.app.use(express.static('static'))

		//Start http server
		_this.app.listen(_this.httpPort);

		//Start ws server
		_this.wss.on('connection', function connection(connection) {
			var _destination = null;
			var _hostConnection = null;
			var _state = 'CLIENT_CONNECTED';
			connection.on('message', (message)=>{
				switch(_state){
					case 'CLIENT_CONNECTED': {
						var obj = JSON.parse(message);
						_destination = obj['name'];
						_hostConnection = new WebSocket("ws://"+_this.machines[_destination]['host']+":"+_this.machines[_destination]['port']);
						_hostConnection.on('message',(message)=>{
							connection.send(message);
						})
						_hostConnection.on('end', ()=>{
							connection.close();
						})
						_state = 'HOST_CONNECTED';
						break;
					}
					case 'HOST_CONNECTED': {
						_hostConnection.on('open',()=>{
							console.log("Sending service name:", message);
							_hostConnection.send(message);
							_state = 'HOST_SERVICE_CONNECTED';
						})
						break;
					}
					case 'HOST_SERVICE_CONNECTED':{
						_hostConnection.send(message);
						break;
					}
				}
			})
			connection.on('end', ()=>{
				_hostConnection.close();
			})
		});
	}
}

module.exports = { Ralph }