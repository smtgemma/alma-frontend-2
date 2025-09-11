import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key - this should come from environment variables
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RnyoOQmUMn16GEo4JAj2l5o2LGvXVi06bBwubrmGslhWEpVCXjUtXfAFGDmxTkbKgZ17AOKnePoE0yOKREOjwVw00TBeEk878";

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Backend API base URL
export const API_BASE_URL = "http://172.252.13.71:1002/api/v1";
