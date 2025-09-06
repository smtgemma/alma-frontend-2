import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionData {
  clientSecret: string | null;
  paymentIntentId: string | null;
}

const initialState: SubscriptionData = {
  clientSecret: null,
  paymentIntentId: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionData: (state, action: PayloadAction<SubscriptionData>) => {
      state.clientSecret = action.payload.clientSecret;
      state.paymentIntentId = action.payload.paymentIntentId;

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "subscriptionData",
          JSON.stringify(action.payload)
        );
      }
    },
    clearSubscriptionData: (state) => {
      state.clientSecret = null;
      state.paymentIntentId = null;
   

      // Also clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("subscriptionData");
      }
    },
  },
});

export const { setSubscriptionData, clearSubscriptionData } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
