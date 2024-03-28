import '../styles/Main.scss';
import { useEffect, useState } from 'react';
import useSocketManager from '../hooks/useSocketManager';
import { ClientEvents } from '../websocket/types';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { getAllPublicLobbies } from '../http/index';

interface IState {
  createInput: string;
  roomList: any[];
}

const MainPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const { sm } = useSocketManager();

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    createInput: '',
    roomList: [],
  });

  useEffect(() => {
    handleSetPublicLobbies();
  }, []);

  // FUNCTIONS
  const handleCreateRoom = () => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        maxClients: 4, // used as default
        organizatorId: user.userId,
      },
    });
  };

  const handleSetPublicLobbies = async () => {
    const roomList = await getAllPublicLobbies(user.userId);
    updateState({ roomList: roomList });
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
