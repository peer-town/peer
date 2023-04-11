import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ProfileState {
  newlyCreatedThread: string;
}

const initialState: ProfileState = {
  newlyCreatedThread: "",
};

export const threadSlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    newlyCreatedThread: (state, action: PayloadAction<string>) => {
      state.newlyCreatedThread = action.payload;
    },
  },
});

export const {newlyCreatedThread} = threadSlice.actions;
export default threadSlice.reducer;
