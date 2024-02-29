import '../styles/Settings.scss';
import { Button } from '../libs/Buttons';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ChangeEvent, useRef, useState } from 'react';
import { handleKeyDown } from '../helpers';
import { updateUserReq, handleUploadReq } from '../http/index'
import { updateUser } from '../redux/reducers/userSlice';

interface IState {
    inputName: string;
}

const SettingsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        inputName: '',
    });

    // FUNCTIONS
    const handleUpdateName = async () => {
        if (state.inputName === '' || state.inputName === user.displayName) return
        const updatedUser = await updateUserReq(user.userId, { displayName: state.inputName })
        dispatch(updateUser({ displayName: updatedUser.displayName }));
        updateState({ inputName: '' });
    };
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            await handleUploadReq(filesArray)
        }
    };
    const handleButtonClick = () => {
        // Trigger the click event of the hidden file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="settings-page-container">
            <div className='settings-page'>
                <div className='settings-block'>
                    <p className='settings-title'>User settings</p>
                    <p className='settings-text'>Change usename</p>

                    <div className='settings-form'>
                        <input
                            type="text"
                            placeholder={user.displayName || 'stranger'}
                            value={state.inputName}
                            onChange={e => updateState({ inputName: e.target.value })}
                            onKeyDown={e => handleKeyDown(e, handleUpdateName)}
                            className='settings-input'
                        />
                        <button className='settings-btn' onClick={handleUpdateName}>Change</button>
                    </div>
                </div>

                <div className='settings-block'>
                    <p className='settings-title'>In-game avatars settings</p>
                    <p className='settings-text'>(Note that the biggest image in the field will be your ingame avatar)</p>

                    <div className='settings-form avatar-container'>
                        <div className='avatar-block'>
                            <div className='avatar-ingame'>
                                <img className='avatar-main' src={user.avatar || avatarDefault} />
                            </div>
                            <div className='avatar-change'>
                                <div className='avatar-add'>
                                    <label htmlFor="select-image">
                                        <Button custom={true} stylesheet='add-avatar-button' icon='plusIcon' onClick={handleButtonClick} />
                                        <input
                                            ref={fileInputRef}
                                            className='select-image'
                                            style={{ display: "none" }}
                                            type="file"
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                    </label>
                                </div>
                                {
                                    user.ingameAvatars?.map(avatar => {
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

export default SettingsPage;
