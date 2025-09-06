// Test utility for payment system
export const testPaymentData = {
  // Test billing information
  billingInfo: {
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
    location: "New York",
    email: "john.doe@example.com",
    address: "123 Main Street",
    additionalInfo: "Test payment",
    country: "USA"
  },

  // Test card data
  cardData: {
    card: {
      number: "4242424242424242", // Stripe test card
      exp_month: 12,
      exp_year: 2029,
      cvc: "123"
    },
    type: "card" as const
  },

  // Test plan data
  testPlan: {
    id: "688b48b5f92ece73d804c01d",
    name: "Team Plan",
    price: 300,
    currency: "EUR",
    features: [
      "Executive Summary",
      "Product/Service Description",
      "Basic Market Research & Competitor Overview",
      "Income Statement (Light Forecast)",
      "Basic Operational Plan",
      "Funding Options Summary"
    ]
  },

  // Test error scenarios
  errorCards: {
    declined: {
      number: "4000000000000002",
      exp_month: 12,
      exp_year: 2029,
      cvc: "123"
    },
    requiresAuthentication: {
      number: "4000002500003155",
      exp_month: 12,
      exp_year: 2029,
      cvc: "123"
    },
    insufficientFunds: {
      number: "4000000000009995",
      exp_month: 12,
      exp_year: 2029,
      cvc: "123"
    }
  }
};

// Test function to validate payment data
export const validatePaymentData = (billingInfo: any, cardData: any) => {
  const errors: string[] = [];

  // Validate billing info
  if (!billingInfo.firstName) errors.push("First name is required");
  if (!billingInfo.lastName) errors.push("Last name is required");
  if (!billingInfo.email) errors.push("Email is required");
  if (!billingInfo.phone) errors.push("Phone is required");
  if (!billingInfo.address) errors.push("Address is required");
  if (!billingInfo.country) errors.push("Country is required");

  // Validate card data
  if (!cardData.card.number) errors.push("Card number is required");
  if (!cardData.card.exp_month) errors.push("Expiration month is required");
  if (!cardData.card.exp_year) errors.push("Expiration year is required");
  if (!cardData.card.cvc) errors.push("CVC is required");

  // Validate card number format
  const cardNumber = cardData.card.number.replace(/\s/g, '');
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    errors.push("Card number must be between 13 and 19 digits");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingInfo.email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Test function to simulate payment processing
export const simulatePaymentProcessing = async (delay: number = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Payment processed successfully"
      });
    }, delay);
  });
};

// Test function to check if user is authenticated
export const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  return {
    isAuthenticated: !!token,
    token: token ? `${token.substring(0, 20)}...` : null
  };
};

// Test function to validate plan data
export const validatePlanData = (plan: any) => {
  const errors: string[] = [];

  if (!plan.id) errors.push("Plan ID is required");
  if (!plan.name) errors.push("Plan name is required");
  if (!plan.price) errors.push("Plan price is required");
  if (!plan.currency) errors.push("Plan currency is required");

  return {
    isValid: errors.length === 0,
    errors
  };
};
