import React from 'react';
import styles from './styles.module.scss'; 

import { Terminal } from 'xterm/lib/xterm';
import 'xterm/css/xterm.css';

class Shell extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: this.props.name,
			shellRef: this.props.shellRef,
			open: true
		}
	}

	componentDidMount(){
		var _this = this;
		this.setState({shellVisible: true},()=>{
			var terminal = new Terminal();
			terminal.open(this.state.shellRef.current);
			var ws = new WebSocket("ws://"+window.location.hostname+":8081");
			ws.onmessage = function(event){
				_this.parseSocketMessage(event)
				.then((result)=>{
					terminal.write(result);
				})
			}
			ws.onopen = function(){
				ws.send(JSON.stringify({"name": _this.props.name}));
				ws.send(JSON.stringify({"service": "shell"}));
				terminal.onKey((e)=>{
					ws.send(e.key);
				})
			}
		});
	}

	minimize = ()=>{
		this.setState({open: !this.state.open})
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
		return (
                <div className={styles['terminal-modal-window']}>
					<div className={styles["menu"] + " " + (this.state.open?styles["open"]:"")}>
						<div className={styles["title"]}>{this.state.name}</div>
						<div className={styles["actions"]}>
                    		<span onClick={this.minimize} className={styles['action']}><i className="fas fa-minus"></i></span>
                    		<span onClick={this.props.closeShell} className={styles['action']}><i className="fas fa-times"></i></span>
						</div>
					</div>
                    <div style={{display: (this.state.open?"block":"none")}} className={styles["terminal"]} ref={this.state.shellRef}></div>
                </div>
		);
	}
}

export default Shell;
