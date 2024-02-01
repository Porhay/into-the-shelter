import { useState } from 'react';
import './styles/App.css';
import Webcam from './libs/Webcam'
import {TextButton} from './libs/Buttons'
import Navigation from './components/Navigation';

function App() {
  const [state, setState] = useState({
    isCameraOn: false
  })

  return (
    <div className="App">
      <Navigation />
      <header className="App-header">
        <TextButton onClick={() => setState({...state, isCameraOn: !state.isCameraOn})} text="USE CAMERA" />
        {state.isCameraOn ? <Webcam /> : null}
      </header>
    </div>
  );
}

export default App;
