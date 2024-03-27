import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LobbyState {
  lobbyId?: string | null;
  lobbyLink?: string | null;
  hasStarted?: boolean | null;
  hasFinished?: boolean | null;
  players?: any;
}

const initialState: LobbyState = {
  lobbyId: null,
  lobbyLink: '',
  hasStarted: false,
  hasFinished: false,
  players: [],
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
