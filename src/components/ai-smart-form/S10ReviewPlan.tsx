"use client";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGeneratePlanMutation } from "@/redux/api/plans/generatePlanApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  useBusinessGenerateMutation,
  useBusinessDraftMutation,
} from "@/redux/api/businessPlan/businessPlanApi";
import { useRouter } from "next/navigation";
import Loading from "../Others/Loading";
import { useGetUserProfileQuery } from "@/redux/api/auth/authApi";
//
import { computeIncomeStatementPreview, computeCashFlowPreview, parseYear0Balance, parseYear0Income } from "@/utils/italianAccounting";

function Euro({ value }: { value: number }) {
  return <span>€ {value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

import { useRef } from "react";

// Fixed Recap Previews component with PDF export and profile card
const RecapPreviewsFixed = () => {
  const { formData } = useSmartForm();
  const ce = computeIncomeStatementPreview(formData.step7, formData.step8);
  const cf = computeCashFlowPreview(formData.step6, formData.step7, formData.step8, formData.step9) as any;
  const year0SP = parseYear0Balance(formData.step1?.balanceSheetExtractions);
  const year0CE = parseYear0Income(formData.step1?.balanceSheetExtractions);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = () => {
    try {
      const el = containerRef.current;
      if (!el) return;
      const popup = window.open("", "print", "width=1024,height=768");
      if (!popup) return;
      popup.document.write(`<!doctype html><html><head><title>Anteprima Piano</title>
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; }
          .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .title { font-weight: 600; font-size: 16px; margin-bottom: 8px; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
        </style></head><body>`);
      popup.document.write(el.innerHTML);
      popup.document.write("</body></html>");
      popup.document.close();
      popup.focus();
      popup.print();
    } catch (e) {
      console.error("Print error", e);
    }
  };

  const profile = {
    name: formData.step1?.businessName || formData.step1?.extractedCompanyName,
    id: formData.step1?.extractedCompanyId,
    address: formData.step1?.location,
    founders: formData.step1?.extractedFounders,
    established: formData.step1?.extractedEstablishmentDate,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleExportPdf} type="button" className="px-4 py-2 bg-[#A9A4FE] text-white rounded-md hover:bg-primary/90">
          Esporta PDF
        </button>
      </div>
      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="border rounded-lg p-4 lg:col-span-1">
          <h3 className="text-[1.1rem] font-semibold text-accent mb-3">Profilo Aziendale</h3>
          {(profile.name || profile.id || profile.address || profile.founders || profile.established) ? (
            <div className="space-y-1 text-[0.95rem] text-accent">
              {profile.name && <div className="flex justify-between"><span>Denominazione</span><span className="font-medium">{profile.name}</span></div>}
              {profile.id && <div className="flex justify-between"><span>P.IVA/C.F.</span><span className="font-medium">{profile.id}</span></div>}
              {profile.established && <div className="flex justify-between"><span>Data costituzione</span><span className="font-medium">{profile.established}</span></div>}
              {profile.address && <div className="flex justify-between"><span>Sede</span><span className="font-medium">{profile.address}</span></div>}
              {profile.founders && <div className="flex justify-between"><span>Fondatori</span><span className="font-medium">{profile.founders}</span></div>}
            </div>
          ) : (
            <p className="text-[0.95rem] text-gray-500">Carica una Visura Camerale per compilare automaticamente i dati.</p>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CE */}
          <div className="border rounded-lg p-4">
            <h3 className="text-[1.1rem] font-semibold text-accent mb-3">Conto Economico (Preview)</h3>
            <div className="space-y-1 text-[0.95rem] text-accent">
              <div className="flex justify-between"><span>Ricavi</span><Euro value={ce.ricavi} /></div>
              <div className="flex justify-between"><span>Costi operativi</span><Euro value={ce.costiOperativi} /></div>
              <div className="flex justify-between"><span>Ammortamenti</span><Euro value={ce.ammortamenti} /></div>
              <div className="flex justify-between"><span>Oneri finanziari</span><Euro value={ce.oneriFinanziari} /></div>
              <div className="flex justify-between"><span>Imposte</span><Euro value={ce.imposte} /></div>
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold"><span>Utile/Perdita</span><Euro value={ce.utile} /></div>
            </div>
          </div>

          {/* SP Year 0 */}
          <div className="border rounded-lg p-4">
            <h3 className="text-[1.1rem] font-semibold text-accent mb-3">Stato Patrimoniale (Year 0)</h3>
            {year0SP ? (
              <div className="space-y-1 text-[0.95rem] text-accent">
                <div className="flex justify-between"><span>Totale Attività</span><Euro value={year0SP.totaleAttivita || 0} /></div>
                <div className="flex justify-between"><span>Totale Passività + PN</span><Euro value={year0SP.totalePassivita || 0} /></div>
                {typeof year0SP.patrimonioNetto === "number" && (
                  <div className="flex justify-between"><span>Patrimonio Netto</span><Euro value={year0SP.patrimonioNetto} /></div>
                )}
              </div>
            ) : (
              <p className="text-[0.95rem] text-gray-500">Carica un Bilancio per visualizzare il Year 0.</p>
            )}
          </div>

          {/* Cash Flow */}
          <div className="border rounded-lg p-4">
            <h3 className="text-[1.1rem] font-semibold text-accent mb-3">Rendiconto Finanziario (Preview)</h3>
            <div className="space-y-1 text-[0.95rem] text-accent">
              <div className="flex justify-between"><span>Flusso Operativo</span><Euro value={cf.operating} /></div>
              <div className="flex justify-between"><span>Investimenti</span><Euro value={cf.investing} /></div>
              <div className="flex justify-between"><span>Finanziamenti</span><Euro value={cf.financing} /></div>
              <div className="flex justify-between"><span>Δ Crediti vs. Clienti</span><Euro value={-(cf.arIncrease || 0)} /></div>
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold"><span>Variazione di Cassa</span><Euro value={cf.delta} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function S10ReviewPlan() {
  const {
    prevStep,
    nextStep,
    goToStep,
    formData,
    setGeneratedPlan,
    setIsGeneratingPlan,
    isGeneratingPlan,
  } = useSmartForm();

  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();
  const { getAggregatedData, logFormData, exportFormDataAsJSON } =
    useSmartForm();
  const [businessGenerate, { isLoading: isBusinessGenerating }] =
    useBusinessGenerateMutation();
  const [businessDraft, { isLoading: isBusinessDrafting }] =
    useBusinessDraftMutation();
  // Get all form data in the required format
  const data = getAggregatedData();

  // Get user profile data to check subscription status
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !user?.token,
  });

  console.log("Aggregated form data:", data);

  const handleGeneratePlan = async () => {
    try {
      console.log("Generating business plan with data:", data);
      const result = await businessGenerate(data);

      console.log("Business plan generated:", result);

      if (result?.data?.success) {
        toast.success(
          result?.data?.message || "Business plan generated successfully!"
        );
        // Navigate to S13UnderExpertReview on success (step index 12)
        goToStep(12);
      } else {
        toast.error(
          result?.data?.message || "Failed to generate business plan"
        );
      }
    } catch (error: any) {
      console.error("Error generating business plan:", error);
      toast.error("An error occurred while generating the business plan");
    }
  };

  const handleSubscriptionPlan = async () => {
    try {
      console.log("Aggregated form data:", data);

      // Call useBusinessDraftMutation with the aggregated data
      const draftResult = await businessDraft(data);

      console.log("Business draft result:", draftResult);

      if (draftResult?.data?.success) {
        toast.success(
          draftResult?.data?.message || "Draft saved successfully!"
        );
      } else if (draftResult?.error) {
        toast.error("Failed to save draft");
      }

      // Navigate to S11SubscriptionPlan (step index 10)
      goToStep(10);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error("An error occurred while saving the draft");
      // Still navigate even if draft fails
      goToStep(10);
    }
  };
  const token = Cookies.get("token") || localStorage.getItem("token");
  console.log("Fetched token:", token);
  const [isSubscribed, setIsSubscribed] = useState<string | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/v1/billing/subscription-status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res) {
         

          const finalStatus =
            res.data?.data?.status || res.data?.status || "INACTIVE";
 

          setIsSubscribed(finalStatus);
       
        }
      } catch (error) {
        setIsSubscribed("INACTIVE");
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Send to API
  // const response = await fetch("/api/endpoint", {
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });

  if (isBusinessGenerating || isBusinessDrafting) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 10 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words">
              Rivedi Piano
            </h2>
          </div>

          {/* Form */}
          <div className="px-[5px] md:px-8 py-4 md:py-8 relative">
            {/* Top Right Decorative Image */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
              <img
                src="/images/dotted-top.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="bg-white rounded-2xl px-[5px] md:px-8 py-4 md:py-8 m-2 md:m-8 shadow-lg relative"
              style={{
                boxShadow:
                  "0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540",
              }}
            >
              <div className="space-y-6">
                {/* Recap Previews: CE, SP (Year 0 if available), Cash Flow */}
                <RecapPreviewsFixed />

                {/* Review Message */}
                <div className="text-center">
                  <p className="text-[1rem] font-normal text-accent leading-relaxed">
                    Nota: Rivedi attentamente tutti i tuoi input. Dopo aver
                    cliccato "Genera Piano," le modifiche <br /> non saranno più
                    possibili.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 max-w-lg mx-auto justify-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full  px-8 py-3 cursor-pointer bg-white border border-[#888888] text-accent text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Indietro
                  </button>
                  {(() => {
                    console.log("=== BUTTON RENDER DEBUG ===");
                    console.log(
                      "isSubscriptionLoading:",
                      isSubscriptionLoading
                    );
                    console.log("Current isSubscribed value:", isSubscribed);
                    console.log("isSubscribed type:", typeof isSubscribed);
                    console.log(
                      "isSubscribed === 'ACTIVE':",
                      isSubscribed === "ACTIVE"
                    );
                    console.log(
                      "isSubscribed == 'ACTIVE':",
                      isSubscribed == "ACTIVE"
                    );
                    console.log(
                      "Will show subscription flow:",
                      isSubscribed !== "ACTIVE"
                    );

                    if (isSubscriptionLoading) {
                      return (
                        <button
                          type="button"
                          disabled
                          className="w-full px-8 py-3 cursor-not-allowed bg-gray-300 text-gray-500 text-[1rem] font-semibold rounded-lg"
                        >
                          Caricamento...
                        </button>
                      );
                    }

                    return isSubscribed === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan || isBusinessGenerating}
                        className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPlan || isBusinessGenerating
                          ? "Generazione Piano..."
                          : "Genera Piano"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubscriptionPlan}
                        className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Genera Piano
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bottom Left Decorative Image */}
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 z-[-1] md:z-0">
              <img
                src="/images/dotted-down.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
