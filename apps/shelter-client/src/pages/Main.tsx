import '../styles/Main.scss'
import { useState } from "react"
import { useNavigate } from '../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import { ROUTES } from '../constants'

interface IState {
    createInput: string;
    roomList: { name: string, id: string }[];
}

const MainPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);


    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        createInput: '',
        roomList: [{ name: 'Room 1', id: '1' }, { name: 'Room 2', id: '2' }],
    });


    // FUNCTIONS
    const handleCreateRoom = () => {
        if (state.createInput !== '') {
            navigate(ROUTES.ROOMS + '/' + state.createInput)
            updateState({ createInput: '' });
        }
    }
    const joinRoom = async (roomId: string) => {
        navigate(ROUTES.ROOMS + '/' + roomId)
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
                    {state.roomList.map(room => {
                        return (
                            <div className="room-item" onClick={() => joinRoom(room.id)}>
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