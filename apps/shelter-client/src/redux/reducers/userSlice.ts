import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userId?: string;
  username?: string | null;
  displayName?: string | null;
  userSessionId?: string | null;
  avatar?: string | null;
  gameAvatars?: any[];
  coins?: number | 0;
  userProducts?: any;
}

const initialState: UserState = {
  userId: '',
  username: '',
  displayName: 'stranger',
  userSessionId: '',
  avatar: null,
  gameAvatars: [],
  coins: 0,
  userProducts: [],
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
