"use client";
import { BsCheck, BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { useGetCurrentPlansQuery } from "@/redux/api/plans/plansApi";
import Loading from "@/components/Others/Loading";
import { format } from "date-fns";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  current?: boolean;
  popular?: boolean;
}

export default function SubscriptionPlan() {
  const { data: plansData, isLoading } = useGetCurrentPlansQuery({});
  const router = useRouter();

  const handlePlanSelect = async (id: any) => {
    // Check if user is authenticated
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      // Show toast notification
      toast.error("Accedi prima per sottoscrivere un piano");
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
          toast.error("Autenticazione fallita. Accedi di nuovo.");
          router.push("/signIn");
          return;
        } else if (response.status === 403) {
          toast.error("Accesso negato. Non hai il permesso di sottoscrivere.");
          return;
        } else {
          // Show the specific error message from API response
          const errorMessage =
            respData?.message ||
            `Errore del server: ${response.status}. Riprova.`;
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
        const errorMessage =
          respData?.message || "Creazione sottoscrizione fallita";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "Si è verificato un errore imprevisto");
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className=" p-4 md:p-6 lg:p-6 rounded-[20px] space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Gestisci Abbonamento
        </h1>
      </div>

      {/* Current Plan Section */}
      {plansData?.data?.currentPlan && (
        <div className="  py-6 mb-8">
          <h2 className="text-base font-medium text-gray-800 mb-2">
            Piano Attuale
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-[24px] font-medium text-gray-800 mb-2">
                  {plansData?.data?.currentPlan?.publicName}
                </h3>
                <p className="text-gray-600">
                  Attivo dal{" "}
                  <span className="text-blue-600 font-medium">
                    {format(
                      new Date(plansData?.data?.startDate),
                      "MMM dd, yyyy"
                    )}
                  </span>{" "}
                  al <br />
                  <span className="text-red-600 font-medium">
                    {format(
                      new Date(
                        plansData?.data?.endDate ||
                          plansData?.data?.membershipEnds ||
                          plansData?.data?.startDate
                      ),
                      "MMM dd, yyyy"
                    )}
                  </span>
                </p>
              </div>

              <button className="bg-primary text-white px-6 py-3 rounded-[52px] flex items-center gap-2  transition-colors">
                <span>
                  Passa a {""}
                  {plansData?.data.currentPlan?.name == "Solo Plan"
                    ? "Piano Team"
                    : "Piano Solo"}
                </span>
                <BsArrowRight className="text-lg" />
              </button>
            </div>

            <div className="w-64 h-40 bg-gradient-to-br from-green-100 to-yellow-100 rounded-lg flex items-center justify-center">
              <Image
                src="/images/plan-img.png"
                alt="Team Plan"
                width={300}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Compare Plans Section */}
      <div className="">
        <h2 className="text-[24px] font-medium text-gray-800 mb-6">
          Confronta Piani
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plansData?.data?.plans?.map((plan: any) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg border-2 p-6 ${
                plan.access == "full" ? "border-gray-200" : "border-gray-200"
              }`}
            >
              {/* Current Badge */}
              {plan.access == "full" && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Attuale
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-start mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {plan.publicName}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-800">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                {/* <p className="text-gray-600 text-sm">{plan.description}</p> */}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <BsCheck className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                  plan.current
                    ? "bg-primary text-white cursor-not-allowed"
                    : "bg-primary text-white "
                }`}
                disabled={plan.access == "full" ? true : false}
              >
                {plan.access == "full" ? "Piano Attuale" : "Scegli Piano"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      {/* <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">What's included in all plans:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Access to AI-powered business plan generator</li>
              <li>• Professional templates and layouts</li>
              <li>• Export to PDF and PowerPoint</li>
              <li>• Basic customer support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Need help choosing?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Contact our sales team for personalized recommendations based on your business needs.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Contact Sales →
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
