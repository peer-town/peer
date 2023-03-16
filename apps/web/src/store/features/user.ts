import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk ,current} from "@reduxjs/toolkit";
import { trpcProxy } from "../../utils/trpc";
import { has, get } from "lodash";
import { isRight, right, left } from "../../utils/fp";

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

export const initialState: UserState = {
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
};

export type Address = string;

export const fetchUserDetails = createAsyncThunk(
  "user/fetchDetails",
  async (address: string) => {
    try {
      const response = await trpcProxy.user.getUser.query({ address });
      console.log("value",response.value);
      return isRight(response) && has(response, "value.id")
        ? response.value
        : initialState;
    } catch (e) {
      return initialState;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<UserState>) => {
      const data = action.payload;
      console.log("data",data);
      state.id = data.id;
      state.author = data.author;
      state.createdAt = data.createdAt;
      state.userPlatforms = data.userPlatforms;
      state.walletAddress =  data.walletAddress;
      console.log("state",current(state));
    });
  },
});

export const { updateUserDetails } = userSlice.actions;
export default userSlice.reducer;
