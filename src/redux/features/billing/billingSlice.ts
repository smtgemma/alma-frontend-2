import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BillingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
}

interface BillingState {
  billingInfo: BillingInfo | null;
}

const initialState: BillingState = {
  billingInfo: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setBillingInfo: (state, action: PayloadAction<BillingInfo>) => {
      state.billingInfo = action.payload;

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem("billingInfo", JSON.stringify(action.payload));
      }
    },
    clearBillingInfo: (state) => {
      state.billingInfo = null;

      // Also clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("billingInfo");
      }
    },
    // Action to load billing info from localStorage (useful for SSR)
    loadBillingInfoFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("billingInfo");
        if (stored) {
          try {
            state.billingInfo = JSON.parse(stored);
          } catch (error) {
            console.error("Failed to parse billing info from localStorage:", error);
            localStorage.removeItem("billingInfo");
          }
        }
      }
    },
  },
});

export const { setBillingInfo, clearBillingInfo, loadBillingInfoFromStorage } =
  billingSlice.actions;
export default billingSlice.reducer;
