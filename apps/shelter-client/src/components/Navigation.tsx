import { useState } from 'react';
import { Timeline } from '../libs/Timeline';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import notificationsIcon from '../assets/icons/notifications-icon.png';
import intoTheShelter from '../assets/images/Into the shelter.png'
import '../styles/Navigation.scss';


const Navigation = () => {
    const [state, setState] = useState({
        isAuth: false,
        stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
        isVisible: !!window.location.pathname.split('/').includes('rooms')
    })

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
                        <a onClick={() => console.log('Login')}>
                            Login
                        </a>
                    </div>
                }
            </nav>
        </div>
    )
}

export default Navigation;
