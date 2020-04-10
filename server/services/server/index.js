const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

class Server{
    constructor(options, machines){
        this.masterPassword = options['password'];
        this.httpPort = options['port'] || 8080
        this.machines = machines;
        
		this.app = express();
		this.app.use(cookieParser());
		this.app.use(session({secret: "Shh, its a secret!"}));
        this.app.use(express.json())
        
        var _this = this;
        var checkLogin = (fn) => (req,res)=>{
			if(req.session && req.session.login){
				fn(req, res)
			}else{
				res.sendStatus(403);
				res.end();
			}
		}
		//Setup up http routes
		this.app.get('/api/machines', checkLogin((req, res)=>{
			var _machines = []
			for(let key in _this.machines){
				_machines.push({..._this.machines[key], 'name': key})
			}
			res.json(_machines);
			res.end();
		}));

		this.app.get('/api/log', (req,res)=>{
			if(req.session && req.session.login){
				res.json({login: true})
			}else{
				res.sendStatus(403);
				res.end();
			}
			res.end();
		})

		this.app.post('/api/login', (req,res)=>{
			if(req.body.password==_this.masterPassword){
				req.session.login = true
				res.json({login: true})
			}else{
				res.sendStatus(403);
				res.end();
			}
		})

		this.app.post('/logout', (req,res)=>{
				res.session.login = false
				res.json({login: false})
		})
		this.app.use(express.static('static'))
    }

    start = ()=>{
		//Start http server
		this.app.listen(this.httpPort);
    }
}

module.exports = { Server }