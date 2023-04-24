import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ResponsiveToggles {
  leftPanelToggle: boolean;
}
const initialState: ResponsiveToggles = {
  leftPanelToggle: false,
};

export const responsiveTogglesSlice = createSlice({
  name: 'responsiveToggle',
  initialState,
  reducers: {
    toggleLeftPanel: (state, action: PayloadAction<boolean>) => {
      state.leftPanelToggle = action.payload;
    },
  },
});

export const {toggleLeftPanel} = responsiveTogglesSlice.actions;
export default responsiveTogglesSlice.reducer;
