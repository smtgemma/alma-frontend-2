"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
//
interface ProductService {
  id: string;
  name: string;
  price: string;
  showOptions?: boolean;
  selectedOptions?: string[];
}

interface RevenueModelForm {
  expectedRevenue: string;
  growthProjection: string;
  businessShare: string;
  pricingLevel: string;
  customExpectedRevenue: string[];
  customGrowthProjection: string[];
  customBusinessShare: string[];
  customPricingLevel: string[];
  selectedExpectedRevenueOptions: string[];
  selectedGrowthProjectionOptions: string[];
  selectedBusinessShareOptions: string[];
  selectedPricingLevelOptions: string[];
  showExpectedRevenueOptions: boolean;
  showGrowthProjectionOptions: boolean;
  showBusinessShareOptions: boolean;
  showPricingLevelOptions: boolean;
  productServices: ProductService[];
}

export default function S7RevenueModelPricing() {
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
  const [expectedRevenueAiSuggestions, setExpectedRevenueAiSuggestions] =
    useState<string[]>([]);
  const [growthProjectionAiSuggestions, setGrowthProjectionAiSuggestions] =
    useState<string[]>([]);
  const [businessShareAiSuggestions, setBusinessShareAiSuggestions] = useState<
    string[]
  >([]);
  const [pricingLevelAiSuggestions, setPricingLevelAiSuggestions] = useState<
    string[]
  >([]);

  // Loading states
  const [
    isLoadingExpectedRevenueSuggestions,
    setIsLoadingExpectedRevenueSuggestions,
  ] = useState(false);
  const [
    isLoadingGrowthProjectionSuggestions,
    setIsLoadingGrowthProjectionSuggestions,
  ] = useState(false);
  const [
    isLoadingBusinessShareSuggestions,
    setIsLoadingBusinessShareSuggestions,
  ] = useState(false);
  const [
    isLoadingPricingLevelSuggestions,
    setIsLoadingPricingLevelSuggestions,
  ] = useState(false);

  // Refs for dropdown containers
  const expectedRevenueDropdownRef = useRef<HTMLDivElement>(null);
  const growthProjectionDropdownRef = useRef<HTMLDivElement>(null);
  const businessShareDropdownRef = useRef<HTMLDivElement>(null);
  const pricingLevelDropdownRef = useRef<HTMLDivElement>(null);

  const persistedData = getFormData("step7");

  const [form, setForm] = useState<RevenueModelForm>(
    persistedData || {
      expectedRevenue: "",
      growthProjection: "",
      businessShare: "",
      pricingLevel: "",
      customExpectedRevenue: [],
      customGrowthProjection: [],
      customBusinessShare: [],
      customPricingLevel: [],
      selectedExpectedRevenueOptions: [],
      selectedGrowthProjectionOptions: [],
      selectedBusinessShareOptions: [],
      selectedPricingLevelOptions: [],
      showExpectedRevenueOptions: false,
      showGrowthProjectionOptions: false,
      showBusinessShareOptions: false,
      showPricingLevelOptions: false,
      productServices: [
        {
          id: "1",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "2",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "3",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "4",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
      ],
    }
  );

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step7", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for expected revenue
  const fetchExpectedRevenueAISuggestions = async () => {
    setIsLoadingExpectedRevenueSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What are the expected revenues on the first year?",
        context: "business revenue projections and financial forecasts",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setExpectedRevenueAiSuggestions(response.suggestions);
      } else {
        setExpectedRevenueAiSuggestions([
          "Under €50,000",
          "€50,000 - €150,000",
          "€150,000 - €500,000",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI expected revenue suggestions:", error);
      setExpectedRevenueAiSuggestions([
        "Under €50,000",
        "€50,000 - €150,000",
        "€150,000 - €500,000",
      ]);
    } finally {
      setIsLoadingExpectedRevenueSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for growth projection
  const fetchGrowthProjectionAISuggestions = async () => {
    setIsLoadingGrowthProjectionSuggestions(true);

    try {
      const response = await getAISuggestions({
        question:
          "What percentage of growing do you expect from the second year?",
        context: "business growth projections and expansion rates",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setGrowthProjectionAiSuggestions(response.suggestions);
      } else {
        setGrowthProjectionAiSuggestions([
          "Under €50.000",
          "€150.000",
          "€250.000",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI growth projection suggestions:", error);
      setGrowthProjectionAiSuggestions([
        "Under €50.000",
        "€150.000",
        "€250.000",
      ]);
    } finally {
      setIsLoadingGrowthProjectionSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for business share
  const fetchBusinessShareAISuggestions = async () => {
    setIsLoadingBusinessShareSuggestions(true);

    try {
      const response = await getAISuggestions({
        question:
          "What percentage of business share will come from each group of product services?",
        context: "business revenue distribution and product service allocation",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setBusinessShareAiSuggestions(response.suggestions);
      } else {
        setBusinessShareAiSuggestions([
          "25% - 30%",
          "30% - 40%",
          "40% - 50%",
          "50% - 60%",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI business share suggestions:", error);
      setBusinessShareAiSuggestions([
        "25% - 30%",
        "30% - 40%",
        "40% - 50%",
        "50% - 60%",
      ]);
    } finally {
      setIsLoadingBusinessShareSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for pricing level
  const fetchPricingLevelAISuggestions = async () => {
    setIsLoadingPricingLevelSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What is the expected pricing level?",
        context: "pricing strategies and market positioning",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setPricingLevelAiSuggestions(response.suggestions);
      } else {
        setPricingLevelAiSuggestions([
          "Premium Pricing (High-end market)",
          "Competitive Pricing (Market average)",
          "Penetration Pricing (Below market)",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI pricing level suggestions:", error);
      setPricingLevelAiSuggestions([
        "Premium Pricing (High-end market)",
        "Competitive Pricing (Market average)",
        "Penetration Pricing (Below market)",
      ]);
    } finally {
      setIsLoadingPricingLevelSuggestions(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        expectedRevenueDropdownRef.current &&
        !expectedRevenueDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showExpectedRevenueOptions: false }));
      }
      if (
        growthProjectionDropdownRef.current &&
        !growthProjectionDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showGrowthProjectionOptions: false }));
      }
      if (
        businessShareDropdownRef.current &&
        !businessShareDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showBusinessShareOptions: false }));
      }
      if (
        pricingLevelDropdownRef.current &&
        !pricingLevelDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showPricingLevelOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof RevenueModelForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Option selection handlers for multiple selection
  const handleExpectedRevenueOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedExpectedRevenueOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedExpectedRevenueOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedExpectedRevenueOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleGrowthProjectionOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedGrowthProjectionOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedGrowthProjectionOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedGrowthProjectionOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleBusinessShareOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedBusinessShareOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedBusinessShareOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedBusinessShareOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handlePricingLevelOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedPricingLevelOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedPricingLevelOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedPricingLevelOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleAddCustomOption = (
    field:
      | "customExpectedRevenue"
      | "customGrowthProjection"
      | "customBusinessShare"
      | "customPricingLevel",
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
      | "customExpectedRevenue"
      | "customGrowthProjection"
      | "customBusinessShare"
      | "customPricingLevel",
    textareaField: keyof RevenueModelForm
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

  const handleTextareaClick = (
    optionField:
      | "showExpectedRevenueOptions"
      | "showGrowthProjectionOptions"
      | "showBusinessShareOptions"
      | "showPricingLevelOptions"
  ) => {
    const isCurrentlyOpen = form[optionField];

    setForm((prev) => ({
      ...prev,
      showExpectedRevenueOptions:
        optionField === "showExpectedRevenueOptions"
          ? !prev.showExpectedRevenueOptions
          : false,
      showGrowthProjectionOptions:
        optionField === "showGrowthProjectionOptions"
          ? !prev.showGrowthProjectionOptions
          : false,
      showBusinessShareOptions:
        optionField === "showBusinessShareOptions"
          ? !prev.showBusinessShareOptions
          : false,
      showPricingLevelOptions:
        optionField === "showPricingLevelOptions"
          ? !prev.showPricingLevelOptions
          : false,
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen) {
      if (
        optionField === "showExpectedRevenueOptions" &&
        expectedRevenueAiSuggestions.length === 0
      ) {
        fetchExpectedRevenueAISuggestions();
      } else if (
        optionField === "showGrowthProjectionOptions" &&
        growthProjectionAiSuggestions.length === 0
      ) {
        fetchGrowthProjectionAISuggestions();
      } else if (
        optionField === "showBusinessShareOptions" &&
        businessShareAiSuggestions.length === 0
      ) {
        fetchBusinessShareAISuggestions();
      } else if (
        optionField === "showPricingLevelOptions" &&
        pricingLevelAiSuggestions.length === 0
      ) {
        fetchPricingLevelAISuggestions();
      }
    }
  };

  const handleProductServiceChange = (
    id: string,
    field: "name" | "price",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      productServices: prev.productServices.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addProductService = () => {
    const newId = (form.productServices.length + 1).toString();
    setForm((prev) => ({
      ...prev,
      productServices: [
        ...prev.productServices,
        { id: newId, name: "", price: "" },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step7", form);

    // Validate the form before proceeding
    const isValid = validateStep(6); // 0-based index for step 7

    if (isValid) {
      console.log("Revenue Model & Pricing Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  function handleTextareaChange(field: string, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 07 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Modello di Ricavi e Prezzi
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
                {/* Question 1: What are the expected revenues on the first year? */}
                <div>
                  <label className="question-text">
                    Quali sono i ricavi previsti nel primo anno?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.expectedRevenue}
                      onChange={(e) =>
                        handleTextareaChange("expectedRevenue", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customExpectedRevenue",
                          "expectedRevenue"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showExpectedRevenueOptions")
                      }
                      placeholder="Inserisci una proiezione personalizzata"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showExpectedRevenueOptions && (
                    <div
                      ref={expectedRevenueDropdownRef}
                      className="mt-4 space-y-2"
                    >
                      {/* AI Suggestions */}
                      {isLoadingExpectedRevenueSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        expectedRevenueAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                expectedRevenue: option,
                                showExpectedRevenueOptions: false,
                              }));
                            }}
                            className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-7"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customExpectedRevenue.map((option, index) => (
                        <button
                          key={`custom-revenue-${index}`}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              expectedRevenue: option,
                              showExpectedRevenueOptions: false,
                            }));
                          }}
                          className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
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

                {/* Product/Service Section 1 */}
                <div className="mt-6 space-y-4">
                  {/* Product/Service Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.productServices.slice(0, 4).map((item, index) => (
                      <div key={item.id}>
                        <label className="text-[1rem] font-medium text-accent mb-2 block">
                          Prodotto/Servizio {index + 1}:
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleProductServiceChange(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question 2: What can you age of growing do you expect from the second year? */}
                <div>
                  <label className="question-text">
                    Che percentuale di crescita ti aspetti dal secondo anno?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.growthProjection}
                      onChange={(e) =>
                        handleTextareaChange("growthProjection", e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customGrowthProjection",
                          "growthProjection"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showGrowthProjectionOptions")
                      }
                      placeholder="Inserisci una proiezione personalizzata"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showGrowthProjectionOptions && (
                    <div
                      ref={growthProjectionDropdownRef}
                      className="mt-4 space-y-2"
                    >
                      {/* AI Suggestions */}
                      {isLoadingGrowthProjectionSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        growthProjectionAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                growthProjection: option,
                                showGrowthProjectionOptions: false,
                              }));
                            }}
                            className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-7"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customGrowthProjection.map((option, index) => (
                        <button
                          key={`custom-growth-${index}`}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              growthProjection: option,
                              showGrowthProjectionOptions: false,
                            }));
                          }}
                          className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
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

                {/* Question 3: What percentage of business share will come from each group of product services? */}
                <div>
                  <label className="question-text">
                    Che percentuale di quota aziendale proverrà da ogni gruppo
                    di prodotti/servizi?
                  </label>

                  {/* Product/Service Share Section */}
                  <div className="mt-6 space-y-4">
                    {/* Product/Service Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {" "}
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label className="text-[1rem] font-medium text-accent mb-2 block">
                            Prodotto/Servizio (%) {num}:
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Question 4: What is the expected pricing level? */}
                <div>
                  <label className="question-text">
                    Qual è il livello di prezzo previsto?
                  </label>

                  {/* Pricing Level Section */}
                  <div className="mt-6 space-y-4">
                    {/* Product/Service Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label className="text-[1rem] font-medium text-accent mb-2 block">
                            Prodotto/Servizio (appross.) {num}:
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                          />
                        </div>
                      ))}
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
