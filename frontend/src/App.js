import React from 'react';
import styles from './App.module.scss';

import MachineCard from './components/machine-card/index.js';
import TaskBar from './components/taskbar/index.js';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {machines: []}
  }

  componentDidMount(){
    fetch("/api/machines")
    .then(res=>{
      return res.json();
    })
    .then((res)=>{
      this.setState({machines: res});
    })
  }

  render(){
    var machineCards = this.state.machines.map((x, i)=>(<MachineCard config={x} key={i} />));

    return (
      <div className={styles["App"]}>
        {machineCards}
        <TaskBar />
      </div>
    );
  }
}

export default App;
