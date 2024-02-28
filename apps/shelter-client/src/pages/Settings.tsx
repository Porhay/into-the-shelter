import '../styles/Settings.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState } from 'react';
import { handleKeyDown } from '../helpers';
import { updateUserRequest } from '../http/index'
import { updateUser } from '../redux/reducers/userSlice';


interface IState {
    inputName: string;
}

const SettingsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        inputName: '',

    });

    // FUNCTIONS
    const handleUpdateName = async () => {
        if (state.inputName === '' || state.inputName === user.displayName) return
        const updatedUser = await updateUserRequest(user.userId, { displayName: state.inputName })
        dispatch(updateUser({ displayName: updatedUser.displayName }));
        updateState({ inputName: '' });
    }

    return (
        <div className="settings-page">
            <div className='settings-page-container'>
                <div className='settings-page-block'>
                    <p className='settings-page-title'>User settings</p>
                    <p className='settings-page-text'>Change usename</p>

                    <div className='settings-page-form'>
                        <input
                            type="text"
                            placeholder={user.displayName || 'stranger'}
                            value={state.inputName}
                            onChange={e => updateState({ inputName: e.target.value })}
                            onKeyDown={e => handleKeyDown(e, handleUpdateName)}
                            className='settings-page-input'
                        />
                        <button onClick={handleUpdateName} className='settings-page-btn'>Change</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;
