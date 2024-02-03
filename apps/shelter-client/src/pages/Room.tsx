import React, { useState } from "react"
import Webcam from '../libs/Webcam'
import { TextButton } from '../libs/Buttons'

const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: false
      })
      
    return (
        <div>
            <header className="App-header">
            <TextButton onClick={() => setState({ ...state, isCameraOn: !state.isCameraOn })} text="USE CAMERA" />
            {state.isCameraOn ? <Webcam /> : null}
            </header>
        </div>
    )
}

export default RoomPage