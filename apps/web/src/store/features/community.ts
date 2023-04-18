import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface CommunityState {
  selectedCommunity: string;
  communityName: string;
  communityAvatar: string;
  description: string;
  newlyCreatedCommunity?: string,
  updateCommunityId?: string;
}

const initialState: CommunityState = {
  selectedCommunity: "",
  communityName: "",
  communityAvatar: "",
  description: "",
  newlyCreatedCommunity: "",
  updateCommunityId: undefined,
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
    newlyCreatedCommunity: (state, action: PayloadAction<string>) => {
      state.newlyCreatedCommunity = action.payload
    },
    setUpdateCommunityId: (state, action: PayloadAction<string>) => {
      state.updateCommunityId = action.payload;
    },
    clearUpdateCommunityId: (state,) => {
      state.updateCommunityId = undefined;
    }
  },
});

export const {selectCommunity, newlyCreatedCommunity, setUpdateCommunityId, clearUpdateCommunityId} = communitySlice.actions;
export default communitySlice.reducer;
