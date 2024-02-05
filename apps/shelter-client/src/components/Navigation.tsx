import { useState } from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import '../styles/Navigation.scss';
import intoTheShelter from '../assets/images/Into the shelter.png'
import { Timeline } from '../libs/Timeline';


const Navigation = () => {
    const [state, setState] = useState({
        isAuth: true,
        stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'],
    })

    const Navbar = (props: any) => (
        <nav>
            <ul className="ul">
                {props.children}
            </ul>
        </nav>
    )

    const ProfileImage = () => (
        <img src={avatarDefault} className="navigation-profile-image" alt="profile image" />
    )

    return (
        <Navbar>
            <a href="/" className="logo-a" onClick={() => console.log('Main page')}>
                <img src={intoTheShelter} />
            </a>
            <Timeline stages={state.stages} />
            {state.isAuth ?
                <div>
                    <li className="nav-item">
                        <ProfileImage />
                    </li>
                </div>
                :
                <div>
                    <a onClick={() => console.log('Login')}>
                        Login
                    </a>
                </div>
            }
        </Navbar>
    )
}

export default Navigation;
