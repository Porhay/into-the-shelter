import { useState } from "react"
import '../styles/SearchRoom.scss'

interface IState {
    searchText: string;
    roomList: object[];
}

const SearchRoomPage = () => {
    const [state, setState] = useState<IState>({
        searchText: '',
        roomList: [],
    });

   const updateState = (prop: keyof IState, value: typeof state[keyof IState]) => {
    setState({...state, [prop]: value});
   }

   const handleCreateRoom = () => {
    if (state.searchText !== '') {
        const data: object[] = [{name: state.searchText}]
        updateState('roomList', data);
        updateState('searchText', '');
      }
   }
   

   
    
    return (
        <div className="page-container">
            <div className="search-input-container">
                <input
                    value={state.searchText}
                    type='text'
                    onChange={e => updateState('searchText', e.target.value)}
                    placeholder='Write here'
                />
                <button onClick={handleCreateRoom}>Search</button>
            </div>

        </div>
    )
}

export default SearchRoomPage