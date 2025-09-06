import { UserProfile } from "@/interfaces/global";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  isRefreshing: boolean;
} = {
  user: null,
  token: null,
  refreshToken: null,
  isInitialized: false,
  isRefreshing: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isInitialized = true;
      state.isRefreshing = false;
    },
    initializeAuth: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isInitialized = true;
      state.isRefreshing = false;
    },
    setRefreshingToken: (state, action) => {
      state.isRefreshing = action.payload;
    },
    updateTokens: (state, action) => {
      state.token = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isRefreshing = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isInitialized = true;
      state.isRefreshing = false;
    },
  },
});

export const { setUser, logout, initializeAuth, setRefreshingToken, updateTokens } = userSlice.actions;
export default userSlice.reducer;
