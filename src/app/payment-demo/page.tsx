"use client";

import React, { useState } from "react";
import { PaymentForm } from "../../components/PaymentForm";
import { Toaster } from "sonner";

// Sample plans data
const samplePlans = [
  {
    id: "688b48b5f92ece73d804c01d", // This is the plan ID from your API
    name: "Team Plan",
    price: 300,
    currency: "EUR",
    features: [
      "Executive Summary",
      "Product/Service Description",
      "Basic Market Research & Competitor Overview",
      "Income Statement (Light Forecast)",
      "Basic Operational Plan (staff, logistics, key suppliers)",
      "Funding Options Summary (AI-sourced grants, loans, etc.)",
    ],
    description: "Perfect for small teams and startups",
    popular: true,
  },
  {
    id: "688b48b5f92ece73d804c01e", // You can add more plan IDs here
    name: "Basic Plan",
    price: 150,
    currency: "EUR",
    features: [
      "Executive Summary",
      "Product/Service Description",
      "Basic Market Research",
      "Simple Financial Projections",
    ],
    description: "Great for individuals and small projects",
    popular: false,
  },
  {
    id: "688b48b5f92ece73d804c01f",
    name: "Enterprise Plan",
    price: 500,
    currency: "EUR",
    features: [
      "Everything in Team Plan",
      "Advanced Market Analysis",
      "Detailed Financial Modeling",
      "Risk Assessment",
      "Implementation Timeline",
      "Custom Reports",
    ],
    description: "Comprehensive solution for large organizations",
    popular: false,
  },
];

export default function PaymentDemoPage() {
  const [selectedPlan, setSelectedPlan] = useState(samplePlans[0]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePlanSelect = (plan: (typeof samplePlans)[0]) => {
    setSelectedPlan(plan);
    setShowPaymentForm(false);
  };

  const handlePaymentSuccess = (result: any) => {
    console.log("Payment successful:", result);
    // You can redirect to a success page or update the UI
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment failed:", error);
    // You can show additional error handling here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Payment Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This demo showcases the complete Stripe payment integration for
            subscription-based services. Select a plan and complete the payment
            process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {samplePlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all cursor-pointer ${
                selectedPlan.id === plan.id
                  ? "border-blue-500 shadow-xl"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-1">{plan.currency}</span>
                <span className="text-gray-500 text-sm ml-1">/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowPaymentForm(true)}
                className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                  selectedPlan.id === plan.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedPlan.id === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {showPaymentForm && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Your Payment
                </h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Selected Plan:</span>
                    <span className="font-semibold text-blue-900">
                      {selectedPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-lg text-blue-900">
                      {selectedPlan.price} {selectedPlan.currency}
                    </span>
                  </div>
                </div>
              </div>

              <PaymentForm
                planId={selectedPlan.id}
                planName={selectedPlan.name}
                planPrice={selectedPlan.price}
                planCurrency={selectedPlan.currency}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                showHeader={false}
              />
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Subscription
              </h3>
              <p className="text-gray-600">
                Your backend creates a subscription and returns a payment intent
                with client secret.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Payment Method
              </h3>
              <p className="text-gray-600">
                Stripe creates a payment method using the card details provided
                by the user.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Payment
              </h3>
              <p className="text-gray-600">
                The payment intent is confirmed using the client secret and
                payment method ID.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Technical Details
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Backend API:</strong>{" "}
                http://172.252.13.71:1002/api/v1/billing/subscribe
              </p>
              <p>
                <strong>Stripe API:</strong>{" "}
                https://api.stripe.com/v1/payment_methods &
                /payment_intents/:id/confirm
              </p>
              <p>
                <strong>Authentication:</strong> Bearer Token for backend, Basic
                Auth for Stripe
              </p>
              <p>
                <strong>Plan ID:</strong> Currently using static plan ID:
                688b48b5f92ece73d804c01d
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
