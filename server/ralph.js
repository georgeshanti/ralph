const express = require('express')
const WebSocket = require('ws');

const { Monitor } = require('./monitor');

class Ralph{
	constructor(options){
		this.httpPort = options['http']['port'] || 8080
		this.wsPort = options['ws']['port'] || 8081
		this.app = express();
		this.wss = new WebSocket.Server({port: this.wsPort});
		this.machines = options['machines'];

		this.monitorServer = false;
		if(options['monitor'])
			this.monitorServer = new WebSocket.Server({port: 9000});
	}

	start(){
		var _this = this;
		
		//Start monitor if enabled
		if(_this.monitorServer){
			_this.monitorServer.on('connection', function connection(connection) {
				var monitor = new Monitor(connection);
			});
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

		//Start http server
		_this.app.listen(_this.httpPort);

		//Start ws server
		_this.wss.on('connection', function connection(connection) {
			var _destination = null;
			var _hostConnection = null;
			var _established = false;
			connection.on('message', (message)=>{
				if(!_established){_established=true;}
				else return;
				var obj = JSON.parse(message);
				_destination = obj['name'];
				_hostConnection = new WebSocket("ws://"+_this.machines[_destination]['host']+":"+_this.machines[_destination]['port']);
				_hostConnection.on('message',(message)=>{
					connection.send(message);
				})
				_hostConnection.on('end', ()=>{
					connection.close();
				})
			})
			connection.on('end', ()=>{
				_hostConnection.close();
			})
		});
	}
}

module.exports = { Ralph }