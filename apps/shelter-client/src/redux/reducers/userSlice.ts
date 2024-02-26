import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username?: string | null;
  displayName?: string | null;
  userSessionId?: string | null;
  userId?: string | null;
  avatar?: string | null
}

const initialState: UserState = {
  username: '',
  displayName: 'stranger',
  userSessionId: '',
  userId: '',
  avatar: null
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
