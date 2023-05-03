import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { trpcProxy } from "../../utils/trpc";
import { has } from "lodash";
import { isRight } from "../../utils/fp";

export interface UserState {
  id?: string;
  createdAt?: string;
  walletAddress?: string;
  userPlatforms?: [
    {
      platformId: string;
      platformName: string;
      platformAvatar: string;
      platformUsername: string;
    }
  ];
  author?: {
    id: string;
  };
}

export interface CompleteUserState extends UserState {
  didSession: string;
  did: string;
  discordContext: string;
}

const initialState: CompleteUserState = {
  id: null,
  createdAt: null,
  walletAddress: null,
  userPlatforms: [
    {
      platformId: null,
      platformName: null,
      platformAvatar: null,
      platformUsername: null,
    },
  ],
  author: {
    id: null,
  },
  didSession: null,
  did: null,
  discordContext: null,
};

export type Address = string;

export const fetchUserDetails = createAsyncThunk(
  "user/fetchDetails",
  async (address: string) => {
    try {
      const response = await trpcProxy.user.getUser.query({ address });
      return isRight(response) && has(response, "value.id")
        ? response.value
        : null;
    } catch (e) {
      return null;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserDetails: (state, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload };
    },
    updateDidSession: (state, action: PayloadAction<string | null>) => {
      const data = action.payload;
      state.didSession = data;
    },
    updateDid: (state, action: PayloadAction<string | null>) => {
      const data = action.payload;
      state.did = data;
    },
    updateDiscordContext: (state, action: PayloadAction<string>) => {
      const data = action.payload;
      if (data) {
        state.discordContext = data;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchUserDetails.fulfilled,
      (state, action: PayloadAction<UserState | null>) => {
        const data = action.payload;
        if (data) {
          state.id = data.id;
          state.author = data.author;
          state.createdAt = data.createdAt;
          state.userPlatforms = data.userPlatforms;
          state.walletAddress = data.walletAddress;
        } else {
          state.id = null;
          state.author = null;
          state.createdAt = null;
          state.userPlatforms = null;
          state.walletAddress = null;
        }
      }
    );
  },
});

export const {
  updateUserDetails,
  updateDidSession,
  updateDiscordContext,
  updateDid,
} = userSlice.actions;
export default userSlice.reducer;
