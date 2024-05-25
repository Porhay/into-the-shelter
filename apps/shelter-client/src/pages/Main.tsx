import '../styles/Main.scss';
import { useEffect, useState } from 'react';
import useSocketManager from '../hooks/useSocketManager';
import { ClientEvents } from '../websocket/types';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { getAllPublicLobbies } from '../api/requests';
import { formatCreatedAt } from '../helpers';
import { ROUTES, gameDescription } from '../constants';
import useNavigate from '../hooks/useNavigate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import Loader from '../libs/loader';
import { Icon } from '../components/Buttons';

const statsList: { [key: string]: number } = {
  health: 44,
  hobby: 42,
  phobia: 40,
  job: 84,
  fact: 45,
  backpack: 51,
  specialCard: 12,
  catastrophe: 11,
  shelter: 7,
};

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
        maxClients: 4, // used as default
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

  // COMPONENTS
  const Chars = (props: { type: string; count: number }) => {
    const toInvert = !['shelter', 'catastrophe'].includes(props.type);

    let text = props.type.charAt(0).toUpperCase() + props.type.slice(1);
    if (props.type === 'specialCard') {
      text = 'Special card';
    }

    return (
      <div className="chars">
        <div className={`char-icon ${toInvert && 'invert'}`}>
          <Icon icon={`${props.type}Icon`} />
        </div>
        <p className="char-text">
          {text}: {props.count}
        </p>
      </div>
    );
  };

  return (
    <div className="main-page-container">
      <div className="main-page">
        <div className="main-content">
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
          <div className="scroll-down">
            <p>Game details</p>
            <hr></hr>
            <p>▼</p>
          </div>
        </div>
        <div className="details-content">
          <div className="game-details">
            <div className="game-rules">
              <h3>How to play?</h3>
              <div className="game-rules-text">
                {gameDescription
                  .split('\n')
                  .map((res) =>
                    res === 'Stage 1: Open Stage' ||
                    res === 'Stage 2: Kick Stage' ||
                    res === 'Special Cards' ||
                    res === 'Your Goal' ? (
                      <p className="rules-title">{res}</p>
                    ) : res.includes('You are participating') ? (
                      <p className="rules-text default">{res}</p>
                    ) : (
                      <p className="rules-text">{res}</p>
                    ),
                  )}
              </div>
            </div>
            <div className="game-chars">
              <h3>How many characteristics?</h3>
              <div className="chars-wrapper">
                <div className="chars-container">
                  {Object.keys(statsList)
                    .slice(0, 3)
                    .map((keyName: string, i) => (
                      <Chars type={keyName} count={statsList[keyName]} />
                    ))}
                </div>
                <div className="chars-container">
                  {Object.keys(statsList)
                    .slice(3, 6)
                    .map((keyName: string, i) => (
                      <Chars type={keyName} count={statsList[keyName]} />
                    ))}
                </div>
                <div className="chars-container">
                  {Object.keys(statsList)
                    .slice(6, 9)
                    .map((keyName: string, i) => (
                      <Chars type={keyName} count={statsList[keyName]} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
