import {configureStore} from "@reduxjs/toolkit";
import communityReducer from "./features/community";
import {loadFromLocalStorage, saveToLocalStorage} from "./storage";

export const store = configureStore({
  reducer: {
    community: communityReducer,
  },
  preloadedState: loadFromLocalStorage(),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
