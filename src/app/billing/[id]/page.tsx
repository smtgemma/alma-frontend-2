import React from "react";

// Deprecated Stripe billing page. Kept to avoid 404 if linked elsewhere.
// For PayPal subscriptions, users are redirected directly to PayPal approval URL.

const BillingPage = async ({ params }: any) => {
  const { id } = await params;
  console.log("Deprecated /billing page accessed for plan:", id);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">This billing page is no longer used.</h1>
        <p className="text-gray-600">Please choose a plan again to start the PayPal checkout.</p>
      </div>
    </div>
  );
};

export default BillingPage;
