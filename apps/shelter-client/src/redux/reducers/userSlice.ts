import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  isAuth: boolean;
  userSessionId: string;
  // Add other user-related properties as needed
}

const initialState: UserState = {
  username: '',
  isAuth: false,
  userSessionId: ''
  // Initialize other properties as needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUserSessionId: (state, action: PayloadAction<string>) => {
      state.userSessionId = action.payload;
    },
    resetUser: (state) => {
      // Reset all properties to their initial values or set them to null/undefined
      state.username = initialState.username;
      state.isAuth = initialState.isAuth;
      state.userSessionId = initialState.userSessionId;
    },
  },
});

export const { setUsername, setIsAuth, setUserSessionId, resetUser } = userSlice.actions;
export default userSlice.reducer;