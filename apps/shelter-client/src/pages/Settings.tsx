import '../styles/Settings.scss'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setUsername } from '../redux/reducers/userSlice';


const SettingsPage = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setUsername('JohnDoe'));
    }, [dispatch]);


    const description: string = 'Settings page'
    return (
        <div className="settings-page-container">
            <pre>
                {description}
            </pre>
        </div>
    )
}

export default SettingsPage
