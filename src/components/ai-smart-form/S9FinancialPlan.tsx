"use client";

import { useState, useEffect } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { parseEuro, formatEuro } from "@/utils/euFormat";
import { toast } from "sonner";
//
function sanitizeEuroInput(raw: string): string {
  return (raw || "").replace(/[^0-9.,]/g, "");
}

interface FinancialPlanForm {
  yourOwnEquity: string; // numeric-only string
  bankingSystem: string; // numeric-only string
  otherInvestors: string; // numeric-only string
}

export default function S9FinancialPlan() {
  const {
    nextStep,
    prevStep,
    getFormData,
    updateFormData,
    errors,
    validateStep,
  } = useSmartForm();

  const persistedData = getFormData("step9");

  const [form, setForm] = useState<FinancialPlanForm>(
    persistedData || {
      yourOwnEquity: "",
      bankingSystem: "",
      otherInvestors: "",
    }
  );

  const handleInputChange = (field: keyof FinancialPlanForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoneyChange = (field: keyof FinancialPlanForm, value: string) => {
    const sanitized = sanitizeEuroInput(value);
    setForm((prev) => ({ ...prev, [field]: sanitized }));
  };

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step9", form);
  }, [form, updateFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute totals: investments (Step 6) vs financing (this step)
    const step6 = getFormData("step6") as any;
    const totalInvestments = step6?.totals?.totalInvestment ?? (() => {
      const dynamicInvestmentTotal = (step6?.investmentItems || []).reduce(
        (sum: number, it: any) => sum + (Number(it.amount) || 0),
        0
      );
      const fixedInvestmentTotal = (step6?.fixedInvestments || []).reduce(
        (sum: number, it: any) => sum + (Number(it.amount) || parseEuro(it.amount || "0") || 0),
        0
      );
      return dynamicInvestmentTotal + fixedInvestmentTotal;
    })();

    const equity = parseEuro(form.yourOwnEquity) || 0;
    const bank = parseEuro(form.bankingSystem) || 0;
    const other = parseEuro(form.otherInvestors) || 0;
    const financingTotal = equity + bank + other;
    const fundingGap = Number((totalInvestments - financingTotal).toFixed(2));

    const payload: any = {
      sources: {
        equity,
        bankLoan: bank,
        otherInvestors: other,
        total: financingTotal,
      },
      requiredInvestment: totalInvestments,
      fundingGap: fundingGap > 0 ? fundingGap : 0,
      accountingMapping: {
        statoPatrimoniale: {
          patrimonioNetto: equity,
          passivita: { debitiFinanziari: bank + other },
        },
      },
    };

    // Save current form data to context before validation
    updateFormData("step9", payload);

    // Validate the form before proceeding
    const isValid = validateStep(8); // 0-based index for step 9

    if (fundingGap > 0) {
      toast.error(
        `Funding Gap: mancano ${formatEuro(fundingGap, { decimals: 2 })} per coprire l'investimento totale.`
      );
      return;
    }

    if (isValid) {
      console.log("Financial Plan Form Submitted:", payload);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 09 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words">
              Piano Finanziario
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question: How do you plan to finance your business idea? */}
                <div>
                  <label className="question-text">
                    Come pianifichi di finanziare la tua idea di business?
                  </label>

                  {/* Totale investimento richiesto (Step 6) */}
                  <div className="mt-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg p-4">
                    {(() => {
                      const s6 = getFormData("step6") as any;
                      const required = s6?.totals?.totalInvestment ?? 0;
                      return (
                        <div className="flex justify-between text-[1rem] text-accent">
                          <span>Investimento totale (da Step 6)</span>
                          <span className="font-medium">{formatEuro(required, { decimals: 2 })}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Your own equity */}
                  <div className="mt-6">
                    <label className="question-text">
                      Il tuo capitale proprio:
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={form.yourOwnEquity}
                        onChange={(e) => handleMoneyChange("yourOwnEquity", e.target.value)}
                        placeholder="Es. 50.000"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Banking System */}
                  <div className="mt-6">
                    <label className="question-text">Sistema Bancario:</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={form.bankingSystem}
                        onChange={(e) => handleMoneyChange("bankingSystem", e.target.value)}
                        placeholder="Es. 80.000 (prestiti bancari)"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Other investors */}
                  <div className="mt-6">
                    <label className="question-text">Altri investitori:</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={form.otherInvestors}
                        onChange={(e) => handleMoneyChange("otherInvestors", e.target.value)}
                        placeholder="Es. 20.000 (altri finanziatori)"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Totali e Gap */}
                  <div className="mt-6 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg p-4 space-y-2">
                    {(() => {
                      const s6 = getFormData("step6") as any;
                      const required = s6?.totals?.totalInvestment ?? 0;
                      const equity = parseEuro(form.yourOwnEquity) || 0;
                      const bank = parseEuro(form.bankingSystem) || 0;
                      const other = parseEuro(form.otherInvestors) || 0;
                      const total = equity + bank + other;
                      const gap = required - total;
                      return (
                        <>
                          <div className="flex justify-between text-[1rem] text-accent"><span>Totale fonti</span><span className="font-medium">{formatEuro(total, { decimals: 2 })}</span></div>
                          <div className={`flex justify-between text-[1rem] ${gap > 0 ? "text-red-600" : gap < 0 ? "text-yellow-600" : "text-green-600"}`}>
                            <span>{gap >= 0 ? "Funding Gap" : "Eccedenza di finanziamento"}</span>
                            <span className="font-medium">{formatEuro(Math.abs(gap), { decimals: 2 })}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full py-3 cursor-pointer bg-white border border-[#888888] text-accent text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Indietro
                  </button>
                  {(() => {
                    const s6 = getFormData("step6") as any;
                    const required = s6?.totals?.totalInvestment ?? 0;
                    const equity = parseEuro(form.yourOwnEquity) || 0;
                    const bank = parseEuro(form.bankingSystem) || 0;
                    const other = parseEuro(form.otherInvestors) || 0;
                    const total = equity + bank + other;
                    const hasGap = (required - total) > 0;
                    return (
                      <button
                        type="submit"
                        disabled={hasGap}
                        className={`w-full py-3 cursor-pointer text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                          hasGap
                            ? "bg-gray-300 text-white cursor-not-allowed opacity-70 hover:scale-100"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                        title={hasGap ? "Colma il funding gap per procedere" : undefined}
                      >
                        Avanti
                      </button>
                    );
                  })()}
                </div>
              </form>
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
