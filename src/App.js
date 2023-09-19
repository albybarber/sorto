// import logo from './logo.svg';
import React from 'react';

import './App.css';

import MainView from './views/Main';


function App() {
  return (
    <div className='App lego-app'>
        <header className='lego-header'>
            {/* <img className="lego-logo" src={legoLogo} alt="Lego"/> */}
        </header>
        <MainView />            
    </div>
  );
}

export default App;
