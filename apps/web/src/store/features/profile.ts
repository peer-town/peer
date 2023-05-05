import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ProfileState {
  userProfileId: string;
}

export const profileInitialState: ProfileState = {
  userProfileId: "",
};

export const profileSlice = createSlice({
  name: 'community',
  initialState:profileInitialState ,
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
