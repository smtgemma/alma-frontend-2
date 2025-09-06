
import SmartNavbar from "@/components/ai-smart-form/SmartNavbar";
import BillingPlan from "@/components/LandingPage/BillingPlan";
import StripePaymentForm from "@/components/LandingPage/StripePaymentForm";
// import { useRouter } from "next/navigation";
import React from "react";

const BillingPage = async({params}: any) => {
    const {id} = await params;
    //   const router = useRouter();

console.log("id", id);


  return (
    <div>
      {/* <SmartNavbar
        rightButtons={
          <button
            onClick={handleBack}
            className="text-accent px-12 py-2 rounded-md border border-accent hover:bg-primary hover:text-white transition-colors duration-200"
          >
            Back
          </button>
        }
      /> */}
      <StripePaymentForm id={id} />
    </div>
  );
};

export default BillingPage;
