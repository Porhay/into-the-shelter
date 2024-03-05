import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import appReducer from './reducers/appSlice';

const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
});

export default rootReducer;
