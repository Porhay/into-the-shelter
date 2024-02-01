import {useState} from 'react';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import '../styles/Navigation.css';


const Navigation = () => {
    const [state, setState] = useState({
        isAuth: true,
    })
    

    const Navbar = (props: any) => (
        <nav>
            <ul className="ul">
                {props.children}
            </ul>
        </nav>
    )

    const ProfileImage = () => (
        <img src={avatarDefault} className="navigation-profile-image" alt="profile image"/>
    )

    return (
        <Navbar>
            <a href="/" className="logo-a" onClick={() => console.log('Main page')}>
                Into the Shelter
            </a>
            {state.isAuth ?
                <div>
                    <li className="nav-item">
                        <ProfileImage/>
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
