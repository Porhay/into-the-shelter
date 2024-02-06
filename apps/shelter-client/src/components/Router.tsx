import { Routes, Route } from 'react-router-dom'
import { ROUTES } from "../constants";
import SearchRoomPage from "../pages/SearchRoom";
import AuthPage from "../pages/Auth";
import RoomPage from "../pages/Room";

export const authRoutes = [
    {
        path: ROUTES.SEARCH_ROOM,
        Component: SearchRoomPage
    },
    {
        path: ROUTES.ROOM,
        Component: RoomPage
    },
    {
        path: ROUTES.SETTINGS,
        Component: AuthPage
    },
]

export const publicRoutes = [
    {
        path: ROUTES.LOGIN,
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
