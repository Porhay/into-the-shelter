import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
