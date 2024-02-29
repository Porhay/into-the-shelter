import avatarDefault from '../assets/images/profile-image-default.jpg';
import '../styles/Settings.scss'

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button } from '../libs/Buttons';

const SettingsPage = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="settings-page-container">
            <div className='settings-page'>
                <div className='settings-block'>
                    <p className='settings-title'>User settings</p>
                    <p className='settings-text'>Change usename</p>

                    <div className='settings-form'>
                        <input className='settings-input' type='text' placeholder='my name' />
                        <button className='settings-btn'>Change</button>
                    </div>
                </div>

                <div className='settings-block'>
                    <p className='settings-title'>
                        Ingame avatar settings
                        <span>(Note that the biggest image in the field will be your ingame avatar)</span>
                    </p>

                    <div className='settings-form avatar-container'>
                        <div className='avatar-block'>
                            <div className='avatar-ingame'>
                                <img className='avatar-main' src={user.avatar || avatarDefault} />
                            </div>
                            <div className='avatar-change'>
                                <div className='avatar-add'>
                                    <Button custom={true} stylesheet='add-avatar-button' icon='plusIcon' onClick={() => console.log('hjk')} />
                                </div>
                                {
                                    user.ingameAvatars.map(avatar => {
                                        if (avatar === 'default') {
                                            return (
                                                <div className='avatar-mini default'></div>
                                            )
                                        } else {
                                            return (
                                                <div className='avatar-mini'>
                                                    <img src={avatar} />
                                                </div>
                                            )
                                        }
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
