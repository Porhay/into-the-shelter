import '../styles/Main.scss'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import { ROUTES } from '../constants'

interface IState {
    searchText: string;
    roomList: { name: string, id: string }[];
}

const MainPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);


    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        searchText: '',
        roomList: [{ name: 'Room 1', id: '1' }, { name: 'Room 2', id: '2' }],
    });


    // FUNCTIONS
    const handleSearchRoom = () => {
        if (state.searchText !== '') {
            updateState({searchText: ''});
        }
    }
    const joinRoom = async (roomId: string) => {
        navigate(ROUTES.ROOMS + '/' + roomId)
    }


    return (
        <div className="main-page-container">
            <div className="all-rooms-container">
                <div className="search-input">
                    <input
                        value={state.searchText}
                        type='text'
                        onChange={e => updateState({searchText: e.target.value})}
                        placeholder='Write here'
                    />
                    <button onClick={handleSearchRoom}>Search</button>
                </div>
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