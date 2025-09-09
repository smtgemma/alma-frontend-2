import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import userReducer from "./features/user/userSlice";
import subscriptionReducer from "./features/subscription/subscriptionSlice";
import billingReducer from "./features/billing/billingSlice";
import baseApi from "./api/baseApi";
import aiApi from "./api/aiApi";
import { pdfExtractionApi } from "./api/pdfExtraction/pdfExtractionApi";
import { generatePlanApi } from "./api/plans/generatePlanApi";

// Create a noop storage for SSR
const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
});

// Use real storage on client, noop on server
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    baseApi.reducerPath,
    aiApi.reducerPath,
    pdfExtractionApi.reducerPath,
    generatePlanApi.reducerPath,
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  subscription: subscriptionReducer,
  billing: billingReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  [pdfExtractionApi.reducerPath]: pdfExtractionApi.reducer,
  [generatePlanApi.reducerPath]: generatePlanApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      baseApi.middleware,
      aiApi.middleware,
      pdfExtractionApi.middleware,
      generatePlanApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
