import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './reducers/exampleSlice';
import userReducer from './reducers/userSlice';

const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
});

export default rootReducer;
