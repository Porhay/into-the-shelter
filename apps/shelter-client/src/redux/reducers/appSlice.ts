import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  showTimeline?: boolean;
}

const initialState: AppState = {
  showTimeline: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateApp: (state, action: PayloadAction<AppState>) => {
      return { ...state, ...action.payload };
    },
    resetApp: () => initialState,
  },
});

export const { updateApp, resetApp } = appSlice.actions;
export default appSlice.reducer;
