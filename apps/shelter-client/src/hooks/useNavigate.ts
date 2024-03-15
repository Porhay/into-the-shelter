import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate as useNavigateOriginal } from 'react-router-dom';
import { updateApp } from '../redux/reducers/appSlice';


export default function useNavigate() {
    const navigate = useNavigateOriginal();
    const dispatch = useDispatch();

    const _isTimelineVisibleCheck = () => window.location.pathname.split('/').includes('rooms')
    const _navigateWithCheckFn = (route: string) => navigate(route);

    useEffect(() => {
        dispatch(updateApp({ showTimeline: _isTimelineVisibleCheck() }));
    }, [window.location.pathname]);

    return _navigateWithCheckFn;
}
