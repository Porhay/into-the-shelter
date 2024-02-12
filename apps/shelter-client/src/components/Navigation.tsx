import '../styles/Navigation.scss';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import notificationsIcon from '../assets/icons/notifications-icon.png';
import intoTheShelter from '../assets/images/Into the shelter.png';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../constants';
import { deshCount } from '../helpers';
import { Timeline } from '../libs/Timeline';
import { Button } from '../libs/Buttons';
import { RootState } from '../redux/store';
import { setUserSessionId, resetUser } from '../redux/reducers/userSlice';
import { cookieHelper } from '../helpers'


interface IState {
    isAuth: boolean;
    stages: string[];
    isVisible: boolean;
    isLoginOpened: boolean;
    isAccountOpened: boolean;
    isNotificationsOpened: boolean;
}

const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userSessionId = cookieHelper.getCookie('userSessionId')
        dispatch(setUserSessionId(userSessionId || ''));
    }, [dispatch]);
    const user = useSelector((state: RootState) => state.user);


    // LOCAL STATE
    const [state, setState] = useState({
        isAuth: true,
        stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
        isVisible: !!window.location.pathname.split('/').includes('rooms'), // TODO: update via global state
        isLoginOpened: false,
        isAccountOpened: false,
        isNotificationsOpened: false
    })
    const updateState = (prop: keyof IState, value: typeof state[keyof IState]) => setState({ ...state, [prop]: value });


    // DATASETS
    const authList = [
        { type: 'Google', icon: "googleColorIcon", action: () => loginGoogle() },
        { type: 'Discord', icon: "discordIcon" }
    ]
    const navigationList = [
        { type: 'Your profile', icon: "profileIcon", action: () => navigate(ROUTES.PROFILE) },
        { type: 'Settings', icon: "settingsIcon", action: () => navigate(ROUTES.SETTINGS) },
        { type: 'Log out', icon: "exitIcon", action: () => logout() },
    ]


    // FUNCTIONS
    const loginGoogle = () => {
        window.location.replace(ROUTES.GOOGLE_LOGIN);
    }
    const logout = () => {
        cookieHelper.removeAllCookies();
        dispatch(resetUser());
        navigate(ROUTES.WELCOME);
    }


    // COMPONENTS
    const Dropdown = (props: any) => {
        return (
            <div className='login-container'>
                {props.children}
                {props.isOpened ?
                    <div className="login-down">
                        <pre>
                            {props.text}{`\n`}
                            {deshCount(props.text)}
                        </pre>
                        {props.list.map((item: { icon: any; type: any; action: any; }) => {
                            return (
                                <div className='button-wraper'>
                                    <Button icon={item.icon} text={item.type} onClick={item.action} />
                                </div>
                            )
                        })}
                    </div> : null}
            </div>
        )
    }

    return (
        <div className='navigation-container'>
            <nav>
                <a href="/" className="logo" onClick={() => console.log('Main page')}>
                    <img src={intoTheShelter} />
                </a>
                {user.userSessionId ?
                    <>
                        <Timeline stages={state.stages} visible={state.isVisible} />
                        <ul>
                            <li>
                                <Dropdown list={[]} text="You don't have new notifications" isOpened={state.isNotificationsOpened}>
                                    <img src={notificationsIcon} className="notification-img"
                                        onClick={(() => updateState('isNotificationsOpened', !state.isNotificationsOpened))} />
                                </Dropdown>
                            </li>
                            <li>
                                <Dropdown list={navigationList} text="Hello, troobadure!" isOpened={state.isAccountOpened}>
                                    <img src={avatarDefault} className="navigation-profile-image" alt="profile image"
                                        onClick={(() => updateState('isAccountOpened', !state.isAccountOpened))} />
                                </Dropdown>
                            </li>
                        </ul>
                    </>
                    :
                    <Dropdown list={authList} text="Way to log in:" isOpened={state.isLoginOpened}>
                        <Button custom={true} stylesheet="login-btn" icon='enterIcon' text='Login'
                            onClick={(() => updateState('isLoginOpened', !state.isLoginOpened))} />
                    </Dropdown>
                }
            </nav>
        </div>
    )
}

export default Navigation;
