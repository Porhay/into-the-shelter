import '../styles/Settings.scss';
import { Button } from '../libs/Buttons';
import avatarDefault from '../assets/images/profile-image-default.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ChangeEvent, useRef, useState } from 'react';
import { handleKeyDown, gameAvatarByPosition, fillGameAvatars } from '../helpers';
import { updateUserReq, handleUploadReq, deleteFileReq } from '../http/index'
import { updateUser } from '../redux/reducers/userSlice';
import penIcon from '../assets/icons/pen-icon.png';

interface IState {
    inputName: string;
}

const SettingsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const changeAvatarBackgroundRef = useRef<HTMLDivElement>(null);
    const changeAvatarIconRef = useRef<HTMLImageElement>(null);

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
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const response = await handleUploadReq(user.userId, filesArray, type)

            switch (type) {
                case 'avatar':
                    dispatch(updateUser({ avatar: response[0].downloadUrl }));
                    break;
                case 'gameAvatar':
                    dispatch(updateUser({
                        gameAvatars: fillGameAvatars([
                            ...user.gameAvatars || [],
                            ...response
                        ])
                    }));
                    break;
            }

        }
    };
    const handleGameAvatarDelete = async (fileId: string) => {
        await deleteFileReq(user.userId, fileId)
        dispatch(updateUser({
            gameAvatars: fillGameAvatars(user.gameAvatars?.filter((obj) => obj.fileId !== fileId))
        }));
    }
    const handleButtonClick = () => {
        // Trigger the click event of the hidden file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleMouseOver = (ref1: any, ref2: any) => {
        ref1.current.classList.add('show');
        ref2.current.classList.add('show');
    }
    const handleMouseOut = (ref1: any, ref2: any) => {
        ref1.current.classList.remove('show');
        ref2.current.classList.remove('show');
    }


    return (
        <div className="settings-page-container">
            <div className='settings-page'>

                <div className='settings-block-container'>
                    <div className='settings-block-userdata'>
                        <p className='settings-title'>User settings</p>
                        <hr className='settings-underline' />

                        <div className='settings-nickname'>
                            <p className='settings-text'>Change usename</p>
                            <div className='settings-form'>
                                <input
                                    type="text"
                                    placeholder={user.displayName || 'stranger'}
                                    value={state.inputName}
                                    maxLength={20}
                                    onChange={e => updateState({ inputName: e.target.value })}
                                    onKeyDown={e => handleKeyDown(e, handleUpdateName)}
                                    className='settings-input'
                                />
                                <button className='settings-btn' onClick={handleUpdateName}>Change</button>
                            </div>
                        </div>
                    </div>

                    <label htmlFor="settings-avatar">
                        <div className='settings-avatar'
                            onMouseOver={() => handleMouseOver(changeAvatarBackgroundRef, changeAvatarIconRef)}
                            onMouseOut={() => handleMouseOut(changeAvatarBackgroundRef, changeAvatarIconRef)}
                            onClick={handleButtonClick}
                        >
                            <div className='settings-avatar-background' ref={changeAvatarBackgroundRef}></div>
                            <div className='settings-avatar-change'>
                                <img className='settings-avatar-upload' ref={changeAvatarIconRef} src={penIcon} />
                            </div>
                            <img className='settings-avatar-img' src={user.avatar || avatarDefault} />
                        </div>
                        <input
                            ref={fileInputRef}
                            className='select-image'
                            style={{ display: "none" }}
                            type="file"
                            onChange={e => handleFileChange(e, 'avatar')}
                            multiple
                        />
                    </label>
                </div>

                <div className='settings-block'>
                    <p className='settings-title'>In-game avatars settings</p>
                    <hr className='settings-underline' />
                    <p className='settings-text'>(Note that the biggest image in the field will be your ingame avatar)</p>

                    <div className='settings-form avatar-container'>
                        <div className='avatar-block'>
                            <div className='avatar-ingame'>
                                <img className='avatar-main' src={gameAvatarByPosition(user.gameAvatars, 1)?.downloadUrl || user.avatar || avatarDefault} />
                                <div className='close' onClick={() => handleGameAvatarDelete(gameAvatarByPosition(user.gameAvatars, 1)?.fileId)}></div>
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
                                            onChange={e => handleFileChange(e, 'gameAvatar')}
                                            multiple
                                        />
                                    </label>
                                </div>
                                {
                                    user.gameAvatars?.filter(e => e.metadata.position !== 1).map(elem => {
                                        if (elem.downloadUrl === 'default') {
                                            return (
                                                <div className='avatar-mini default'>
                                                    {/* <div className='close'></div> */}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className='avatar-mini'>
                                                    <img src={gameAvatarByPosition(user.gameAvatars, elem.metadata.position).downloadUrl} />
                                                    <div className='close' onClick={() => handleGameAvatarDelete(gameAvatarByPosition(user.gameAvatars, elem.metadata.position).fileId)}></div>
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
