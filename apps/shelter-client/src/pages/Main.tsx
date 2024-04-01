import '../styles/Main.scss';
import { useEffect, useState } from 'react';
import useSocketManager from '../hooks/useSocketManager';
import { ClientEvents } from '../websocket/types';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { getAllPublicLobbies } from '../http/index';
import { formatCreatedAt } from '../helpers';
import { ROUTES } from '../constants';
import useNavigate from '../hooks/useNavigate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import Loader from '../libs/loader';

interface IState {
  createInput: string;
  roomList: any[];
  isRoomsListLoading: boolean;
}

const MainPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { sm } = useSocketManager();

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    createInput: '',
    roomList: [],
    isRoomsListLoading: false,
  });

  useEffect(() => {
    handleSetPublicLobbies();
  }, []);

  // FUNCTIONS
  const handleCreateRoom = () => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        maxClients: 8, // used as default
        organizatorId: user.userId,
      },
    });
  };

  const handleSetPublicLobbies = async () => {
    updateState({ isRoomsListLoading: true });
    const roomList = await getAllPublicLobbies(user.userId);

    // Sort the array in descending order based on the createdAt
    const sortedRoomList: any[] = roomList.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Get only the first 4 items (TODO: add pagination in future)
    const newestRooms = sortedRoomList.slice(0, 4);

    updateState({ roomList: newestRooms });
    updateState({ isRoomsListLoading: false });
  };

  return (
    <div className="main-page-container">
      <div className="all-rooms-container">
        <div className="create-room-container">
          <button
            className="reload-btn"
            onClick={() => handleSetPublicLobbies()}
          >
            <FontAwesomeIcon className="reload-icon" icon={faRotateRight} />
          </button>
          <div className="explore-text">EXPLORE GAMES OR CREATE </div>
          <button className="new-room-btn" onClick={handleCreateRoom}>
            NEW ROOM
          </button>
        </div>

        <hr />
        <div className="rooms-list">
          {state.isRoomsListLoading ? (
            <div className="rooms-list-loader">
              <Loader />
            </div>
          ) : (
            state.roomList.map((room, index) => {
              return (
                <div
                  className="room-item"
                  key={index}
                  onClick={() => {
                    // navigate to current room
                    const route = ROUTES.ROOMS + '/' + room.key;
                    navigate(route);
                  }}
                >
                  <div className="room-text">{room.key}</div>
                  <div className="room-text">
                    {formatCreatedAt(room.createdAt)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
