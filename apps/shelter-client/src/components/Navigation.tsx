import '../styles/Navigation.scss';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import notificationsIcon from '../assets/icons/notifications-icon.png';
import storeIcon from '../assets/icons/store-icon.png';
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
import { getUser } from '../api/requests';
import CustomDropdown from './CustomDropdown';
import useSocketManager from '../hooks/useSocketManager';
import { Listener } from '../websocket/SocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '../websocket/types';
import { resetLobby, updateLobby } from '../redux/reducers/lobbySlice';
import { Notification, showNotification } from '../libs/notifications';
import { updateApp } from '../redux/reducers/appSlice';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalWindow from './ModalWindow';
import ActivityLogs from './ActivityLogs';

interface IState {
  isLoginOpened: boolean;
  isAccountOpened: boolean;
  isNotificationsOpened: boolean;
  isActivityLogsOpened: boolean;
}

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sm } = useSocketManager();

  const user = useSelector((state: RootState) => state.user);
  const app = useSelector((state: RootState) => state.app);
  const lobby = useSelector((state: RootState) => state.lobby);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState({
    isLoginOpened: false,
    isAccountOpened: false,
    isNotificationsOpened: false,
    isActivityLogsOpened: false,
  });

  useEffect(() => {
    // SOCKETS
    sm.connect();

    const onLobbyState: Listener<
      ServerPayloads[ServerEvents.LobbyState]
    > = async (data) => {
      // update global state
      const context: any = {
        lobbyKey: data.lobbyId,
        lobbyLink: getLobbyLink(data.lobbyId),
        hasStarted: data.hasStarted,
        currentStage: data.currentStage,
        stages: data.stages,
      };
      dispatch(updateLobby(context));

      // navigate to current room
      const route = ROUTES.ROOMS + '/' + data.lobbyId;
      if (window.location.href !== route) {
        navigate(route);
      }
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({
      color,
      message,
    }) => {
      showNotification(NOTIF_TYPE.INFO, message);
    };

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);

    // NAVIGATION
    const userId = cookieHelper.getCookie('userId');
    const userSessionId = cookieHelper.getCookie('userSessionId');
    if (userId) {
      dispatch(updateApp({ loading: true }));
      getUser(String(userId))
        .then((data: any) => {
          dispatch(
            updateUser({
              userId,
              userSessionId,
              displayName: data ? data.displayName : 'stranger',
              avatar: data ? data.avatar : null,
              gameAvatars: fillGameAvatars(data.gameAvatars || []),
              coins: data.coins,
              userProducts: data.userProducts,
            }),
          );
          console.log('user: ', data);
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
  const handleOpenModal = (isOpened: boolean) => {
    updateState({
      isActivityLogsOpened: isOpened,
    });
  };
  const handleLogoClick = () => {
    const handleLobbyLeave = () => {
      sm.emit({
        event: ClientEvents.LobbyLeave,
        data: {},
      });
    };
    if (lobby.hasStarted && !lobby.hasFinished) {
      const result = window.confirm(
        'Are you sure you want to leave the game? Any progress will be lost!',
      );
      if (result) {
        dispatch(resetLobby());
        handleLobbyLeave();
        navigate(ROUTES.MAIN);
        return;
      } else {
        return;
      }
    } else {
      dispatch(resetLobby());
      handleLobbyLeave();
      navigate(ROUTES.MAIN);
    }
  };

  // Navigation
  return (
    <div>
      <div className="navigation-wrapper">
        <div className="navigation-container">
          <div className="logo-container" onClick={handleLogoClick}>
            <img className="logo-image" src={intoTheShelter} alt={''} />
          </div>
          {user.userId && (
            <div className="nav-timeline-container">
              <Timeline />
            </div>
          )}
          {user.userId && (
            <div
              className={`game-history-container ${app.showTimeline ? '' : 'invisible'}`}
              onClick={() => handleOpenModal(true)}
            >
              <FontAwesomeIcon icon={faClockRotateLeft} />
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
                      toggleNotificationsTo(!state.isNotificationsOpened)
                    }
                    alt={''}
                  />
                </CustomDropdown>
              </div>
              <div className="nav-noty-store">
                <img
                  src={storeIcon}
                  className="store-img"
                  onClick={() => navigate(ROUTES.STORE)}
                  alt={''}
                />
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
                    alt="profile"
                    onClick={() => toggleAccountTo(!state.isAccountOpened)}
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
                  onClick={() => toggleLoginTo(!state.isLoginOpened)}
                />
              </CustomDropdown>
            </div>
          )}
        </div>
        <Notification />
      </div>
      {state.isActivityLogsOpened ? (
        <ModalWindow handleOpenModal={handleOpenModal}>
          <ActivityLogs />
        </ModalWindow>
      ) : null}
    </div>
  );
};

export default Navigation;
