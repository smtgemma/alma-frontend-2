"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
//
interface IndustryMarketForm {
  industry: string;
  idealClient: string;
  clientType01: string;
  clientType02: string;
  clientType03: string;
  clientType04: string;
  marketingPlan: string;
  customIndustry: string[];
  customIdealClient: string[];
  customClientType01: string[];
  customClientType02: string[];
  customClientType03: string[];
  customClientType04: string[];
  customMarketingPlan: string[];
  selectedIndustryOptions: string[];
  selectedIdealClientOptions: string[];
  selectedClientType01Options: string[];
  selectedClientType02Options: string[];
  selectedClientType03Options: string[];
  selectedClientType04Options: string[];
  selectedMarketingPlanOptions: string[];
  showIndustryOptions: boolean;
  showIdealClientOptions: boolean;
  showClientType01Options: boolean;
  showClientType02Options: boolean;
  showClientType03Options: boolean;
  showClientType04Options: boolean;
  showMarketingPlanOptions: boolean;
}

export default function S5IndustryMarket() {
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
  const [industryAiSuggestions, setIndustryAiSuggestions] = useState<string[]>(
    []
  );
  const [idealClientAiSuggestions, setIdealClientAiSuggestions] = useState<
    string[]
  >([]);
  const [clientTypeAiSuggestions, setClientTypeAiSuggestions] = useState<
    string[]
  >([]);
  const [marketingPlanAiSuggestions, setMarketingPlanAiSuggestions] = useState<
    string[]
  >([]);

  // Loading states
  const [isLoadingIndustrySuggestions, setIsLoadingIndustrySuggestions] =
    useState(false);
  const [isLoadingIdealClientSuggestions, setIsLoadingIdealClientSuggestions] =
    useState(false);
  const [isLoadingClientTypeSuggestions, setIsLoadingClientTypeSuggestions] =
    useState(false);
  const [
    isLoadingMarketingPlanSuggestions,
    setIsLoadingMarketingPlanSuggestions,
  ] = useState(false);

  // Refs for dropdowns
  const industryDropdownRef = useRef<HTMLDivElement>(null);
  const idealClientDropdownRef = useRef<HTMLDivElement>(null);
  const clientTypeDropdownRef = useRef<HTMLDivElement>(null);
  const marketingPlanDropdownRef = useRef<HTMLDivElement>(null);

  const persistedData = getFormData("step5");

  const [form, setForm] = useState<IndustryMarketForm>(
    persistedData || {
      industry: "",
      idealClient: "",
      clientType01: "",
      clientType02: "",
      clientType03: "",
      clientType04: "",
      marketingPlan: "",
      customIndustry: [],
      customIdealClient: [],
      customClientType01: [],
      customClientType02: [],
      customClientType03: [],
      customClientType04: [],
      customMarketingPlan: [],
      selectedIndustryOptions: [],
      selectedIdealClientOptions: [],
      selectedClientType01Options: [],
      selectedClientType02Options: [],
      selectedClientType03Options: [],
      selectedClientType04Options: [],
      selectedMarketingPlanOptions: [],
      showIndustryOptions: false,
      showIdealClientOptions: false,
      showClientType01Options: false,
      showClientType02Options: false,
      showClientType03Options: false,
      showClientType04Options: false,
      showMarketingPlanOptions: false,
    }
  );

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step5", form);
  }, [form, updateFormData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        industryDropdownRef.current &&
        !industryDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showIndustryOptions: false }));
      }
      if (
        idealClientDropdownRef.current &&
        !idealClientDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showIdealClientOptions: false }));
      }
      if (
        clientTypeDropdownRef.current &&
        !clientTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({
          ...prev,
          showClientType01Options: false,
          showClientType02Options: false,
          showClientType03Options: false,
          showClientType04Options: false,
        }));
      }
      if (
        marketingPlanDropdownRef.current &&
        !marketingPlanDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showMarketingPlanOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to fetch AI suggestions for industry
  const fetchIndustryAISuggestions = async () => {
    setIsLoadingIndustrySuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What industry does your business operate in?",
        context: "business industry and sector",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setIndustryAiSuggestions(response.suggestions);
      } else {
        setIndustryAiSuggestions([
          "Technology & Software",
          "Healthcare & Medical",
          "E-commerce & Retail",
          "Education & Training",
          "Food & Beverage",
          "Finance & Banking",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI industry suggestions:", error);
      setIndustryAiSuggestions([
        "Technology & Software",
        "Healthcare & Medical",
        "E-commerce & Retail",
        "Education & Training",
        "Food & Beverage",
        "Finance & Banking",
      ]);
    } finally {
      setIsLoadingIndustrySuggestions(false);
    }
  };

  // Function to fetch AI suggestions for ideal client
  const fetchIdealClientAISuggestions = async () => {
    setIsLoadingIdealClientSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "Who is your ideal client?",
        context: "target audience and ideal customers",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setIdealClientAiSuggestions(response.suggestions);
      } else {
        setIdealClientAiSuggestions([
          "Small Business Owners",
          "Entrepreneurs",
          "Corporate Executives",
          "Young Professionals",
          "Students",
          "Families",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI ideal client suggestions:", error);
      setIdealClientAiSuggestions([
        "Small Business Owners",
        "Entrepreneurs",
        "Corporate Executives",
        "Young Professionals",
        "Students",
        "Families",
      ]);
    } finally {
      setIsLoadingIdealClientSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for client types
  const fetchClientTypeAISuggestions = async () => {
    setIsLoadingClientTypeSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What type of clients will you serve?",
        context: "client types and business models",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setClientTypeAiSuggestions(response.suggestions);
      } else {
        setClientTypeAiSuggestions([
          "B2B (Business to Business)",
          "B2C (Business to Consumer)",
          "B2G (Business to Government)",
          "Enterprise Clients",
          "SME (Small & Medium Enterprises)",
          "Startups",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI client type suggestions:", error);
      setClientTypeAiSuggestions([
        "B2B (Business to Business)",
        "B2C (Business to Consumer)",
        "B2G (Business to Government)",
        "Enterprise Clients",
        "SME (Small & Medium Enterprises)",
        "Startups",
      ]);
    } finally {
      setIsLoadingClientTypeSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for marketing plan
  const fetchMarketingPlanAISuggestions = async () => {
    setIsLoadingMarketingPlanSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What marketing plan will you use to reach your clients?",
        context: "marketing strategies and channels",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setMarketingPlanAiSuggestions(response.suggestions);
      } else {
        setMarketingPlanAiSuggestions([
          "Digital Marketing & Social Media",
          "Content Marketing & Blogging",
          "Email Marketing Campaigns",
          "Search Engine Optimization (SEO)",
          "Pay-Per-Click Advertising (PPC)",
          "Influencer Marketing",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI marketing plan suggestions:", error);
      setMarketingPlanAiSuggestions([
        "Digital Marketing & Social Media",
        "Content Marketing & Blogging",
        "Email Marketing Campaigns",
        "Search Engine Optimization (SEO)",
        "Pay-Per-Click Advertising (PPC)",
        "Influencer Marketing",
      ]);
    } finally {
      setIsLoadingMarketingPlanSuggestions(false);
    }
  };

  const handleRadioChange = (
    field: keyof IndustryMarketForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomOption = (
    field:
      | "customIndustry"
      | "customIdealClient"
      | "customClientType01"
      | "customClientType02"
      | "customClientType03"
      | "customClientType04"
      | "customMarketingPlan",
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
    field:
      | "customIndustry"
      | "customIdealClient"
      | "customClientType01"
      | "customClientType02"
      | "customClientType03"
      | "customClientType04"
      | "customMarketingPlan",
    inputField: keyof IndustryMarketForm
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = form[inputField] as string;
      if (value.trim()) {
        handleAddCustomOption(field, value);
        setForm((prev) => ({ ...prev, [inputField]: "" }));
      }
    }
  };

  // Handle dropdown clicks with AI fetching
  const handleTextareaClick = (
    optionField:
      | "showIndustryOptions"
      | "showIdealClientOptions"
      | "showClientType01Options"
      | "showClientType02Options"
      | "showClientType03Options"
      | "showClientType04Options"
      | "showMarketingPlanOptions"
  ) => {
    const isCurrentlyOpen = form[optionField];

    setForm((prev) => ({
      ...prev,
      showIndustryOptions:
        optionField === "showIndustryOptions"
          ? !prev.showIndustryOptions
          : false,
      showIdealClientOptions:
        optionField === "showIdealClientOptions"
          ? !prev.showIdealClientOptions
          : false,
      showClientType01Options:
        optionField === "showClientType01Options"
          ? !prev.showClientType01Options
          : false,
      showClientType02Options:
        optionField === "showClientType02Options"
          ? !prev.showClientType02Options
          : false,
      showClientType03Options:
        optionField === "showClientType03Options"
          ? !prev.showClientType03Options
          : false,
      showClientType04Options:
        optionField === "showClientType04Options"
          ? !prev.showClientType04Options
          : false,
      showMarketingPlanOptions:
        optionField === "showMarketingPlanOptions"
          ? !prev.showMarketingPlanOptions
          : false,
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen) {
      if (
        optionField === "showIndustryOptions" &&
        industryAiSuggestions.length === 0
      ) {
        fetchIndustryAISuggestions();
      } else if (
        optionField === "showIdealClientOptions" &&
        idealClientAiSuggestions.length === 0
      ) {
        fetchIdealClientAISuggestions();
      } else if (
        (optionField === "showClientType01Options" ||
          optionField === "showClientType02Options" ||
          optionField === "showClientType03Options" ||
          optionField === "showClientType04Options") &&
        clientTypeAiSuggestions.length === 0
      ) {
        fetchClientTypeAISuggestions();
      } else if (
        optionField === "showMarketingPlanOptions" &&
        marketingPlanAiSuggestions.length === 0
      ) {
        fetchMarketingPlanAISuggestions();
      }
    }
  };

  // Option selection handlers for multiple selection
  const handleIndustryOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedIndustryOptions;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedIndustryOptions: newOptions,
        industry: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleIdealClientOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedIdealClientOptions;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedIdealClientOptions: newOptions,
        idealClient: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleClientType01OptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedClientType01Options;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedClientType01Options: newOptions,
        clientType01: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleClientType02OptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedClientType02Options;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedClientType02Options: newOptions,
        clientType02: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleClientType03OptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedClientType03Options;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedClientType03Options: newOptions,
        clientType03: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleClientType04OptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedClientType04Options;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedClientType04Options: newOptions,
        clientType04: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleMarketingPlanOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedMarketingPlanOptions;
      const isSelected = currentOptions.includes(option);

      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }

      return {
        ...prev,
        selectedMarketingPlanOptions: newOptions,
        marketingPlan: newOptions.join(", "), // Set input field value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step5", form);

    // Validate the form before proceeding
    const isValid = validateStep(4); // 0-based index for step 5

    if (isValid) {
      console.log("Industry & Market Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  const handleTextareaChange = (
    field: keyof IndustryMarketForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 05 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Settore Industriale e di Mercato
            </h2>
          </div>

          {/* Form */}
          <div className="p-2 md:p-8 relative">
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
                {/* Question 1: Which industry does your business belong to? */}
                <div>
                  <label className="question-text">
                    A quale industria appartiene la tua azienda? (Obbligatorio)
                  </label>
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.industry}
                    </p>
                  )}
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.industry}
                      onChange={(e) =>
                        handleTextareaChange("industry", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customIndustry", "industry")
                      }
                      onClick={() => handleTextareaClick("showIndustryOptions")}
                      placeholder="Es. Tecnologia, Finanza, Sanità, Consulenza Legale, Servizi Alimentari..."
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.industry
                          ? "border-red-500"
                          : "border-[#888888]/30"
                      }`}
                    />

                    {/* Selected Options Display */}
                    {form.selectedIndustryOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedIndustryOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span className="mr-2">{option}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleIndustryOptionSelect(option)
                                }
                                className="text-primary hover:text-primary/70"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-options */}
                  {form.showIndustryOptions && (
                    <div className="mt-4 space-y-2" ref={industryDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingIndustrySuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        industryAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedIndustryOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleIndustryOptionSelect(option)}
                              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[1rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          );
                        })
                      )}

                      {/* Custom options */}
                      {form.customIndustry.map((option, index) => {
                        const isSelected =
                          form.selectedIndustryOptions.includes(option);
                        return (
                          <button
                            key={`custom-industry-${index}`}
                            type="button"
                            onClick={() => handleIndustryOptionSelect(option)}
                            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Question 2: Who is your ideal client? */}
                <div>
                  <label className="question-text">
                    Chi è il tuo cliente ideale?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.idealClient}
                      onChange={(e) =>
                        handleTextareaChange("idealClient", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customIdealClient", "idealClient")
                      }
                      onClick={() =>
                        handleTextareaClick("showIdealClientOptions")
                      }
                      placeholder="Es. Professionisti, Startup Tech, Marchi Retail, Sanità..."
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent "
                    />

                    {/* Selected Options Display */}
                    {form.selectedIdealClientOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedIdealClientOptions.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleIdealClientOptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-options */}
                  {form.showIdealClientOptions && (
                    <div
                      className="mt-4 space-y-2"
                      ref={idealClientDropdownRef}
                    >
                      {/* AI Suggestions */}
                      {isLoadingIdealClientSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        idealClientAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedIdealClientOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleIdealClientOptionSelect(option)
                              }
                              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[1rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          );
                        })
                      )}

                      {/* Custom options */}
                      {form.customIdealClient.map((option, index) => {
                        const isSelected =
                          form.selectedIdealClientOptions.includes(option);
                        return (
                          <button
                            key={`custom-client-${index}`}
                            type="button"
                            onClick={() =>
                              handleIdealClientOptionSelect(option)
                            }
                            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Client Type Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Type 01 */}
                  <div>
                    <label className="text-[1rem] font-medium text-accent mb-2 block">
                      Tipo Cliente 01
                    </label>
                    <input
                      type="text"
                      value={form.clientType01}
                      onChange={(e) =>
                        handleTextareaChange("clientType01", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customClientType01", "clientType01")
                      }
                      onClick={() =>
                        handleTextareaClick("showClientType01Options")
                      }
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedClientType01Options.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedClientType01Options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleClientType01OptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sub-options */}
                    {form.showClientType01Options && (
                      <div
                        className="mt-2 space-y-1"
                        ref={clientTypeDropdownRef}
                      >
                        {/* AI Suggestions */}
                        {isLoadingClientTypeSuggestions ? (
                          <div className="flex items-center p-2 rounded-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[0.875rem] font-normal text-gray-500 ml-2">
                              Caricamento suggerimenti AI...
                            </span>
                          </div>
                        ) : (
                          clientTypeAiSuggestions.map((option) => {
                            const isSelected =
                              form.selectedClientType01Options.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  handleClientType01OptionSelect(option)
                                }
                                className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 border-2 rounded mr-2 ml-4 flex items-center justify-center ${
                                    isSelected
                                      ? "bg-primary border-primary"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-[0.875rem] font-normal text-accent">
                                  {option}
                                </span>
                              </button>
                            );
                          })
                        )}

                        {/* Custom options */}
                        {form.customClientType01.map((option, index) => {
                          const isSelected =
                            form.selectedClientType01Options.includes(option);
                          return (
                            <button
                              key={`custom-type01-${index}`}
                              type="button"
                              onClick={() =>
                                handleClientType01OptionSelect(option)
                              }
                              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-2 ml-4 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[0.875rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Client Type 02 */}
                  <div>
                    <label className="text-[1rem] font-medium text-accent mb-2 block">
                      Tipo Cliente 02
                    </label>
                    <input
                      type="text"
                      value={form.clientType02}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          clientType02: e.target.value,
                        }))
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customClientType02", "clientType02")
                      }
                      onClick={() =>
                        handleTextareaClick("showClientType02Options")
                      }
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedClientType02Options.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedClientType02Options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleClientType02OptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sub-options */}
                    {form.showClientType02Options && (
                      <div
                        className="mt-2 space-y-1"
                        ref={clientTypeDropdownRef}
                      >
                        {/* AI Suggestions */}
                        {isLoadingClientTypeSuggestions ? (
                          <div className="flex items-center p-2 rounded-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[0.875rem] font-normal text-gray-500 ml-2">
                              Caricamento suggerimenti AI...
                            </span>
                          </div>
                        ) : (
                          clientTypeAiSuggestions.map((option) => {
                            const isSelected =
                              form.selectedClientType02Options.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  handleClientType02OptionSelect(option)
                                }
                                className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 border-2 rounded mr-2 ml-4 flex items-center justify-center ${
                                    isSelected
                                      ? "bg-primary border-primary"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-[0.875rem] font-normal text-accent">
                                  {option}
                                </span>
                              </button>
                            );
                          })
                        )}

                        {/* Custom options */}
                        {form.customClientType02.map((option, index) => {
                          const isSelected =
                            form.selectedClientType02Options.includes(option);
                          return (
                            <button
                              key={`custom-type02-${index}`}
                              type="button"
                              onClick={() =>
                                handleClientType02OptionSelect(option)
                              }
                              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-2 ml-4 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[0.875rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Client Type 03 */}
                  <div>
                    <label className="text-[1rem] font-medium text-accent mb-2 block">
                      Tipo Cliente 03
                    </label>
                    <input
                      type="text"
                      value={form.clientType03}
                      onChange={(e) =>
                        handleTextareaChange("clientType03", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customClientType03", "clientType03")
                      }
                      onClick={() =>
                        handleTextareaClick("showClientType03Options")
                      }
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedClientType03Options.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedClientType03Options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleClientType03OptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sub-options */}
                    {form.showClientType03Options && (
                      <div
                        className="mt-2 space-y-1"
                        ref={clientTypeDropdownRef}
                      >
                        {/* AI Suggestions */}
                        {isLoadingClientTypeSuggestions ? (
                          <div className="flex items-center p-2 rounded-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[0.875rem] font-normal text-gray-500 ml-2">
                              Caricamento suggerimenti AI...
                            </span>
                          </div>
                        ) : (
                          clientTypeAiSuggestions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleClientType03OptionSelect(option)
                              }
                              className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                              <div className="w-1 h-1 bg-[#6B4AFF] rounded-full mr-2 ml-4"></div>
                              <span className="text-[0.875rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          ))
                        )}

                        {/* Custom options */}
                        {form.customClientType03.map((option, index) => (
                          <button
                            key={`custom-type03-${index}`}
                            type="button"
                            onClick={() =>
                              handleClientType03OptionSelect(option)
                            }
                            className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <div className="w-1 h-1 bg-[#6B4AFF] rounded-full mr-2 ml-4"></div>
                            <span className="text-[0.875rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Client Type 04 */}
                  <div>
                    <label className="text-[1rem] font-medium text-accent mb-2 block">
                      Client Type 04
                    </label>
                    <input
                      type="text"
                      value={form.clientType04}
                      onChange={(e) =>
                        handleTextareaChange("clientType04", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customClientType04", "clientType04")
                      }
                      onClick={() =>
                        handleTextareaClick("showClientType04Options")
                      }
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedClientType04Options.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedClientType04Options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleClientType04OptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sub-options */}
                    {form.showClientType04Options && (
                      <div
                        className="mt-2 space-y-1"
                        ref={clientTypeDropdownRef}
                      >
                        {/* AI Suggestions */}
                        {isLoadingClientTypeSuggestions ? (
                          <div className="flex items-center p-2 rounded-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[0.875rem] font-normal text-gray-500 ml-2">
                              Caricamento suggerimenti AI...
                            </span>
                          </div>
                        ) : (
                          clientTypeAiSuggestions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleClientType04OptionSelect(option)
                              }
                              className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                              <div className="w-1 h-1 bg-[#6B4AFF] rounded-full mr-2 ml-4"></div>
                              <span className="text-[0.875rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          ))
                        )}

                        {/* Custom options */}
                        {form.customClientType04.map((option, index) => (
                          <button
                            key={`custom-type04-${index}`}
                            type="button"
                            onClick={() =>
                              handleClientType04OptionSelect(option)
                            }
                            className="flex items-center w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <div className="w-1 h-1 bg-[#6B4AFF] rounded-full mr-2 ml-4"></div>
                            <span className="text-[0.875rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question 4: How do you plan to reach them? (marketing plan schemes) */}
                <div>
                  <label className="question-text">
                    Come pianifichi di raggiungerli? (schemi del piano di
                    marketing)
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.marketingPlan}
                      onChange={(e) =>
                        handleTextareaChange("marketingPlan", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customMarketingPlan",
                          "marketingPlan"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showMarketingPlanOptions")
                      }
                      placeholder="Es. Marketing digitale e online, Influencer e Blogging, SEO e Blogging..."
                      className="w-full px-4 py-3 border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedMarketingPlanOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedMarketingPlanOptions.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMarketingPlanOptionSelect(option)
                                  }
                                  className="text-primary hover:text-primary/70"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-options */}
                  {form.showMarketingPlanOptions && (
                    <div
                      className="mt-4 space-y-2"
                      ref={marketingPlanDropdownRef}
                    >
                      {/* AI Suggestions */}
                      {isLoadingMarketingPlanSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        marketingPlanAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedMarketingPlanOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleMarketingPlanOptionSelect(option)
                              }
                              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[1rem] font-normal text-accent">
                                {option}
                              </span>
                            </button>
                          );
                        })
                      )}

                      {/* Custom options */}
                      {form.customMarketingPlan.map((option, index) => {
                        const isSelected =
                          form.selectedMarketingPlanOptions.includes(option);
                        return (
                          <button
                            key={`custom-marketing-${index}`}
                            type="button"
                            onClick={() =>
                              handleMarketingPlanOptionSelect(option)
                            }
                            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-7 flex items-center justify-center ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                  <button
                    type="submit"
                    className="w-full py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Avanti
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
