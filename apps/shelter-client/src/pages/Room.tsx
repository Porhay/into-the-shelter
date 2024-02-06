import React, { useState } from "react"
import Webcam from '../libs/Webcam'
import { Button } from '../libs/Buttons'
import '../styles/Room.scss'
import avatarDefault from '../assets/images/profile-image-default.jpg';


const RoomPage = () => {
    const [state, setState] = useState({
        isCameraOn: false,
        isDetailsOpened: false,
        inviteLinkTextBox: 'http://invite-link.com',
        inviteLink: 'http://invite-link.com',
        webcamList: [1, 2, 3, 4, 5, 6, 7],
        charList: [
            { icon: 'genderIcon', text: 'Чоловік' },
            { icon: 'healthIcon', text: 'Абсолютно здоровий' },
            { icon: 'hobbyIcon', text: 'Комп. ігри' },
            { icon: 'jobIcon', text: 'Таксист' },
            { icon: 'phobiaIcon', text: 'Арахнофобія' },
            { icon: 'backpackIcon', text: 'Печиво' },
            { icon: 'additionalInfoIcon', text: 'Вміє пекти печиво' },
        ]
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
                {state.charList.map(char => {
                    return (
                        <Button icon={char.icon} text={char.text} onClick={() => console.log(char)} />
                    )
                })}
            </div>
        )
    }

    // Players webcam list with characteristics
    const WebcamList = () => {
        return (
            <div className="webcam-list">
                {state.webcamList.map(blockId => {
                    return (
                        <div className="block-container">
                            <div className="camera-block">
                                <img src={avatarDefault} />
                            </div>
                            <div className="chars-row-container">
                                <div className="chars-row" onClick={() => {
                                    setState({ ...state, isDetailsOpened: !state.isDetailsOpened })
                                }}>
                                    {state.charList.map(char => <Button icon={char.icon} bottomList={true} />)}
                                </div>
                            </div>

                            {state.isDetailsOpened ?
                                <div className="chars-block-down">
                                    <div className="char-list-container">
                                        {state.charList.map(char => {
                                            return (
                                                <Button icon={char.icon} text={char.text} onClick={() => console.log(char)} />
                                            )
                                        })}
                                    </div>
                                </div> : null}
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
                    <div className="invite-link-container" onClick={() => {
                        navigator.clipboard.writeText(state.inviteLink)
                        setState({ ...state, inviteLinkTextBox: 'Copied!' })
                        setTimeout(() => setState({ ...state, inviteLinkTextBox: state.inviteLink }), 1000)                    
                    }}>
                        {state.inviteLinkTextBox}
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