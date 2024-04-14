import '../styles/Room.scss';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import { Key, useEffect, useState } from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { Button } from '../components/Buttons';
import Webcam from '../components/Webcam';
import Chat from '../components/Chat';
import ModalWindow from '../components/ModalWindow';
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
import Timer from '../components/Timer';
import Loader from '../libs/loader';

interface IState {
  isCameraOn: boolean;
  isDetailsOpened: boolean;
  actionTip: string;
  inviteLinkTextBox: string;
  inviteLink: string;
  isOrganizator: boolean;
  userCharList: charListType;
  userSpecialCards: specialCardsType;
  isPrivateLobby: boolean;
  isAllowBots: boolean;
  timer: number;
  voteKickList: any;
  maxClients: number;
  kickedPlayers: any[];
  isDescriptionOpened: boolean;
  isPredictionOpened: boolean;
  modalProps: any;
  isOponentsListFocused: boolean;
  focusData: any; // sets on isOponentsListFocused
  uRemainedChars: number;
}

type specialCardsType = {
  onContestant: boolean;
  isUsed: boolean;
  text: string;
  id: number;
  type: string;
}[];

type charType = {
  type: string;
  icon: string;
  text: string;
  stage?: string; // for health only
  isRevealed: boolean;
};

const getRemainedChars = (data: any, userId: string) => {
  const alreadyRevealedCount = data.characteristics[userId].filter(
    (_: { isRevealed: boolean }) => _.isRevealed === true,
  ).length;
  const remained = (
    Math.ceil(data.currentStage / 2) * 2 -
    alreadyRevealedCount
  ).toString();
  return remained;
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
    userSpecialCards: [
      {
        isUsed: false,
        text: ' ',
        id: 1,
        type: 'specialCardIcon1',
        onContestant: false,
      },
      {
        isUsed: false,
        text: ' ',
        id: 2,
        type: 'specialCardIcon2',
        onContestant: false,
      },
    ],
    isPrivateLobby: true,
    isAllowBots: true,
    timer: 0,
    voteKickList: [],
    kickedPlayers: [],
    maxClients: 4,
    isDescriptionOpened: false,
    isPredictionOpened: false,
    isOponentsListFocused: false,
    modalProps: {
      type: '',
      description: '',
      title: '',
    },
    focusData: {},
    uRemainedChars: 2,
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
          specialCards: data.specialCards,
          conditions: data.conditions,
          revealPlayerId: data.revealPlayerId,
          timer: data.timer,
          timerEndTime: data.timerEndTime,
          finalPrediction: data.finalPrediction,
        }),
      );

      console.log('DATA: ', data);

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
        // update characteristics
        const currentPlayer = data.players.find(
          (player: { userId: string }) => player.userId === user.userId,
        );

        // update reminded
        let tipStr: string = ' ';
        if (data.revealPlayerId === user.userId) {
          const remained = getRemainedChars(data, currentPlayer.userId);
          updateState({ uRemainedChars: parseInt(remained) });
          console.log('uRemainedChars: ', remained);
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
          dispatch(
            updateLobby({
              hasFinished: data.hasFinished,
            }),
          );
        }

        if (data.finalPrediction) {
          updateState({
            isPredictionOpened: true,
          });
        }

        updateState({
          userCharList: data.characteristics[currentPlayer.userId],
          userSpecialCards: data.specialCards[currentPlayer.userId],
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

  // DATA SETS
  const kickBlockText = (player: { userId: string }) => {
    if (state.isOponentsListFocused) {
      return 'Select';
    }
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
    isAllowBots?: boolean;
    maxClients?: number;
    timer?: number;
  }
  const handleSettingsUpdate = (data: settingsUpdate) => {
    sm.emit({
      event: ClientEvents.LobbyUpdate,
      data: data,
    });
  };

  const handleUseSpecialCard = (data: {
    type: string;
    id: number;
    onContestant: boolean;
    text: string;
    contestantId?: string;
    isUsed: boolean;
  }) => {
    if (data.isUsed) {
      return;
    }

    // just focus user on contestants
    if (data.onContestant && !data.contestantId) {
      updateState({ isOponentsListFocused: true, focusData: data });
      return;
    }

    sm.emit({
      event: ClientEvents.GameUseSpecialCard,
      data: {
        userId: user.userId,
        specialCard: {
          type: data.type,
          id: data.id,
          onContestant: data.onContestant,
          text: data.text,
        },
        contestantId: data.contestantId || null,
      },
    });
    if (data.onContestant) {
      updateState({ isOponentsListFocused: false, focusData: {} });
    }
  };
  const handleOpenPreditionModal = (isOpened: boolean) => {
    updateState({
      isPredictionOpened: isOpened,
    });
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
                  onClick={() => {
                    if (state.isOponentsListFocused) {
                      handleUseSpecialCard({
                        ...state.focusData,
                        contestantId: player.userId,
                      });
                    } else {
                      handleVoteKick(player);
                    }
                  }}
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
                    typeof player === 'number'
                      ? avatarDefault
                      : gameAvatarByPosition(player.gameAvatars, 1)
                          ?.downloadUrl || player.avatar
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
                      key={index}
                      className={`char-button-wrapper ${char.isRevealed ? 'isRevealed' : 'isNotRevealed'}`}
                    >
                      <Button
                        icon={char.icon}
                        custom={true}
                        stylesheet="bottom-icon"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {state.isDetailsOpened && (
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
                            text={
                              char.isRevealed
                                ? char.type === 'health'
                                  ? char.text !== 'Абсолютно здоровий'
                                    ? `${char.text}(${char.stage})`
                                    : char.text
                                  : char.text
                                : 'Not revealed'
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
        data: {},
      });
    };
    const handleEndTurn = () => {
      if (state.uRemainedChars !== 0) {
        for (let i = 0; i < state.uRemainedChars; i++) {
          const notRevealedChars = lobby.characteristics[user.userId!].filter(
            (_: { isRevealed: boolean }) => _.isRevealed !== true,
          );
          const randomIndex = Math.floor(
            Math.random() * notRevealedChars.length,
          );
          handleCharRevial(notRevealedChars[randomIndex]);
        }
      }

      sm.emit({
        event: ClientEvents.GameEndTurn,
        data: {
          userId: user.userId,
        },
      });
    };

    return (
      <div className="action-tip-container">
        {lobby.currentStage! % 2 === 1 &&
          lobby.timer !== 0 &&
          lobby.revealPlayerId === user.userId && (
            <Timer
              timerEndTime={lobby.timerEndTime!}
              onTimerEnd={handleEndTurn}
            />
          )}
        {!state.kickedPlayers.includes(user.userId) || !lobby.hasFinished
          ? state.actionTip
          : 'You are kicked!'}
        {!state.kickedPlayers.includes(user.userId) &&
          lobby.revealPlayerId === user.userId &&
          state.uRemainedChars === 0 &&
          lobby.currentStage! % 2 === 1 &&
          !lobby.hasFinished && (
            <div>
              <div className="divider"></div>
              <div>
                <button className="start-game-btn" onClick={handleEndTurn}>
                  {'END TURN'}
                </button>
              </div>
            </div>
          )}
        {!lobby.hasStarted && (
          <div>
            <div className="divider"></div>
            <div>
              {state.isOrganizator ? (
                <button className="start-game-btn" onClick={handleGameStart}>
                  {'START GAME'}
                </button>
              ) : (
                <div>Waiting for organizator</div>
              )}
            </div>
          </div>
        )}
        {lobby.hasFinished && (
          <div>
            <div className="divider"></div>
            <div>
              <button
                className="start-game-btn"
                onClick={() => updateState({ isPredictionOpened: true })}
              >
                SHOW PREDICTION
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="room-page-container">
      <div
        className={`focus-window ${state.isOponentsListFocused ? 'darken' : ''}`}
        onClick={() => {
          updateState({ isOponentsListFocused: false });
        }}
      ></div>
      {state.isPredictionOpened && (
        <ModalWindow handleOpenModal={handleOpenPreditionModal}>
          <div className="modal-info-wrapper">
            <div className="info-title">
              <h3>Final prediction</h3>
            </div>
            <div className={`modal-info`}>
              <div className="description">
                {lobby.finalPrediction ? (
                  <p>{lobby.finalPrediction}</p>
                ) : (
                  <div className="prediction-loader">
                    <Loader color="#000" />
                    Already in process
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalWindow>
      )}
      {state.isDescriptionOpened && (
        <ModalWindow handleOpenModal={handleOpenModal}>
          <div className="modal-info-wrapper">
            <div className="info-title">
              <h3>
                {state.modalProps.type}: <span>{state.modalProps.title}</span>
              </h3>
            </div>
            <div className={`modal-info ${state.modalProps.type}`}>
              <div className="description">
                <p>{state.modalProps.description}</p>
              </div>
            </div>
          </div>
        </ModalWindow>
      )}
      <OponentsList />
      <div className="camera-list-wrapper">
        <div className="siwc-wrapper">
          {lobby.hasStarted ? (
            <div className="lobby-conditions-container">
              <div
                className="shelter-conditions-wrapper"
                onClick={() => {
                  handleModal(
                    'shelter',
                    lobby.conditions.shelter.description,
                    lobby.conditions.shelter.name,
                  );
                }}
              >
                <div className="shelter-conditions">
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

              <div
                className="catastrophe-conditions-wrapper"
                onClick={() => {
                  handleModal(
                    'catastrophe',
                    lobby.conditions.catastrophe.description,
                    lobby.conditions.catastrophe.name,
                  );
                }}
              >
                <div className="catastrophe-conditions">
                  <img
                    className="catastrophe-icon"
                    src={catastropheIcon}
                    alt={'catastrophe-icon'}
                  />
                  <p>{lobby.conditions.catastrophe.name}</p>
                </div>

                <div className="conditions-more">
                  <p>{`more>>>`}</p>
                </div>
              </div>
            </div>
          ) : null}
          {state.isOrganizator && !lobby.hasStarted && (
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
              <div className="settings-timer">
                <div className="timer-text">
                  <h3>Turn on the timer</h3>
                  <p>
                    Players should end thair turns before the time limit to
                    avoid random :D
                  </p>
                </div>
                <div className="timer-selector">
                  <select
                    name="timer"
                    value={state.timer}
                    onChange={(e) => {
                      updateState({
                        timer: parseInt(e.target.value),
                      });
                      handleSettingsUpdate({
                        key: roomId,
                        timer: parseInt(e.target.value),
                      });
                    }}
                  >
                    <option value={0}>off</option>
                    <option value={1}>1m</option>
                    <option value={2}>2m</option>
                    <option value={3}>3m</option>
                    <option value={4}>4m</option>
                    <option value={5}>5m</option>
                    <option value={6}>6m</option>
                    <option value={7}>7m</option>
                    <option value={8}>8m</option>
                  </select>
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
                    onChange={(e) => {
                      updateState({
                        maxClients: parseInt(e.target.value),
                      });
                      handleSettingsUpdate({
                        key: roomId,
                        maxClients: parseInt(e.target.value),
                      });
                    }}
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                  </select>
                </div>
              </div>
              <div className="settings-allow-bots">
                <div className="allow-bots-text">
                  <h3>Allow bots</h3>
                  <p>Bots will join the lobby based on availability</p>
                </div>
                <div className="allow-bots-btn">
                  <Toggle
                    defaultChecked={state.isAllowBots}
                    icons={false}
                    onChange={() => {
                      updateState({ isAllowBots: !state.isAllowBots });
                      handleSettingsUpdate({
                        key: roomId,
                        isAllowBots: !state.isAllowBots,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
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
          </div>
        </div>
        <div className="char-list-wrapper">
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
                    text={
                      char.type === 'health'
                        ? char.isRevealed
                          ? char.text !== 'Абсолютно здоровий'
                            ? `${char.text}(${char.stage})`
                            : char.text
                          : char.text
                        : char.text
                    }
                    onClick={() => handleCharRevial(char)}
                  />
                </div>
              );
            })}
            <div className="char-border"></div>
          </div>
          <div>
            {state.userSpecialCards.map((card, index) => {
              return (
                <div
                  key={index}
                  className={`cards-button-wrapper ${card.isUsed ? 'isRevealed' : 'isNotRevealed'}`}
                >
                  <Button
                    icon={'specialCardIcon'}
                    text={card.text}
                    onClick={() => {
                      handleUseSpecialCard({
                        type: card.type,
                        id: card.id,
                        text: card.text,
                        onContestant: card.onContestant,
                        isUsed: card.isUsed,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ActionTipContainer />
      <Chat />
    </div>
  );
};

export default RoomPage;
