// import logo from './logo.svg';
import React from 'react';


import './App.css';

import WebcamComponent from './components/Webcam';
import Devices from './components/Devices';


function App() {
  return (
    <div className="App">
        <div className="App-header">
            <WebcamComponent />
            <Devices />
        </div>
    </div>
  );
}

export default App;
