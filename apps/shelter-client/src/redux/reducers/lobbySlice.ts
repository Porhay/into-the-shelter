import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LobbyState {
  lobbyId?: string | null;
  lobbyLink?: string | null;
}

const initialState: LobbyState = {
  lobbyId: null,
  lobbyLink: ''
};

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    updateLobby: (state, action: PayloadAction<LobbyState>) => {
      return { ...state, ...action.payload };
    },
    resetLobby: () => initialState,
  },
});

export const { updateLobby, resetLobby } = lobbySlice.actions;
export default lobbySlice.reducer;
