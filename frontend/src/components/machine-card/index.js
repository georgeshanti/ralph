import React from 'react';
import styles from './styles.module.scss'; 
import LineGraph from 'components/line-graph';

class MachineCard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data:[],
			memmory: 0
		}
	}

	componentDidMount(){
		var _this = this;
		var ws = new WebSocket("ws://127.0.0.1:8081");
		ws.onmessage = function(message){
			var set = _this.state.data
			var obj = JSON.parse(message.data);
			var val = parseInt(obj['cpuUsage']);
			set.push(val)
			if(set.length>11) set = set.slice(1)
			_this.setState({data: set, memory: parseFloat(obj['memUsage']).toFixed(2)});
		}
		ws.onopen = function(){
			ws.send(JSON.stringify({"name": 'local'}));
		}
	}

	render(){
		console.log(styles, {});
		var max = Math.max(...this.state.data)
		var min = Math.min(...this.state.data)
		var data = Object.assign(this.state.data);
		var points = data.map((_x,i)=>{
			return {x: 200-((10-i)*20), y:100-(_x)}
		})
		return (
			<div className={styles['machine-card']}>
				{JSON.stringify(this.props.config.name)}
				<div style={{width: "300px", height: "150px"}}>
					<LineGraph xMin={0} xMax={200} yMin={0} yMax={100} points={points} horizontalLine={1} verticalLines={1}
						backgroundColor="black" gridColor="green" lineColor="purple"/><br/>
				</div>
				<span>Free mem: {this.state['memory']}%</span>
			</div>
		);
	}
}

export default MachineCard;
