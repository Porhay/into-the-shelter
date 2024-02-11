import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data: string;
}

const initialState: ExampleState = {
  data: '',
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setExampleData: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
  },
});

export const { setExampleData } = exampleSlice.actions;
export default exampleSlice.reducer;