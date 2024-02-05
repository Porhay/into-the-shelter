import { useState } from "react"
import Webcam from '../libs/Webcam'
import { IconButton } from '../libs/Buttons'
import '../styles/Room.scss'
import avatarDefault from '../assets/images/profile-image-default.jpg';


const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: false
    })

    const Avatar = () => {
        return (
            <div className="webcam-avatar">
                <img src={avatarDefault} />
            </div>
        )
    }

    return (
        <div className="webcam-container">
            <div className="webcam-btn">
                <IconButton onClick={() => setState({ ...state, isCameraOn: !state.isCameraOn })} />
            </div>
            <div className="webcam">
                {state.isCameraOn ? <Webcam /> : <Avatar />}
            </div>
        </div>
    )
}

export default RoomPage