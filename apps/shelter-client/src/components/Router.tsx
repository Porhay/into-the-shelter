import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from "../constants";
import { RootState } from '../redux/store';
import MainPage from "../pages/Main";
import WelcomePage from "../pages/Welcome";
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
        path: ROUTES.WELCOME,
        Component: WelcomePage
    },
]


const Router = () => {
    const user = useSelector((state: RootState) => state.user);
    return (
        <Routes>
            {user.userId && authRoutes.map(({ path, Component }) =>
                <Route path={path} element={<Component />} key={path} />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route path={path} element={<Component />} key={path} />
            )}
            <Route path='*' element={<WelcomePage />} />
        </Routes>
    )
}

export default Router;
