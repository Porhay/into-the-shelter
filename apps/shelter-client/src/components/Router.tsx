import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from "../constants";
import { RootState } from '../redux/store';
import MainPage from "../pages/Main";
import AuthPage from "../pages/Auth";
import RoomPage from "../pages/Room";
import SettingsPage from "../pages/Settings";
import ProfilePage from "../pages/Profile";

export const authRoutes = [
    {
        path: ROUTES.MAIN,
        Component: MainPage
    },
    {
        path: ROUTES.ROOMS + '/:roomId',
        Component: RoomPage
    },
    {
        path: ROUTES.SETTINGS,
        Component: SettingsPage
    },
    {
        path: ROUTES.PROFILE,
        Component: ProfilePage
    },
]

export const publicRoutes = [
    {
        path: ROUTES.AUTH,
        Component: AuthPage
    },
]


const Router = () => {
    const user = useSelector((state: RootState) => state.user);
    return (
        <Routes>
            {user.userSessionId && authRoutes.map(({ path, Component }) =>
                <Route path={path} element={<Component />} />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route path={path} element={<Component />} />
            )}
            <Route path='*' element={<p>There's nothing here!</p>} />
        </Routes>
    )
}

export default Router;
