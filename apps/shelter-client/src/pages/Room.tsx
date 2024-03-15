import '../styles/Room.scss'
import { Key, useEffect, useState } from "react"
import { ROUTES } from '../constants';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { Button } from '../components/Buttons'
import Webcam from '../components/Webcam'
import Chat from '../components/Chat'
import { updateBackgroundReq } from '../http/index'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { gameAvatarByPosition, getQueryParam } from '../helpers';
import useSocketManager from '../hooks/useSocketManager';
import { Listener } from '../websocket/SocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '../websocket/types';
import { useNavigate, useParams } from 'react-router-dom';
import { updateLobby } from '../redux/reducers/lobbySlice';



interface IState {
    isCameraOn: boolean,
    isDetailsOpened: boolean,
    actionTip: string,
    inviteLinkTextBox: string,
    inviteLink: string,
    fileUrl: string,
    webcamList: any[],
    charList: { icon: string, text: string }[];
}
const RoomPage = () => {
    const user = useSelector((state: RootState) => state.user);
    const lobby = useSelector((state: RootState) => state.lobby);
    const { sm } = useSocketManager();
    const { roomId } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {

        const onChatSendMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = (data) => {
            console.log('cat', data);
        };

        const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({ color, message }) => {
            console.log('onGameMessage', message);
        };

        if (roomId) {
            console.log(roomId);

            sm.emit({
                event: ClientEvents.LobbyJoin,
                data: {
                    lobbyId: roomId,
                    player: user
                },
            });
        }

        const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
            console.log('onLobbyState', data);
            const lobbyLink = ROUTES.ROOMS + '/' + data.lobbyId
            dispatch(updateLobby({ lobbyId: `${window.location.host}${lobbyLink}` }));

            if (data.players[1]?.avatar) {
                updateState({ webcamList: [...state.webcamList, data.players[1].avatar] })
            }

        };


        sm.registerListener(ServerEvents.LobbyState, onLobbyState);
        sm.registerListener(ServerEvents.GameMessage, onGameMessage);
        sm.registerListener(ServerEvents.ChatMessage, onChatSendMessage);

        return () => {
            sm.removeListener(ServerEvents.LobbyState, onLobbyState);
            sm.removeListener(ServerEvents.GameMessage, onGameMessage);
        };
    }, []);

    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        isCameraOn: false,
        isDetailsOpened: false,
        actionTip: 'YOUR TURN',
        inviteLinkTextBox: lobby.lobbyId || '',
        inviteLink: lobby.lobbyId || '',
        fileUrl: '',
        webcamList: [1, 2, 3, 4, 5, 6],
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


    // COMPONENTS
    const Avatar = () => { // Avatar. Should be updated while playing...
        return (
            <div className="webcam-avatar">
                <img src={gameAvatarByPosition(user.gameAvatars, 1)?.downloadUrl || avatarDefault} alt='webcam avatar' />
            </div>
        )
    }
    const CharList = () => {  // User's characteristics list
        return (
            <div className="char-list-container">
                {state.charList.map((char, index) => {
                    return (
                        <Button key={index} icon={char.icon} text={char.text} onClick={() => console.log(char)} />
                    )
                })}
            </div>
        )
    }
    const WebcamList = () => { // Players webcam list with characteristics
        return (
            <div className="webcam-list">
                {state.webcamList.map((blockId: any, index: Key | null | undefined) => {
                    console.log(blockId);

                    return (
                        <div className="block-container" key={index}>
                            <div className="camera-block">
                                <img src={typeof blockId === 'number' ? avatarDefault : blockId} alt='camera block' />
                            </div>
                            <div className="chars-row-container">
                                <div className="chars-row" onClick={() => {
                                    updateState({ isDetailsOpened: !state.isDetailsOpened })
                                }}>
                                    {state.charList.map((char, index) => <Button icon={char.icon} custom={true} stylesheet="bottom-icon" key={index} />)}
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
    const ActionTipContainer = () => {
        const _updateBackground = async () => {
            const data = await updateBackgroundReq(user.userId)
            if (data) {
                updateState({ fileUrl: data })
            }
        }

        return (
            <div className="action-tip-container" onClick={() => _updateBackground()}>
                {state.actionTip}
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
                        updateState({ inviteLinkTextBox: 'Copied!' })
                        setTimeout(() => updateState({ inviteLinkTextBox: state.inviteLink }), 1000)
                    }}>
                        {state.inviteLinkTextBox}
                    </div>
                    <div className="webcam-container">
                        <div className="webcam-btn">
                            <Button icon="videocamIcon" onClick={() => updateState({ isCameraOn: !state.isCameraOn })} />
                        </div>
                        <div className="webcam">
                            {state.isCameraOn ? <Webcam /> : <Avatar />}
                        </div>
                    </div>
                </div>
                <CharList />
            </div>
            <ActionTipContainer />
            <Chat />
        </div>
    )
}

export default RoomPage