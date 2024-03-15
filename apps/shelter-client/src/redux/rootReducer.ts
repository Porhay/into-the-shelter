import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import appReducer from './reducers/appSlice';
import lobbyReducer from './reducers/lobbySlice';

const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
  lobby: lobbyReducer,
});

export default rootReducer;
