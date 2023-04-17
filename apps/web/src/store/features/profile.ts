import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ProfileState {
  userProfileId: string;
}

const initialState: ProfileState = {
  userProfileId: "",
};

export const profileSlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    showUserProfile: (state, action: PayloadAction<ProfileState>) => {
      state.userProfileId = action.payload?.userProfileId;
    },
    clearUserProfile: (state,) => {
      state.userProfileId = undefined;
    }
  },
});

export const {showUserProfile, clearUserProfile} = profileSlice.actions;
export default profileSlice.reducer;
