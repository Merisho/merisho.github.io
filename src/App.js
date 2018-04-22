import React, { Component } from 'react';

import Analizer from './Analizer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Texas Holdem Poker analizer
            (built with <a href="https://www.npmjs.com/package/tx-holdem">tx-holdem module</a>)
          </h1>
        </header>
        <div>
          <Analizer />          
        </div>
      </div>
    );
  }
}

export default App;
