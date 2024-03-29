import '../styles/Room.scss';
import { Key, useEffect, useState } from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { Button } from '../components/Buttons';
import Webcam from '../components/Webcam';
import Chat from '../components/Chat';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  gameAvatarByPosition,
  fillWithNumbers,
  getLobbyLink,
  defineCharsList,
  charListType,
} from '../helpers';
import useSocketManager from '../hooks/useSocketManager';
import { Listener } from '../websocket/SocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '../websocket/types';
import { useParams } from 'react-router-dom';
import { showNotification } from '../libs/notifications';
import { NOTIF_TYPE } from '../constants';
import { updateLobby } from '../redux/reducers/lobbySlice';

interface IState {
  isCameraOn: boolean;
  isDetailsOpened: boolean;
  actionTip: string;
  inviteLinkTextBox: string;
  inviteLink: string;
  isOrganizator: boolean;
  userCharList: charListType;
  isPrivateLobby: boolean;
}

type charType = {
  type: string;
  icon: string;
  text: string;
  isRevealed: boolean;
};

const RoomPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const { sm } = useSocketManager();
  const { roomId } = useParams();
  const dispatch = useDispatch();

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    isCameraOn: false,
    isDetailsOpened: false,
    actionTip: 'YOUR TURN',
    inviteLinkTextBox: lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
    inviteLink: lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
    isOrganizator: false,
    userCharList: defineCharsList(),
    isPrivateLobby: true,
  });

  useEffect(() => {
    // Join to existed lobby
    if (roomId) {
      sm.emit({
        event: ClientEvents.LobbyJoin,
        data: {
          lobbyId: roomId,
          player: user,
        },
      });
    }

    if (lobby.hasStarted) {
      const tipStr = `Open characteristics, remained: ${'2'}`;
      updateState({ actionTip: tipStr });
    }

    const onLobbyState: Listener<
      ServerPayloads[ServerEvents.LobbyState]
    > = async (data) => {
      // update players data
      dispatch(
        updateLobby({
          players: data.players,
          characteristics: data.characteristics,
          conditions: data.conditions,
        }),
      );

      if (!lobby.hasStarted) {
        // update action tip and isOrganizator
        const maxPlayers = 4; // TODO: get from lobby settings
        const tipStr = `Players: ${data.playersCount}/${maxPlayers}`;
        const isOrganizator =
          data.players.find(
            (player: { isOrganizator: boolean }) => player.isOrganizator,
          )?.userId === user.userId;
        updateState({
          actionTip: tipStr,
          isOrganizator: isOrganizator,
        });
      } else {
        console.log('STARTED:', data);

        // update characteristics
        const currentPlayer = data.players.find(
          (player: { userId: string }) => player.userId === user.userId,
        );
        updateState({
          userCharList: data.characteristics[currentPlayer.userId],
        });
      }
    };
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, [lobby.hasStarted]);

  // FUNCTIONS
  const handleCharRevial = (char: charType) => {
    sm.emit({
      event: ClientEvents.GameRevealChar,
      data: {
        userId: user.userId,
        char: char,
      },
    });
    return;
  };

  interface settingsUpdate {
    key?: string | null;
    isPrivate?: boolean;
    maxClients?: number;
  }
  const handleSettingsUpdate = (data: settingsUpdate) => {
    sm.emit({
      event: ClientEvents.LobbyUpdate,
      data: data,
    });
    return;
  };

  // COMPONENTS
  const OponentsList = () => {
    // Players webcam list with characteristics
    return (
      <div className="webcam-list">
        {fillWithNumbers(
          lobby.players.filter(
            (player: { userId: string | undefined }) =>
              player.userId !== user.userId,
          ),
        ).map((player: any, index: Key) => {
          const charList =
            typeof player === 'number'
              ? defineCharsList()
              : lobby.characteristics[player.userId] || defineCharsList();
          return (
            <div className="block-container" key={index}>
              <div className="camera-block">
                <p className="nickname-block">{player.displayName || ''}</p>
                <img
                  src={
                    typeof player === 'number' ? avatarDefault : player.avatar
                  }
                  alt="camera block"
                />
              </div>
              <div className="chars-row-container">
                <div
                  className="chars-row"
                  onClick={() => {
                    updateState({
                      isDetailsOpened: !state.isDetailsOpened,
                    });
                  }}
                >
                  {charList.map((char: charType, index: any) => (
                    <div
                      className={`char-button-wrapper ${char.isRevealed ? 'isRevealed' : 'isNotRevealed'}`}
                    >
                      <Button
                        key={index}
                        icon={char.icon}
                        custom={true}
                        stylesheet="bottom-icon"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {state.isDetailsOpened ? (
                <div className="chars-block-down">
                  <div className="char-list-container">
                    {charList.map((char: charType, index: any) => {
                      return (
                        <div
                          className={`${char.isRevealed ? 'isRevealed' : 'default-char-style'}`}
                        >
                          <Button
                            key={index}
                            icon={char.icon}
                            text={char.isRevealed ? char.text : 'Not revealed'}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  const ActionTipContainer = () => {
    const handleGameStart = () => {
      sm.emit({
        event: ClientEvents.GameStart,
        data: {
          maxClients: 4, // TODO: update in future
          isPrivate: state.isPrivateLobby,
        },
      });
    };

    return (
      <div className="action-tip-container">
        {state.actionTip}
        {!lobby.hasStarted ? (
          <div>
            <div className="divider"></div>
            <div>
              {state.isOrganizator ? (
                <button className="start-game-btn" onClick={handleGameStart}>
                  START GAME
                </button>
              ) : (
                <div>Waiting for organizator</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="room-page-container">
      <OponentsList />
      <div className="camera-list-wrapper">
        <div className="siwc-wrapper">
          {lobby.hasStarted ? (
            <div className="lobby-conditions-container">
              <div className="shelter-conditions">
                <h3>Shelter</h3>
                <p>{lobby.conditions.shelter}</p>
              </div>
              <div className="catastrophe-conditions">
                <h3>Catastrophe</h3>
                <p>{lobby.conditions.catastrophe}</p>
              </div>
            </div>
          ) : null}
          {state.isOrganizator && !lobby.hasStarted ? (
            <div className="lobby-settings-container">
              <div className="settings-is-private">
                <div className="is-private-text">
                  <h3>Private room</h3>
                  <p>Private rooms can be accessed using the room URL only</p>
                </div>
                <div className="is-private-btn">
                  <Toggle
                    defaultChecked={state.isPrivateLobby}
                    icons={false}
                    onChange={() => {
                      updateState({ isPrivateLobby: !state.isPrivateLobby });
                      handleSettingsUpdate({
                        key: roomId,
                        isPrivate: !state.isPrivateLobby,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div className="invite-webcam-char-wrapper">
            <div className="invite-webcam-wrapper">
              <div
                className="invite-link-container"
                onClick={() => {
                  navigator.clipboard.writeText(state.inviteLink);
                  showNotification(NOTIF_TYPE.SUCCESS, 'Copied to clipboard!');
                  updateState({ inviteLinkTextBox: 'Copied!' });
                  setTimeout(
                    () =>
                      updateState({
                        inviteLinkTextBox: state.inviteLink,
                      }),
                    1000,
                  );
                }}
              >
                {state.inviteLinkTextBox}
              </div>
              <div className="webcam-container">
                <div className="webcam-btn">
                  <Button
                    icon="videocamIcon"
                    onClick={() =>
                      updateState({
                        isCameraOn: !state.isCameraOn,
                      })
                    }
                  />
                </div>
                <div className="webcam">
                  {state.isCameraOn ? (
                    <Webcam />
                  ) : (
                    <div className="webcam-avatar">
                      <img
                        src={
                          gameAvatarByPosition(user.gameAvatars, 1)
                            ?.downloadUrl || user.avatar
                        }
                        alt="webcam avatar"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="char-list-container">
              {state.userCharList.map((char, index) => {
                return (
                  <div
                    className={`char-button-wrapper ${char.isRevealed ? 'isRevealed' : 'isNotRevealed'}`}
                  >
                    <Button
                      key={index}
                      icon={char.icon}
                      text={char.text}
                      onClick={() => handleCharRevial(char)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ActionTipContainer />
      <Chat />
    </div>
  );
};

export default RoomPage;
