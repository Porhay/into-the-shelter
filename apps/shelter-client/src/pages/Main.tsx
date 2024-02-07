import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {ROUTES} from '../constants'
import '../styles/Main.scss'

interface IState {
    searchText: string;
    roomList: {name: string, id: string}[];
}

const MainPage = () => {
    const navigate = useNavigate()
    const [state, setState] = useState<IState>({
        searchText: '',
        roomList: [{name: 'Room 1', id: '1'}, {name: 'Room 2', id: '2'}],
    });

   const updateState = (prop: keyof IState, value: typeof state[keyof IState]) => {
    setState({...state, [prop]: value});
   }

   const handleSearchRoom = () => {
    if (state.searchText !== '') {
        updateState('searchText', '');
      }
   }

   const joinRoom = async (roomId: string) => {
        navigate(ROUTES.ROOMS + '/' + roomId)
    }
    
    return (
        <div className="page-container">
            <div className="all-rooms-container">
                <div className="search-input">
                    <input
                        value={state.searchText}
                        type='text'
                        onChange={e => updateState('searchText', e.target.value)}
                        placeholder='Write here'
                    />
                    <button onClick={handleSearchRoom}>Search</button>
                </div>
                <div className="rooms-list">
                    {state.roomList.map(room => {
                        return(
                            <div className="room-item" onClick={() =>joinRoom(room.id)}>
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