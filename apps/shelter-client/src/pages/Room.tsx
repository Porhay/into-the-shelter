import { useState } from "react"
import Webcam from '../libs/Webcam'
import { Button } from '../libs/Buttons'
import '../styles/Room.scss'
import avatarDefault from '../assets/images/profile-image-default.jpg';




const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: false,
        inviteLink: 'http://invite-link.com'
    })

    // Avatar. Should be updated while playing...
    const Avatar = () => {
        return (
            <div className="webcam-avatar">
                <img src={avatarDefault} />
            </div>
        )
    }

    // User's characteristics list
    const CharList = () => {
        return (
            <div className="char-list-container">
                <Button icon="genderIcon" onClick={() => console.log('halo')} />
                <Button icon="healthIcon" onClick={() => console.log('halo')} />
                <Button icon="hobbyIcon" onClick={() => console.log('halo')} />
                <Button icon="jobIcon" onClick={() => console.log('halo')} />
                <Button icon="phobiaIcon" onClick={() => console.log('halo')} />
                <Button icon="backpackIcon" onClick={() => console.log('halo')} />
            </div>
        )
    }

    return (
        <div className="room-page-container">
            <div className="camera-list-wrapper">
                <div className="link-camera-wrapper">
                    <div className="invite-link-container">
                        {state.inviteLink}
                    </div>
                    <div className="webcam-container">
                        <div className="webcam-btn">
                            <Button icon="videocamIcon" onClick={() => setState({ ...state, isCameraOn: !state.isCameraOn })} />
                        </div>
                        <div className="webcam">
                            {state.isCameraOn ? <Webcam /> : <Avatar />}
                        </div>
                    </div>
                </div>
                <CharList />
            </div>
            
        </div>
        
    )
}

export default RoomPage