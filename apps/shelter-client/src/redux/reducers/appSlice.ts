import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  showTimeline?: boolean;
  inviteLink?: string;
  loading?: boolean;
  sockets?: {
    connected?: boolean;
  }
}

const initialState: AppState = {
  showTimeline: false,
  inviteLink: '',
  loading: false,
  sockets: {
    connected: false
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateApp: (state, action: PayloadAction<AppState>) => {
      return { ...state, ...action.payload };
    },
    resetApp: () => initialState,
    updateSockets: (state, action: PayloadAction<AppState['sockets']>) => {
      return { ...state, sockets: { ...state.sockets, ...action.payload } };
    },
    resetSockets: (state) => {
      return { ...state, sockets: initialState.sockets }
    },
  },
});

export const { updateApp, resetApp, updateSockets, resetSockets } = appSlice.actions;
export default appSlice.reducer;
