const { Ralph } = require('./ralph.js')

ralph = new Ralph({
	'monitor': true,
	'http':{
		'port': 8080
	},
	'ws':{
		'port': 8081
	},
	'machines':{
		'local':{
			'host': '127.0.0.1',
			'port': '9000'
		},
		'navin':{
			'host': '127.0.0.1',
			'port': '9000'
		}
	}
})

ralph.start();