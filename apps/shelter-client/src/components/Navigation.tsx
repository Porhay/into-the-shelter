import '../styles/Navigation.scss';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import notificationsIcon from '../assets/icons/notifications-icon.png';
import intoTheShelter from '../assets/images/Into the shelter.png';
import useNavigate from '../hooks/useNavigate';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIF_TYPE, ROUTES } from '../constants';
import { Timeline } from './Timeline';
import { Button } from './Buttons';
import { RootState } from '../redux/store';
import { resetUser, updateUser } from '../redux/reducers/userSlice';
import { cookieHelper, fillGameAvatars, getLobbyLink } from '../helpers';
import { getUserReq } from '../http';
import CustomDropdown from './CustomDropdown';
import useSocketManager from '../hooks/useSocketManager';
import { Listener } from '../websocket/SocketManager';
import { ServerEvents, ServerPayloads } from '../websocket/types';
import { updateLobby } from '../redux/reducers/lobbySlice';
import { Notification, showNotification } from '../libs/notifications';
import { updateApp } from '../redux/reducers/appSlice';

interface IState {
    isAuth: boolean;
    stages: any[];
    isLoginOpened: boolean;
    isAccountOpened: boolean;
    isNotificationsOpened: boolean;
}

const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const app = useSelector((state: RootState) => state.app);
    const user = useSelector((state: RootState) => state.user);

    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void =>
        setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState({
        isAuth: true,
        stages: [
            { title: 'Open' },
            { title: 'Kick', active: true },
            { title: 'Open' },
            { title: 'Kick' },
        ],
        isLoginOpened: false,
        isAccountOpened: false,
        isNotificationsOpened: false,
    });

    useEffect(() => {
        // SOCKETS
        sm.connect();

        const onLobbyState: Listener<
            ServerPayloads[ServerEvents.LobbyState]
        > = async (data) => {
            // update global state
            const context: any = {
                lobbyLink: getLobbyLink(data.lobbyId),
            };
            context.hasStarted = data.hasStarted;
            dispatch(updateLobby(context));

            // navigate to current room
            const route = ROUTES.ROOMS + '/' + data.lobbyId;
            if (window.location.href !== route) {
                navigate(route);
            }
        };

        const onGameMessage: Listener<
            ServerPayloads[ServerEvents.GameMessage]
        > = ({ color, message }) => {
            showNotification(NOTIF_TYPE.INFO, message);
        };

        sm.registerListener(ServerEvents.LobbyState, onLobbyState);
        sm.registerListener(ServerEvents.GameMessage, onGameMessage);

        // NAVIGATION
        const userId = cookieHelper.getCookie('userId');
        const userSessionId = cookieHelper.getCookie('userSessionId');
        if (userId) {
            dispatch(updateApp({ loading: true }));
            getUserReq(String(userId))
                .then((data: any) => {
                    dispatch(
                        updateUser({
                            userId,
                            userSessionId,
                            displayName: data ? data.displayName : 'stranger',
                            avatar: data ? data.avatar : null,
                            gameAvatars: fillGameAvatars(
                                data.gameAvatars || [],
                            ),
                        }),
                    );
                })
                .finally(() => dispatch(updateApp({ loading: false })));
        }

        return () => {
            sm.removeListener(ServerEvents.LobbyState, onLobbyState);
            sm.removeListener(ServerEvents.GameMessage, onGameMessage);
        };
    }, [dispatch]);

    // DATASETS
    const displayName: string =
        user && user.displayName
            ? `Hello, ${user.displayName}!`
            : 'Hello, stranger';
    const authList = [
        {
            type: 'Google',
            icon: 'googleColorIcon',
            action: () => loginGoogle(),
        },
        { type: 'Discord', icon: 'discordIcon' },
    ];
    const navigationList = [
        {
            type: 'Your profile',
            icon: 'profileIcon',
            action: () => navigate(ROUTES.PROFILE),
        },
        {
            type: 'Settings',
            icon: 'settingsIcon',
            action: () => navigate(ROUTES.SETTINGS),
        },
        { type: 'Log out', icon: 'exitIcon', action: () => logout() },
    ];

    // FUNCTIONS
    const loginGoogle = () => {
        window.location.replace(ROUTES.GOOGLE_LOGIN);
    };
    const logout = () => {
        cookieHelper.removeAllCookies();
        dispatch(resetUser());
        navigate(ROUTES.WELCOME);
    };

    const toggleNotificationsTo = (changeTo: boolean) =>
        updateState({ isNotificationsOpened: changeTo });
    const toggleAccountTo = (changeTo: boolean) =>
        updateState({ isAccountOpened: changeTo });
    const toggleLoginTo = (changeTo: boolean) =>
        updateState({ isLoginOpened: changeTo });

    const handleCloseByType = (type: string) => {
        switch (type) {
            case 'notifications':
                return toggleNotificationsTo(false);
            case 'account':
                return toggleAccountTo(false);
            case 'login':
                return toggleLoginTo(false);
        }
    };

    // Navigation
    return (
        <div className="navigation-wrapper">
            <div className="navigation-container">
                <div
                    className="logo-container"
                    onClick={() => navigate(ROUTES.MAIN)}
                >
                    <img className="logo-image" src={intoTheShelter} alt={''} />
                </div>
                {user.userId && (
                    <div className="nav-timeline-container">
                        <Timeline
                            stages={state.stages}
                            visible={app.showTimeline}
                        />
                    </div>
                )}
                {user.userId ? (
                    <div className="nav-noty-user-container">
                        <div className="nav-noty-dropdown">
                            <CustomDropdown
                                onClose={handleCloseByType}
                                type={'notifications'}
                                list={[]}
                                text="You don't have new notifications"
                                isOpened={state.isNotificationsOpened}
                            >
                                <img
                                    src={notificationsIcon}
                                    className="notification-dropdown-img"
                                    onClick={() =>
                                        toggleNotificationsTo(
                                            !state.isNotificationsOpened,
                                        )
                                    }
                                    alt={''}
                                />
                            </CustomDropdown>
                        </div>
                        <div className="nav-user-dropdown">
                            <CustomDropdown
                                onClose={handleCloseByType}
                                type={'account'}
                                list={navigationList}
                                text={displayName}
                                isOpened={state.isAccountOpened}
                            >
                                <img
                                    src={user.avatar || avatarDefault}
                                    className="profile-dropdown-img"
                                    alt="profile image"
                                    onClick={() =>
                                        toggleAccountTo(!state.isAccountOpened)
                                    }
                                />
                            </CustomDropdown>
                        </div>
                    </div>
                ) : (
                    <div className="nav-no-user-dropdown">
                        <CustomDropdown
                            onClose={handleCloseByType}
                            type={'login'}
                            list={authList}
                            text="Way to log in:"
                            isOpened={state.isLoginOpened}
                        >
                            <Button
                                custom={true}
                                stylesheet="login-btn"
                                icon="enterIcon"
                                text="Login"
                                onClick={() =>
                                    toggleLoginTo(!state.isLoginOpened)
                                }
                            />
                        </CustomDropdown>
                    </div>
                )}
            </div>
            <Notification />
        </div>
    );
};

export default Navigation;
