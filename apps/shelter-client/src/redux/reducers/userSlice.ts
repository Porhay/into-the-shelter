import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userId?: string;
  username?: string | null;
  displayName?: string | null;
  userSessionId?: string | null;
  avatar?: string | null;
  ingameAvatars?: string[];
}

const initialState: UserState = {
  userId: '',
  username: '',
  displayName: 'stranger',
  userSessionId: '',
  avatar: null,
  ingameAvatars: []
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
