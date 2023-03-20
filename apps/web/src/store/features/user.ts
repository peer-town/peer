import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { trpcProxy } from "../../utils/trpc";
import { has, get } from "lodash";
import { isRight } from "../../utils/fp";

export type UserState = {
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
};

export const initialState = {
  id: "",
  createdAt: "",
  walletAddress: "",
  userPlatforms: [
    {
      platformId: "",
      platformName: "",
      platformAvatar: "",
      platformUsername: "",
    },
  ],
  author: {
    id: "",
  },
  didSession: "",
  discordContext: "",
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
    updateDidSession: (state, action: PayloadAction<string>) => {
      const data = action.payload;
      if (data) {
        state.didSession = data;
      }
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

export const { updateUserDetails, updateDidSession, updateDiscordContext } =
  userSlice.actions;
export default userSlice.reducer;
