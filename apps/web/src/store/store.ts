import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./features/user";
import communityReducer from "./features/community";
import profileReducer from "./features/profile";
import threadReducer from "./features/thread";
import {loadFromLocalStorage, saveToLocalStorage} from "./storage";

export const store = configureStore({
  reducer: {
    community: communityReducer,
    user: userReducer,
    profile: profileReducer,
    thread: threadReducer,
  },
  preloadedState: loadFromLocalStorage(),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
