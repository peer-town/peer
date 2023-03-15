import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface CommunityState {
  selectedCommunity: string;
}

const initialState: CommunityState = {
  selectedCommunity: "",
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    selectCommunity: (state, action: PayloadAction<string>) => {
      state.selectedCommunity = action.payload;
    },
  },
});

export const {selectCommunity} = communitySlice.actions;
export default communitySlice.reducer;
