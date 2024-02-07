import { Routes, Route } from 'react-router-dom'
import { ROUTES } from "../constants";
import MainPage from "../pages/Main";
import AuthPage from "../pages/Auth";
import RoomPage from "../pages/Room";

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
        Component: AuthPage
    },
]

export const publicRoutes = [
    {
        path: ROUTES.AUTH,
        Component: AuthPage
    },
]


const Router = () => {
    const user = { isAuth: true } // TODO: get from app state
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) =>
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
