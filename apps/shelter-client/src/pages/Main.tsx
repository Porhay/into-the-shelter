import '../styles/Main.scss';
import { useState } from 'react';
import useSocketManager from '../hooks/useSocketManager';
import { ClientEvents } from '../websocket/types';

interface IState {
  createInput: string;
  roomList: { name: string; id: string }[];
}

const MainPage = () => {
  const { sm } = useSocketManager();

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    createInput: '',
    roomList: [{ name: 'PUBLIC GAMES WILL BE IMPLEMENTED SOON', id: '1' }],
  });

  // FUNCTIONS
  const handleCreateRoom = () => {
    // TODO: add room in db and set here if public
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        maxClients: 4,
      },
    });
  };

  return (
    <div className="main-page-container">
      <div className="all-rooms-container">
        <div className="create-room-container">
          <div className="explore-text">EXPLORE GAMES OR CREATE </div>
          <button onClick={handleCreateRoom}>NEW ROOM</button>
        </div>

        <hr />
        <div className="rooms-list">
          {state.roomList.map((room, index) => {
            return (
              <div className="room-item" key={index}>
                <div className="room-text">{room.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
