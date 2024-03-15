import '../styles/Main.scss'
import useNavigate from '../hooks/useNavigate';
import { useEffect, useState } from "react"
import { useDispatch } from 'react-redux';
import { ROUTES } from '../constants'
import useSocketManager from '../hooks/useSocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '../websocket/types';
import { getQueryParam } from '../helpers';
import { Listener } from '../websocket/SocketManager';
import { updateLobby } from '../redux/reducers/lobbySlice';


interface IState {
    createInput: string;
    roomList: { name: string, id: string }[];
}

const MainPage = () => {
    const { sm } = useSocketManager();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        sm.connect();

        sm.socket.on(ServerEvents.Pong, (data: any) => {
            console.log('Pong', data);
        });



        const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {

            const lobbyLink = ROUTES.ROOMS + '/' + data.lobbyId
            dispatch(updateLobby({ lobbyId: `${window.location.host}${lobbyLink}` }));
            navigate(lobbyLink);
        };

        const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({ color, message }) => {
            console.log('onGameMessage', message);

        };

        sm.registerListener(ServerEvents.LobbyState, onLobbyState);
        sm.registerListener(ServerEvents.GameMessage, onGameMessage);

        return () => {
            sm.removeListener(ServerEvents.LobbyState, onLobbyState);
            sm.removeListener(ServerEvents.GameMessage, onGameMessage);
        };
    }, []);


    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        createInput: '',
        roomList: [{ name: 'Room 1', id: '1' }],
    });



    // FUNCTIONS
    const handleCreateRoom = () => {
        console.log('handleCreateRoom');

        sm.emit({
            event: ClientEvents.LobbyCreate,
            data: {
                mode: 'duo'
            },
        });
    }

    return (
        <div className="main-page-container">
            <div className="all-rooms-container">
                <div className="create-input">
                    <input
                        value={state.createInput}
                        type='text'
                        onChange={e => updateState({ createInput: e.target.value })}
                        placeholder='Write here...'
                    />
                    <button onClick={handleCreateRoom}>NEW ROOM</button>
                </div>

                <h2>EXPLORE GAMES</h2>
                <hr />
                <div className="rooms-list">
                    {state.roomList.map((room, index) => {
                        return (
                            <div className="room-item" key={index}>
                                <div className="room-text">{room.name}</div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

export default MainPage