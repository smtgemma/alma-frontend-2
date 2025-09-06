"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface StripeProviderProps {
  children: React.ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  // Get subscription data from Redux store
  const subData: any = useSelector((state: RootState) => state.subscription);

  const clientSecret = subData?.clientSecret;
  const amount = subData?.amount || 1099; // Default amount in cents
  const currency = (subData?.currency || "eur").toLowerCase(); // Default currency (lowercase)

  // Only render Elements when clientSecret is available
  if (!clientSecret) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: amount,
        currency: currency,
        paymentMethodCreation: "manual",
        paymentMethodTypes: ["card"],
      }}
    >
      {children}
    </Elements>
  );
}
