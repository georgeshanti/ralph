import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss'; 

import Shell from 'components/shell';
import 'xterm/css/xterm.css';

class TaskBar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
            shells: [],
            open: false,
            activeTab: 0
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
                shells: shells,
                activeTab: this.state.shells.length-1,
                open: true
            })
        }
    }

    closeShell = (ref)=>()=>{
        var shells = Object.assign(this.state.shells)
        shells = shells.filter(x=>{
            console.log(x.shellRef, ref)
            return (x.shellRef != ref)
        })
        this.setState({shells: shells}, ()=>{
            if(this.state.shells.length==0)
                this.setState({activeTab: 0, open: false})
            if(this.state.activeTab>=this.state.shells.length)
                this.setState({activeTab: this.state.shells.length-1})
        })
    }

    switchTab=(i)=>()=>{
        if(this.state.open && i==this.state.activeTab)
            this.setState({open: false})
        else
            this.setState({open: true, activeTab: i})
    }

	render(){
        var tabs = this.state.shells.map((x,i)=>{
            return (<div className={styles["tab"] + " " + ((this.state.activeTab==i)&&(this.state.open)?styles["open"]:"")} key={x.key} name={x.name} onClick={this.switchTab(i)}><i className="far fa-window-maximize"></i></div>)
        })
        var shells = this.state.shells.map((x,i)=>{
            return (<Shell key={x.key} shellRef={x.shellRef} name={x.name} closeShell={this.closeShell(x.shellRef)}/>)
        })

        var xTranslation = this.state.open?"translateX(-100%)":"translateX(-5px)";
        var yTranslation = "translateY(-"+this.state.activeTab*100+"vh)";
        var translation = xTranslation + " " + yTranslation;
        console.log(translation);
		return (
            <div className={styles["taskbar"]}>
                <div className={styles["tabs"]}>
                    {tabs}
                </div>
                <div className={styles["container"]} style={{transform: xTranslation}}>
                    <div className={styles["shells"]}
                        style={{transform: yTranslation}}>
                        {shells}
                    </div>
                </div>
            </div>
		);
	}
}

export default TaskBar;
