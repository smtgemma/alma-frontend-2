"use client";
import { useRouter } from "next/navigation";
import { useGetPlansQuery } from "@/redux/api/plans/plansApi";
import { toast } from "sonner";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import Cookies from "js-cookie";
interface PlanFeature {
  text: string;
}


export default function S11SubscriptionPlan() {
  const { data, error, isLoading } = useGetPlansQuery({});
  const router = useRouter();
  const { prevStep } = useSmartForm();

  const plans = data?.data || [];

  const handlePlanSelect = async (id: any) => {
    // Check if user is authenticated
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      // Show toast notification
      toast.error("Please sign in first to subscribe to a plan");
      // Redirect to signin page
      router.push("/signIn");
      return;
    }

    try {
      // Create subscription with backend (PayPal)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: id,
          }),
        }
      );

      const respData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem("token");
          // Show toast and redirect to signin
          toast.error("Authentication failed. Please sign in again.");
          router.push("/signIn");
          return;
        } else if (response.status === 403) {
          toast.error(
            "Access denied. You do not have permission to subscribe."
          );
          return;
        } else {
          // Show the specific error message from API response
          const errorMessage =
            respData?.message ||
            `Server error: ${response.status}. Please try again.`;
          toast.error(errorMessage);
          return;
        }
      }

      if (respData.success && respData?.data?.approvalUrl && respData?.data?.paypalSubscriptionId) {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "paypalSubscriptionId",
              respData.data.paypalSubscriptionId
            );
          }
        } catch {}
        // Redirect user to PayPal approval URL
        window.location.href = respData.data.approvalUrl;
      } else {
        // Show the specific error message from API response
        const errorMessage = respData?.message || "Failed to create subscription";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const handleBackButton = () => {
    // Navigate back to S10ReviewPlan.tsx
    prevStep();
  };

  // Back button for navbar
  const backButton = (
    <button
      onClick={handleBackButton}
      className="px-6 md:px-16 py-2 bg-white border border-[#475466] text-accent text-[1rem] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    >
      Back
    </button>
  );

  return (
    <div className="">
      <SmartNavbar rightButtons={backButton} />
      <div className="flex flex-col items-center justify-center p-4 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Header */}
          <div className="text-start mb-12">
            <h1 className="text-[2rem] md:text-[2.3rem] font-semibold text-accent mb-2">
              Claim Your Complete Plan <br /> One Simple Purchase
            </h1>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mx-auto">
            {plans.length > 0 &&
              plans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-[40px] p-8 md:p-16 shadow-lg relative flex flex-col"
                  style={{
                    boxShadow:
                      "0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540",
                  }}
                >
                  <div className="text-start mb-6">
                    <h3 className="text-[19px] font-medium text-accent mb-4">
                      {plan.publicName}
                    </h3>
                    <div className="flex items-baseline justify-start mb-3">
                      <span className="text-[2.5rem] font-medium text-accent">
                        {plan.currency === "EUR"
                          ? "€"
                          : plan.currency === "USD"
                          ? "$"
                          : plan.currency === "LYD"
                          ? "ل.د"
                          : plan.currency}
                        {plan.price}/
                      </span>
                      <span className="text-[1.2rem] font-medium text-info ml-2">
                        Month
                      </span>
                    </div>
                    <p
                      className={`text-[0.81rem] font-normal leading-relaxed ${
                        plan.id === "team" ? "text-info" : ""
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span
                          className="text-[0.81rem] font-normal text-accent"
                          dangerouslySetInnerHTML={{
                            __html: feature.replace(/\n/g, "<br />"),
                          }}
                        ></span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-[52px] transition-all duration-200 transform hover:scale-[1.02] hover:bg-primary/90"
                  >
                    Subscribe
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
