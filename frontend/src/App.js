import React from 'react';
import logo from './logo.svg';
import './App.css';

import { ResponsiveLineCanvas } from '@nivo/line'

import MachineCard from './components/machine-card/index.js';

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
      console.log(res);
      this.setState({machines: res});
    })
  }

  render(){
    console.log(this.state);
    var machineCards = this.state.machines.map((x, i)=>(<MachineCard config={x} key={i} />));

    return (
      <div className="App">
        {machineCards}
      </div>
    );
  }
}

export default App;
