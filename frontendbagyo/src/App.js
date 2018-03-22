import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginLayout from './LoginLayout';

class App extends Component {
  constructor(props){
    super(props)
    this.state={sesi:{user:'',pass:'',oleh:false}}
  }

  render() {
    const oleh=this.state.sesi.oleh
    return (
      <div>
        {
           oleh ? (
             <p>halo</p>
           ) : (
             <LoginLayout sesi={this.state.sesi}/>
           )
        }
      </div>
    );
  }
}

export default App;
