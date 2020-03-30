import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss'; 

import Shell from 'components/shell';
import 'xterm/css/xterm.css';

class TaskBar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
            shells: []
		}
    }
    componentDidMount(){
        window.addShell = (name)=>{
            var shells = Object.assign(this.state.shells);
            shells.push({
                name: 'local',
                shellRef: React.createRef(), 
                key: Math.random()*100
            })
            this.setState({
                shells: shells
            })
        }
    }

    closeShell = (ref)=>()=>{
        var shells = Object.assign(this.state.shells)
        shells = shells.filter(x=>{
            console.log(x.shellRef, ref)
            return (x.shellRef != ref)
        })
        this.setState({shells: shells})
    }

	render(){
        var shells = this.state.shells.map((x)=>{
            return (<Shell key={x.key} shellRef={x.shellRef} name={x.name} closeShell={this.closeShell(x.shellRef)}/>)
        })
		return (
            <div className={styles["taskbar"]}>
                <div className={styles["tabs"]}>
                    {shells}
                </div>
            </div>
		);
	}
}

export default TaskBar;
