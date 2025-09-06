"use client";

import { useState, useEffect } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";

interface FinancialPlanForm {
  yourOwnEquity: string;
  bankingSystem: string;
  otherInvestors: string;
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

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step9", form);
  }, [form, updateFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step9", form);

    // Validate the form before proceeding
    const isValid = validateStep(8); // 0-based index for step 9

    if (isValid) {
      console.log("Financial Plan Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Step 09 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Financial Plan
            </h2>
          </div>

          {/* Form */}
          <div className="p-4 md:p-8 relative">
            {/* Top Right Decorative Image */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
              <img
                src="/images/dotted-top.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="bg-white rounded-2xl p-4 m-2 md:p-8 md:m-8 shadow-lg relative"
              style={{
                boxShadow:
                  "0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question: How do you plan to finance your business idea? */}
                <div>
                  <label className="question-text">
                    How do you plan to finance your business idea?
                  </label>

                  {/* Your own equity */}
                  <div className="mt-6">
                    <label className="question-text">Your own equity:</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={form.yourOwnEquity}
                        onChange={(e) =>
                          handleInputChange("yourOwnEquity", e.target.value)
                        }
                        placeholder="Enter your own equity amount"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Banking System */}
                  <div className="mt-6">
                    <label className="question-text">Banking System:</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={form.bankingSystem}
                        onChange={(e) =>
                          handleInputChange("bankingSystem", e.target.value)
                        }
                        placeholder="Enter banking system details"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Other investors */}
                  <div className="mt-6">
                    <label className="question-text">Other investors:</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={form.otherInvestors}
                        onChange={(e) =>
                          handleInputChange("otherInvestors", e.target.value)
                        }
                        placeholder="Enter other investors details"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full py-3 cursor-pointer bg-white border border-[#888888] text-accent text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Next
                  </button>
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
