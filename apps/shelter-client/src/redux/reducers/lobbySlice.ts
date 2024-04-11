import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LobbyState {
  lobbyId?: string | null;
  lobbyKey?: string | null;
  lobbyLink?: string | null;
  hasStarted?: boolean | null;
  hasFinished?: boolean | null;
  players?: any;
  characteristics?: any;
  specialCards?: any;
  conditions?: any;
  currentStage?: number;
  stages?: any[];
  revealPlayerId?: string;
  timer?: number;
  timerEndTime?: number | null;
}

const initialState: LobbyState = {
  lobbyId: null,
  lobbyKey: null,
  lobbyLink: '',
  hasStarted: false,
  hasFinished: false,
  players: [],
  characteristics: {},
  specialCards: {},
  conditions: {},
  currentStage: 1,
  stages: [],
  revealPlayerId: '',
  timer: 0,
  timerEndTime: null,
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
