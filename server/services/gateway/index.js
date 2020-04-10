const WebSocket = require('ws');

class Gateway{
    constructor(machines){
        this.machines = machines;
        console.log(machines)
    }

    connect = (connection)=>{
        var _destination = null;
        var _hostConnection = null;
        var _state = 'CLIENT_CONNECTED';
        var _this = this;
        connection.on('message', (message)=>{
            switch(_state){
                case 'CLIENT_CONNECTED': {
                    var obj = JSON.parse(message);
                    _destination = obj['name'];
                    _hostConnection = new WebSocket("wss://"+_this.machines[_destination]['host']+":"+_this.machines[_destination]['port']);
                    _hostConnection.on('message',(message)=>{
                        connection.send(message);
                    })
                    _hostConnection.on('end', ()=>{
                        connection.close();
                    })
                    _hostConnection.on('open', ()=>{
                        _hostConnection.send(JSON.stringify({service: 'window'}))
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
    }
}

module.exports = { Gateway }