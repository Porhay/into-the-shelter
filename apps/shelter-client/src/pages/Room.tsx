import React, { useState } from "react"
import Webcam from '../libs/Webcam'
import { TextButton, IconButton } from '../libs/Buttons'
import '../styles/Room.scss'


const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: true
    })

    return (
        <div className="webcam-container">
            <div className="webcam-btn">
                <IconButton onClick={() => setState({ ...state, isCameraOn: !state.isCameraOn })} />
            </div>
            <div className="webcam">
                {state.isCameraOn ? <Webcam /> : null}
            </div>
        </div>
    )
}

export default RoomPage