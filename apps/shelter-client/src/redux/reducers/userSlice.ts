import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username?: string;
  isAuth?: boolean;
  userSessionId?: string;
  userId?: string;
}

const initialState: UserState = {
  username: '',
  isAuth: false,
  userSessionId: '',
  userId: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
