import { useState } from "react"
import Webcam from '../libs/Webcam'
import { Button } from '../libs/Buttons'
import '../styles/Room.scss'
import avatarDefault from '../assets/images/profile-image-default.jpg';




const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: false,
        inviteLink: 'http://invite-link.com',
        webcamList: [1, 2, 3, 4, 5, 6, 7, 8]
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

    const WebcamList = () => {
        return (
            <div className="webcam-list">
                {state.webcamList.map(blockID => {
                    return (
                        <div className="block">
                            block {blockID}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="room-page-container">
            <WebcamList />
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