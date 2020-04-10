import React from 'react';
import styles from './styles.module.scss'; 
import LineGraph from 'components/line-graph';

import { Terminal } from 'xterm/lib/xterm';
import 'xterm/css/xterm.css';

class MachineCard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data:[],
			memmory: 0,
			cpu: 0,
			shell: false,
			shellRef: null,
			shellVisible: false
		}
	}

	componentDidMount(){
		var _this = this;
		var protocol = "ws"
		if (window.location.protocol == "https:") {
			var protocol = "wss"
		 }
		var ws = new WebSocket(protocol+"://"+window.location.hostname+":8081");
		ws.onmessage = function(message){
			var set = _this.state.data
			var obj = JSON.parse(message.data);
			var val = parseInt(obj['cpuUsage']);
			set.push(val)
			if(set.length>11) set = set.slice(1)
			_this.setState({data: set, memory: parseFloat(obj['memUsage']).toFixed(0), cpu: val});
		}
		ws.onopen = function(){
			ws.send(JSON.stringify({"service": "gateway"}));
			ws.send(JSON.stringify({"name": _this.props.config.name}));
			ws.send(JSON.stringify({"service": "monitor"}));
		}
	}

	openShell = ()=>{
		window.addShell(this.props.config.name)
	}

	parseSocketMessage = (event)=>{
		return new Promise((resolve, _)=>{
			if (event.data instanceof Blob) {
				var reader = new FileReader();
		
				reader.onload = () => {
					resolve(reader.result);
				};
		
				reader.readAsText(event.data);
			} else {
				resolve(event.data);
			}
		})
	}

	render(){
		var data = Object.assign(this.state.data);
		var points = data.map((_x,i)=>{
			return {x: 200-((10-i)*20), y:100-(_x)}
		})
		return (
			<div className={styles['machine-card']}>
				<div style={{width: "300px", height: "150px"}}>
					<LineGraph xMin={0} xMax={201} yMin={0} yMax={101} points={points} horizontalLine={1} verticalLines={1}
						backgroundColor="white" gridColor="green" lineColor="purple"/><br/>
				</div>
				<div className={styles['bottom']}>
					<div className={styles['details']}>
						<span className={styles['machine-name']}><i className="fas fa-server"></i> {this.props.config.name}</span>
						<div className={styles['footer']}>
							<div className={styles['machine-stats']}>
								<span><i className="fas fa-desktop"></i> {this.state['cpu']}%</span>
								<span><i className="fas fa-microchip"></i> {this.state['memory']}%</span>
							</div>
						</div>
					</div>
					<div className={styles['actions']}>
						<span onClick={this.openShell} className={styles['box']}><i className="fas fa-scroll"></i></span>
						<span onClick={this.openShell} className={styles['box']}><i className="fas fa-terminal"></i></span>
					</div>
				</div>
				{this.state.shell && (
					<div className={styles['terminal-modal']} style={{display: (this.state.shellVisible?'block':'none')}}>
						<div className={styles['terminal-modal-window']}>
							<span onClick={this.closeShell} className={styles['close']}><i className="fas fa-times"></i></span>
							<div ref={this.state.shellRef}></div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default MachineCard;
