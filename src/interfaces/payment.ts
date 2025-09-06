// Billing information interface
export interface BillingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  email: string;
  address: string;
  additionalInfo?: string;
  country: string;
}

// Plan details interface
export interface PlanDetails {
  name: string;
  price: number;
  currency: string;
  features: string[];
}

// Subscription creation request
export interface CreateSubscriptionRequest {
  planId: string;
  billingInfo: BillingInfo;
  cardData: CreatePaymentMethodRequest; // Required since backend handles everything
}

// Subscription creation response
export interface CreateSubscriptionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    subscriptionId: string;
    clientSecret: string;
    paymentIntentId: string;
    status: string;
    requiresAction: boolean;
    planDetails: PlanDetails;
  };
  // Direct access properties for convenience
  subscriptionId?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  status?: string;
}

// Payment method creation request
export interface CreatePaymentMethodRequest {
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  type: "card";
}

// Payment method response
export interface PaymentMethodResponse {
  id: string;
  object: "payment_method";
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
    tax_id: string | null;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string | null;
    };
    country: string;
    display_brand: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    generated_from: string | null;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
  };
  created: number;
  customer: string | null;
  livemode: boolean;
  type: string;
}

// Payment intent confirmation request
export interface ConfirmPaymentIntentRequest {
  client_secret: string;
  payment_method: string;
}

// Payment intent response
export interface PaymentIntentResponse {
  id: string;
  object: "payment_intent";
  amount: number;
  currency: string;
  description: string;
  client_secret: string;
  payment_method: string;
  payment_method_types: string[];
  livemode: boolean;
  status: string;
  created: number;
  setup_future_usage: string;
  capture_method: string;
  confirmation_method: string;
  amount_details: {
    tip: Record<string, any>;
  };
  automatic_payment_methods: any;
  canceled_at: number | null;
  cancellation_reason: string | null;
  last_payment_error: any;
  next_action: any;
  payment_method_configuration_details: any;
  processing: any;
  receipt_email: string | null;
  shipping: any;
  source: any;
}
