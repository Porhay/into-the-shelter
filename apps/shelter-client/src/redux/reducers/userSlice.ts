import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  // Add other user-related properties as needed
}

const initialState: UserState = {
  username: '',
  // Initialize other properties as needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = userSlice.actions;
export default userSlice.reducer;