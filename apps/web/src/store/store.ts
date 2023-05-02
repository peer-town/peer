import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./features/user";
import communityReducer from "./features/community";
import profileReducer from "./features/profile";
import threadReducer from "./features/thread";
import responsiveToggleReducer, {initialState as toggleInitialState} from "./features/responsive_toggles";
import {loadFromLocalStorage, saveToLocalStorage} from "./storage";

const resetState = {
  responsiveToggles:toggleInitialState
}
export const store = configureStore({
  reducer: {
    community: communityReducer,
    user: userReducer,
    profile: profileReducer,
    thread: threadReducer,
    responsiveToggles: responsiveToggleReducer,
  },
  preloadedState: loadFromLocalStorage(resetState),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
