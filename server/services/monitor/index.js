const os = require('os');

class Monitor{
	constructor(socket){
		var first = true;
		var [ allTimeTotal, allTimeUsage ] = this.getTicks();
		var timer = setInterval(()=>{
			var [ currentTotal, currentUsage ] = this.getTicks();
			var stat = {
				cpus: 1,
				cpuUsage: ((currentUsage-allTimeUsage)/(currentTotal-allTimeTotal))*100,
				memUsage: this.getMem()
			}
			allTimeTotal = currentTotal;
			allTimeUsage = currentUsage;
			socket.send(JSON.stringify(stat));
		},1000);
		socket.on('end',()=>{
			clearInterval(timer);
		})
	}

	getTicks(){
		var raw = os.cpus();
		var cpuTotal = 0;
		var cpuUsage = 0;
		for(let cpu of raw){
			var _cpuTotal = cpu['times']['user']+cpu['times']['nice']+cpu['times']['sys']+cpu['times']['idle'];
			var _cpuUsage = _cpuTotal-cpu['times']['idle'];
			cpuTotal += _cpuTotal;
			cpuUsage += _cpuUsage;
		}
		return [cpuTotal, cpuUsage];
	}

	getMem(){
		return os.freemem()/os.totalmem()*100;
	}
}

module.exports = { Monitor }