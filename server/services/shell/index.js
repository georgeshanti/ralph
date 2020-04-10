var pty = require('node-pty');

function createShell(path){
	class Shell{
		constructor(connection){
			this.shell = pty.spawn(path, [], {
				name: 'xterm-color',
				cols: 78,
				rows: 47,
				cwd: process.env.HOME,
				env: process.env
			});
			this.shell.on('data', (data)=>{
				connection.send(data);
			})
			this.shell.on('exit', (data)=>{
				connection.close();
			})
			connection.on('message', (message)=>{
				this.shell.write(message);
			})
			connection.on('close', ()=>{
				this.shell.kill();
			})
		}
	}

	return Shell;
}

module.exports = { createShell }