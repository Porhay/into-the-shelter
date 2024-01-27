import React, { useState } from 'react';
import logo from './logo-white.png';
import './App.css';
import Webcam from './libs/Webcam'
import {TextButton} from './libs/Buttons'

function App() {
  const [state, setState] = useState({
    isCameraOn: false
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
        <TextButton onClick={() => setState({...state, isCameraOn: !state.isCameraOn})} text="USE CAMERA" />
        {state.isCameraOn ? <Webcam /> : null}
      </header>
    </div>
  );
}

export default App;
