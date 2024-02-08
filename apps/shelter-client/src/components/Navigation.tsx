import { useState } from 'react';
import { Timeline } from '../libs/Timeline';
import { Button } from '../libs/Buttons';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import notificationsIcon from '../assets/icons/notifications-icon.png';
import intoTheShelter from '../assets/images/Into the shelter.png'
import '../styles/Navigation.scss';


interface IState {
    isAuth: boolean;
    stages: string[];
    isVisible: boolean;
    isLoginOpened: boolean;
}

const Navigation = () => {
    const [state, setState] = useState({
        isAuth: false,
        stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
        isVisible: !!window.location.pathname.split('/').includes('rooms'),
        isLoginOpened: false
    })

    const updateState = (prop: keyof IState, value: typeof state[keyof IState]) => {
        setState({ ...state, [prop]: value });
    }

    const authList = [
        { type: 'Google', icon: "googleColorIcon" },
        { type: 'Discord', icon: "discordIcon" }
    ]

    return (
        <div className='navigation-container'>
            <nav>
                <a href="/" className="logo" onClick={() => console.log('Main page')}>
                    <img src={intoTheShelter} />
                </a>
                {state.isAuth ?
                    <>
                        <Timeline stages={state.stages} visible={state.isVisible} />
                        <ul>
                            <li><img src={notificationsIcon} className="notification-img" /></li>
                            <li><img src={avatarDefault} className="navigation-profile-image" alt="profile image" /></li>
                        </ul>
                    </>
                    :
                    <div className='login-container'>
                        <Button custom={true} stylesheet="login-btn" icon='enterIcon' text='Login'
                            onClick={(() => updateState('isLoginOpened', !state.isLoginOpened))} />
                        {state.isLoginOpened ?
                            <div className="login-down">
                                <pre>
                                    Way to log in:{`\n`}
                                    -------------
                                </pre>
                                {authList.map(item => {
                                    return (
                                        <div className='button-wraper'>
                                            <Button icon={item.icon} text={item.type} onClick={() => console.log(item.type)} />
                                        </div>
                                    )
                                })}
                            </div> : null}
                    </div>
                }
            </nav>
        </div>
    )
}

export default Navigation;
