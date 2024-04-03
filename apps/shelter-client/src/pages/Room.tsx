import '../styles/Room.scss';
import { Key, useEffect, useState } from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { Button } from '../components/Buttons';
import Webcam from '../components/Webcam';
import Chat from '../components/Chat';
import ModalWindow from '../components/ModalWindow';
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
import shelterIcon from '../assets/images/shelter-icon.png';
import catastropheIcon from '../assets/images/catastrophe-icon.png';

interface IState {
  isCameraOn: boolean;
  isDetailsOpened: boolean;
  actionTip: string;
  inviteLinkTextBox: string;
  inviteLink: string;
  isOrganizator: boolean;
  userCharList: charListType;
  isPrivateLobby: boolean;
  voteKickList: any;
  maxClients: number;
  kickedPlayers: any[];
  isDescriptionOpened: boolean;
  modalProps: any;
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
    actionTip: ' . . . ',
    inviteLinkTextBox: lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
    inviteLink: lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
    isOrganizator: false,
    userCharList: defineCharsList(),
    isPrivateLobby: true,
    voteKickList: [],
    kickedPlayers: [],
    maxClients: 4,
    isDescriptionOpened: false,
    modalProps: {
      type: '',
      description: '',
      title: '',
    },
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
        const tipStr = `Players: ${data.playersCount}/${state.maxClients}`;
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

        // update reminded
        let tipStr: string = ' ';
        if (data.revealPlayerId === user.userId) {
          // eslint-disable-next-line
          const alreadyRevealedCount = data.characteristics[currentPlayer.userId].filter((_: { isRevealed: boolean }) =>
            _.isRevealed === true).length;
          const remained = (
            Math.ceil(data.currentStage / 2) * 2 -
            alreadyRevealedCount
          ).toString();
          tipStr = `Open your characteristics, remained: ${remained}`;
        } else {
          const revealPlayer = data.players.find(
            (player: { userId: string }) =>
              player.userId === data.revealPlayerId,
          );
          tipStr = `Waiting for ${revealPlayer.displayName} to open characteristics`;
        }

        // on kick round
        if (data.currentStage % 2 === 0) {
          tipStr = 'Kick stage! Choose the weakest and vote :D';
          updateState({
            voteKickList: data.voteKickList,
          });
        }

        // on finish game
        if (data.hasFinished) {
          tipStr = 'Game over!';
        }

        updateState({
          userCharList: data.characteristics[currentPlayer.userId],
          actionTip: tipStr,
          kickedPlayers: data.kickedPlayers,
        });
      }
    };
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, [lobby.hasStarted, lobby.hasFinished, state.maxClients, dispatch]);

  useEffect(() => {}, [state.isDescriptionOpened]);

  // DATA SETS
  const kickBlockText = (player: { userId: string }) => {
    return state.kickedPlayers.includes(player.userId)
      ? 'Kicked'
      : !lobby.hasStarted || lobby.hasFinished || lobby.currentStage! % 2 === 1
        ? ''
        : 'Vote';
  };

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
  const handleVoteKick = (player: any) => {
    if (typeof player === 'number') {
      return;
    }
    sm.emit({
      event: ClientEvents.GameVoteKick,
      data: {
        userId: user.userId, // who votes
        contestantId: player.userId, // vote for
      },
    });
    return;
  };
  const handleOpenModal = (isOpened: boolean) => {
    updateState({
      isDescriptionOpened: isOpened,
    });
  };
  const handleModal = (
    condition: string,
    description: string,
    title?: string,
  ) => {
    handleOpenModal(true);
    updateState({
      modalProps: {
        type: condition,
        description: description,
        title: title,
      },
    });
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
                <div
                  className={`kick-block ${state.kickedPlayers.includes(player.userId) ? 'kicked' : ''}`}
                  onClick={() => handleVoteKick(player)}
                >
                  {kickBlockText(player)}
                </div>
                <p className="nickname-block">
                  {player.displayName || ''}
                  {state.voteKickList.some(
                    (item: { userId: string | undefined }) =>
                      item.userId === player.userId,
                  ) ? (
                    <p className="vote-block">voted</p>
                  ) : null}
                </p>

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
                          key={index}
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
          maxClients: state.maxClients,
          isPrivate: state.isPrivateLobby,
        },
      });
    };

    return (
      <div className="action-tip-container">
        {!state.kickedPlayers.includes(user.userId) || !lobby.hasFinished
          ? state.actionTip
          : 'You are kicked!'}
        {!lobby.hasStarted || lobby.hasFinished ? (
          <div>
            <div className="divider"></div>
            <div>
              {state.isOrganizator ? (
                <button className="start-game-btn" onClick={handleGameStart}>
                  {lobby.hasFinished ? 'RESTART' : 'START GAME'}
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
      {state.isDescriptionOpened ? (
        <ModalWindow
          handleOpenModal={handleOpenModal}
          type={state.modalProps.type}
          description={state.modalProps.description}
          title={state.modalProps.title}
        />
      ) : null}
      <OponentsList />
      <div className="camera-list-wrapper">
        <div className="siwc-wrapper">
          {lobby.hasStarted ? (
            <div className="lobby-conditions-container">
              <div className="shelter-conditions-wrapper">
                <div
                  className="shelter-conditions"
                  onClick={() => {
                    handleModal(
                      'бункер',
                      lobby.conditions.shelter.description,
                      lobby.conditions.shelter.name,
                    );
                  }}
                >
                  <img
                    className="shelter-icon"
                    src={shelterIcon}
                    alt={'shelter-icon'}
                  />
                  <p>{lobby.conditions.shelter.name}</p>
                </div>
                <div className="conditions-more">
                  <p>{`more>>>`}</p>
                </div>
              </div>

              <div className="catastrophe-conditions-wrapper">
                <div className="catastrophe-conditions">
                  <img
                    className="catastrophe-icon"
                    src={catastropheIcon}
                    alt={'catastrophe-icon'}
                  />
                  <p>{lobby.conditions.catastrophe.name}</p>
                </div>

                <div
                  className="conditions-more"
                  onClick={() => {
                    handleModal(
                      'катастрофа',
                      lobby.conditions.catastrophe.description,
                      lobby.conditions.catastrophe.name,
                    );
                  }}
                >
                  <p>{`more>>>`}</p>
                </div>
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
              <div className="settings-max-players">
                <div className="max-players-text">
                  <h3>Maximum players</h3>
                  <p>How many players can join the game</p>
                </div>
                <div className="max-players-selector">
                  <select
                    name="maxClients"
                    value={state.maxClients}
                    onChange={(e) =>
                      updateState({
                        maxClients: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4} selected>
                      4
                    </option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                  </select>
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
                    <>
                      <div
                        className={`user-kicked-block ${
                          state.kickedPlayers.includes(user.userId)
                            ? 'kicked'
                            : ''
                        }`}
                      >
                        {state.kickedPlayers.includes(user.userId)
                          ? 'Kicked'
                          : ''}
                      </div>
                      <div className={`webcam-avatar`}>
                        <img
                          src={
                            gameAvatarByPosition(user.gameAvatars, 1)
                              ?.downloadUrl || user.avatar
                          }
                          alt="webcam avatar"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="char-list-container">
              {state.userCharList.map((char, index) => {
                return (
                  <div
                    key={index}
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
