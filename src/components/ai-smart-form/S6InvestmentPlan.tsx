"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
import { FiPlus } from "react-icons/fi";

interface InvestmentItem {
  id: string;
  description: string;
  amount: string;
  showOptions?: boolean;
}

interface InvestmentPlanForm {
  initialInvestment: string;
  customInitialInvestment: string[];
  showInitialInvestmentOptions: boolean;
  investmentItems: InvestmentItem[];
}

export default function S6InvestmentPlan() {
  const {
    nextStep,
    prevStep,
    getFormData,
    updateFormData,
    errors,
    validateStep,
  } = useSmartForm();
  const [getAISuggestions] = useGetAISuggestionsMutation();

  // AI suggestions state
  const [initialInvestmentAiSuggestions, setInitialInvestmentAiSuggestions] =
    useState<string[]>([]);
  const [investmentItemAiSuggestions, setInvestmentItemAiSuggestions] =
    useState<string[]>([]);

  // Loading states
  const [
    isLoadingInitialInvestmentSuggestions,
    setIsLoadingInitialInvestmentSuggestions,
  ] = useState(false);
  const [
    isLoadingInvestmentItemSuggestions,
    setIsLoadingInvestmentItemSuggestions,
  ] = useState(false);

  const persistedData = getFormData("step6");

  const [form, setForm] = useState<InvestmentPlanForm>(
    persistedData || {
      initialInvestment: "",
      customInitialInvestment: [],
      showInitialInvestmentOptions: false,
      investmentItems: [
        { id: "1", description: "", amount: "", showOptions: false },
        { id: "2", description: "", amount: "", showOptions: false },
        { id: "3", description: "", amount: "", showOptions: false },
      ],
    }
  );

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step6", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for initial investment
  const fetchInitialInvestmentAISuggestions = async () => {
    setIsLoadingInitialInvestmentSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What will you spend your initial investment on?",
        context: "business investment categories and startup expenses",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setInitialInvestmentAiSuggestions(response.suggestions);
      } else {
        setInitialInvestmentAiSuggestions([
          "Equipment",
          "Inventory",
          "Marketing & Advertising",
          "Technology & Software",
          "Office Setup",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI initial investment suggestions:", error);
      setInitialInvestmentAiSuggestions([
        "Equipment",
        "Inventory",
        "Marketing & Advertising",
        "Technology & Software",
        "Office Setup",
      ]);
    } finally {
      setIsLoadingInitialInvestmentSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for investment items
  const fetchInvestmentItemAISuggestions = async () => {
    setIsLoadingInvestmentItemSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What specific investment items do you need?",
        context: "business investment items and startup costs",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setInvestmentItemAiSuggestions(response.suggestions);
      } else {
        setInvestmentItemAiSuggestions([
          "Equipment Purchase",
          "Inventory Stock",
          "Marketing Campaign",
          "Technology Setup",
          "Office Rent",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI investment item suggestions:", error);
      setInvestmentItemAiSuggestions([
        "Equipment Purchase",
        "Inventory Stock",
        "Marketing Campaign",
        "Technology Setup",
        "Office Rent",
      ]);
    } finally {
      setIsLoadingInvestmentItemSuggestions(false);
    }
  };

  const handleInputChange = (
    field: keyof InvestmentPlanForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomOption = (
    field: "customInitialInvestment",
    value: string
  ) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "customInitialInvestment",
    textareaField: "initialInvestment"
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = form[textareaField] as string;
      if (value.trim()) {
        handleAddCustomOption(field, value);
        setForm((prev) => ({ ...prev, [textareaField]: "" }));
      }
    }
  };

  // Refs for dropdown containers
  const initialInvestmentDropdownRef = useRef<HTMLDivElement>(null);
  const investmentItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        initialInvestmentDropdownRef.current &&
        !initialInvestmentDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showInitialInvestmentOptions: false }));
      }
      // Close investment item dropdowns
      Object.entries(investmentItemRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setForm((prev) => ({
            ...prev,
            investmentItems: prev.investmentItems.map((item) =>
              item.id === id ? { ...item, showOptions: false } : item
            ),
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Option selection handlers
  const handleInitialInvestmentOptionSelect = (option: string) => {
    setForm((prev) => ({
      ...prev,
      initialInvestment: option,
      showInitialInvestmentOptions: false,
    }));
  };

  const handleInvestmentItemOptionSelect = (itemId: string, option: string) => {
    setForm((prev) => ({
      ...prev,
      investmentItems: prev.investmentItems.map((item) =>
        item.id === itemId
          ? { ...item, description: option, showOptions: false }
          : item
      ),
    }));
  };

  const handleTextareaClick = (optionField: "showInitialInvestmentOptions") => {
    const isCurrentlyOpen = form[optionField];

    setForm((prev) => ({
      ...prev,
      [optionField]: !prev[optionField],
      investmentItems: prev.investmentItems.map((item) => ({
        ...item,
        showOptions: false,
      })),
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen && initialInvestmentAiSuggestions.length === 0) {
      fetchInitialInvestmentAISuggestions();
    }
  };

  const handleInvestmentItemChange = (
    id: string,
    field: "description" | "amount",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      investmentItems: prev.investmentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleInvestmentItemClick = (id: string) => {
    const isCurrentlyOpen = form.investmentItems.find(
      (item) => item.id === id
    )?.showOptions;

    setForm((prev) => ({
      ...prev,
      showInitialInvestmentOptions: false,
      investmentItems: prev.investmentItems.map((item) =>
        item.id === id
          ? { ...item, showOptions: !item.showOptions }
          : { ...item, showOptions: false }
      ),
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen && investmentItemAiSuggestions.length === 0) {
      fetchInvestmentItemAISuggestions();
    }
  };

  const addInvestmentItem = () => {
    const newId = (form.investmentItems.length + 1).toString();
    setForm((prev) => ({
      ...prev,
      investmentItems: [
        ...prev.investmentItems,
        { id: newId, description: "", amount: "", showOptions: false },
      ],
    }));
  };

  const calculateTotal = () => {
    return form.investmentItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step6", form);

    // Validate the form before proceeding
    const isValid = validateStep(5); // 0-based index for step 6

    if (isValid) {
      console.log("Investment Plan Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  const handleTextareaChange = (
    field: keyof InvestmentPlanForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Step 06 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Investment Plan
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
                {/* Question: What will you spend your initial investment on? */}
                <div>
                  <label className="question-text">
                    What will you spend your initial investment on ?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.initialInvestment}
                      onChange={(e) =>
                        handleTextareaChange(
                          "initialInvestment",
                          e.target.value
                        )
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customInitialInvestment",
                          "initialInvestment"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showInitialInvestmentOptions")
                      }
                      placeholder="Equipment"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showInitialInvestmentOptions && (
                    <div
                      ref={initialInvestmentDropdownRef}
                      className="mt-4 space-y-2"
                    >
                      {/* AI Suggestions */}
                      {isLoadingInitialInvestmentSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Loading AI suggestions...
                          </span>
                        </div>
                      ) : (
                        initialInvestmentAiSuggestions.map((option, index) => (
                          <button
                            key={`${option}-${index}`}
                            type="button"
                            onClick={() =>
                              handleInitialInvestmentOptionSelect(option)
                            }
                            className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3 ml-7"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customInitialInvestment.map((option, index) => (
                        <button
                          key={`custom-investment-${index}`}
                          type="button"
                          onClick={() =>
                            handleInitialInvestmentOptionSelect(option)
                          }
                          className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3 ml-7"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Investment Items Section */}
                <div className="space-y-6">
                  {/* Headers */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[1rem] font-medium text-accent">
                        Investment Item
                      </label>
                    </div>
                    <div>
                      <label className="text-[1rem] font-medium text-accent">
                        Investment Amount
                      </label>
                    </div>
                  </div>

                  {/* Investment Items */}
                  {form.investmentItems.map((item, index) => (
                    <div key={item.id} className="space-y-4">
                      {/* Main row with serial number, textarea, and amount */}
                      <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-4">
                          <label className="text-[0.875rem] font-medium text-accent flex-shrink-0">
                            0{index + 1}.
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleInvestmentItemChange(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            onClick={() => handleInvestmentItemClick(item.id)}
                            placeholder="Write item here"
                            className="flex-1 px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                          />
                        </div>
                        <div className="flex items-center gap-4 ml-8 md:ml-0">
                          <label className="text-[0.875rem] font-medium text-accent flex-shrink-0 md:hidden">
                            Amount:
                          </label>
                          <input
                            type="text"
                            value={item.amount}
                            onChange={(e) =>
                              handleInvestmentItemChange(
                                item.id,
                                "amount",
                                e.target.value
                              )
                            }
                            placeholder="E.g. 20000"
                            className="flex-1 px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                          />
                        </div>
                      </div>

                      {/* Sub-options for investment items */}
                      {item.showOptions && (
                        <div
                          ref={(el) => {
                            investmentItemRefs.current[item.id] = el;
                          }}
                          className="ml-8 space-y-1"
                        >
                          {/* AI Suggestions */}
                          {isLoadingInvestmentItemSuggestions ? (
                            <div className="flex items-center p-2 rounded-lg">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-[0.875rem] font-normal text-gray-500 ml-2">
                                Loading AI suggestions...
                              </span>
                            </div>
                          ) : (
                            investmentItemAiSuggestions.map(
                              (option, optIndex) => (
                                <button
                                  key={`item-${item.id}-option-${optIndex}`}
                                  type="button"
                                  onClick={() =>
                                    handleInvestmentItemOptionSelect(
                                      item.id,
                                      option
                                    )
                                  }
                                  className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                                >
                                  <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-2 ml-4"></div>
                                  <span className="text-[1rem] font-normal text-accent">
                                    {option}
                                  </span>
                                </button>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Investment Item Button */}
                  <div className="flex justify-start ml-9">
                    <button
                      type="button"
                      onClick={addInvestmentItem}
                      className="flex items-center px-6 py-3 bg-[#A9A4FE] text-white text-[0.875rem] font-medium rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                      <FiPlus className="w-5 h-5 mr-2" />
                      Add New Item
                    </button>
                  </div>

                  {/* Total Investment */}
                  <div className="text-center pt-6">
                    <p className="text-[1.25rem] font-medium text-accent">
                      Total Initial Investment: €
                      {calculateTotal().toLocaleString()}
                    </p>
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
