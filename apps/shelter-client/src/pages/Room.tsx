import '../styles/Room.scss';
import { Key, useEffect, useState } from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { Button } from '../components/Buttons';
import Webcam from '../components/Webcam';
import Chat from '../components/Chat';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
    gameAvatarByPosition,
    fillWithNumbers,
    getLobbyLink,
    normalizePlayers,
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
    charList: charListType;
}
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
        inviteLinkTextBox:
            lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
        inviteLink: lobby.lobbyLink || roomId ? getLobbyLink(roomId) : '',
        isOrganizator: false,
        charList: defineCharsList(),
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
            if (!lobby.hasStarted) {
                // update action tip and isOrganizator
                const maxPlayers = 4; // TODO: get from lobby settings
                const tipStr = `Players: ${data.playersCount}/${maxPlayers}`;
                const isOrganizator =
                    data.players.find(
                        (player: { isOrganizator: boolean }) =>
                            player.isOrganizator,
                    )?.userId === user.userId;
                updateState({
                    actionTip: tipStr,
                    isOrganizator: isOrganizator,
                });
                // update players data
                const players = normalizePlayers(data.players);
                dispatch(updateLobby({ players: players }));

                // update characteristics
                const currentPlayer = data.players.find(
                    (player: { userId: string | undefined }) =>
                        player.userId === user.userId,
                );
                if (currentPlayer.charList) {
                    const newCharList = state.charList;
                    newCharList.forEach((playerChar) => {
                        // Find the matching characteristic by type
                        const match = currentPlayer.charList.find(
                            (char: { type: string }) =>
                                char.type === playerChar.type,
                        );
                        if (match) {
                            // Update the text
                            playerChar.text = match.text;
                        }
                    });
                    updateState({ charList: newCharList });
                }
            }
        };
        sm.registerListener(ServerEvents.LobbyState, onLobbyState);
        return () => {
            sm.removeListener(ServerEvents.LobbyState, onLobbyState);
        };
    }, [lobby.hasStarted]);

    // COMPONENTS
    const Avatar = () => {
        // Avatar. Should be updated while playing...
        return (
            <div className="webcam-avatar">
                <img
                    src={
                        gameAvatarByPosition(user.gameAvatars, 1)
                            ?.downloadUrl || user.avatar
                    }
                    alt="webcam avatar"
                />
            </div>
        );
    };

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
                            : player.charList;
                    return (
                        <div className="block-container" key={index}>
                            <div className="camera-block">
                                <img
                                    src={
                                        typeof player === 'number'
                                            ? avatarDefault
                                            : player.avatar
                                    }
                                    alt="camera block"
                                />
                            </div>
                            <div className="chars-row-container">
                                <div
                                    className="chars-row"
                                    onClick={() => {
                                        updateState({
                                            isDetailsOpened:
                                                !state.isDetailsOpened,
                                        });
                                    }}
                                >
                                    {state.charList.map((char, index) => (
                                        <Button
                                            icon={char.icon}
                                            custom={true}
                                            stylesheet="bottom-icon"
                                            key={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            {state.isDetailsOpened ? (
                                <div className="chars-block-down">
                                    <div className="char-list-container">
                                        {charList.map(
                                            (
                                                char: { icon: any; text: any },
                                                index: any,
                                            ) => {
                                                return (
                                                    <Button
                                                        key={index}
                                                        icon={char.icon}
                                                        text={char.text}
                                                        onClick={() =>
                                                            console.log(char)
                                                        }
                                                    />
                                                );
                                            },
                                        )}
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
                    // maxClients: 4
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
                                <button
                                    className="start-game-btn"
                                    onClick={handleGameStart}
                                >
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
                <div className="link-camera-wrapper">
                    <div
                        className="invite-link-container"
                        onClick={() => {
                            navigator.clipboard.writeText(state.inviteLink);
                            showNotification(
                                NOTIF_TYPE.SUCCESS,
                                'Copied to clipboard!',
                            );
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
                            {state.isCameraOn ? <Webcam /> : <Avatar />}
                        </div>
                    </div>
                </div>
                <div className="char-list-container">
                    {state.charList.map((char, index) => {
                        return (
                            <Button
                                key={index}
                                icon={char.icon}
                                text={char.text}
                                onClick={() => {
                                    console.log(char);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            <ActionTipContainer />
            <Chat />
        </div>
    );
};

export default RoomPage;
