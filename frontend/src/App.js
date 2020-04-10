import React from 'react';
import styles from './App.module.scss';

import MachineCard from './components/machine-card/index.js';
import TaskBar from './components/taskbar/index.js';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      machines: [],
      logged: false
    }
    this.inputRef=React.createRef();
  }

  componentDidMount(){
    fetch("/api/log")
    .then(res=>{
      if(res.status==200)
        this.setState({logged: true})
      else
        this.setState({logged: false})
    })
    
    fetch("/api/machines")
    .then(res=>res.json())
    .then((res)=>{
      this.setState({machines: res});
    })
  }
  login=(e)=>{
    e.preventDefault();
    fetch("/api/login",{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password: this.inputRef.current.value})
    })
    .then(res=>{
      if(res.status==200)
        window.location.reload()
    })
  }
  render(){
    var machineCards = this.state.machines.map((x, i)=>(<MachineCard config={x} key={i} />));

    return (
      <div className={styles["App"]}>
      {
        !this.state.logged &&
        (
          <div>
            <form onSubmit={this.login}>
              <label>Password:</label><input type="password" ref={this.inputRef}/><br/>
              <input type="submit"/>
            </form>
          </div>
        )
      }
        {
          this.state.logged &&
          (
            <div>
              {machineCards}
              <TaskBar />
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
