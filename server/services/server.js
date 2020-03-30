const WebSocket = require('ws');

const { Monitor }	= require('./monitor');
const { createShell }		= require('./shell');

class Server{
    constructor(config){
        this.wss = new WebSocket.Server({port: config.port});
        this.ShellClass = createShell(config.shell);
    }

    start(){
        var _this = this;
        this.wss.on('connection', function connection(connection) {
            var _state = 'CONNECTED';
            var _service;
            connection.on('message', (message)=>{
                switch(_state){
                    case 'CONNECTED': {
                        var obj = JSON.parse(message);
                        switch(obj['service']){
                            case 'monitor': var monitor = new Monitor(connection);
                                            break;
                            case 'shell': var shell = new _this.ShellClass(connection);
                                            break;
                            default: connection.close();
                        }
                        _state = 'SERVICE_CONNECTED';
                        break;
                    }
                }
            })
        });
    }
}

module.exports = { Server }