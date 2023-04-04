import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface CommunityState {
  selectedCommunity: string;
  communityName: string;
  communityAvatar: string;
  description: string;
}

const initialState: CommunityState = {
  selectedCommunity: "",
  communityName:"",
  communityAvatar: "",
  description: "",
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    selectCommunity: (state, action: PayloadAction<CommunityState>) => {
      state.selectedCommunity = action.payload?.selectedCommunity;
      state.communityName = action.payload?.communityName;
      state.communityAvatar = action.payload?.communityAvatar;
      state.description = action.payload?.description;
    },
  },
});

export const {selectCommunity} = communitySlice.actions;
export default communitySlice.reducer;
