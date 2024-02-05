import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from "../constants";
import AllRoomsPage from "../pages/SearchRoom";
import AuthPage from "../pages/Auth";
import RoomPage from "../pages/Room";

export const authRoutes = [
    {
        path: ROUTES.ALL_ROOMS,
        Component: AllRoomsPage
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
