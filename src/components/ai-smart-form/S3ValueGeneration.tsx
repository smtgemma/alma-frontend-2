"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";

interface ValueGenerationForm {
  uniqueValue: string;
  problemSolved: string;
  problemDescription: string;
  valueAddSupport: string;
  valueAddDescription: string;
  customUniqueOptions: string[];
  customProblemOptions: string[];
  customValueAddOptions: string[];
  selectedUniqueOptions: string[];
  selectedProblemOptions: string[];
  selectedValueAddOptions: string[];
  showUniqueOptions: boolean;
  showProblemOptions: boolean;
  showValueAddOptions: boolean;
}

export default function S3ValueGeneration() {
  const {
    nextStep,
    prevStep,
    getFormData,
    updateFormData,
    errors,
    validateStep,
  } = useSmartForm();

  // Get persisted data from context
  const persistedData = getFormData("step3");

  const [form, setForm] = useState<ValueGenerationForm>(
    persistedData || {
      uniqueValue: "",
      problemSolved: "",
      problemDescription: "",
      valueAddSupport: "",
      valueAddDescription: "",
      customUniqueOptions: [],
      customProblemOptions: [],
      customValueAddOptions: [],
      selectedUniqueOptions: [],
      selectedProblemOptions: [],
      selectedValueAddOptions: [],
      showUniqueOptions: false,
      showProblemOptions: false,
      showValueAddOptions: false,
    }
  );

  // AI Suggestions state
  const [uniqueAiSuggestions, setUniqueAiSuggestions] = useState<string[]>([]);
  const [problemAiSuggestions, setProblemAiSuggestions] = useState<string[]>(
    []
  );
  const [valueAddAiSuggestions, setValueAddAiSuggestions] = useState<string[]>(
    []
  );
  const [isLoadingUniqueSuggestions, setIsLoadingUniqueSuggestions] =
    useState(false);
  const [isLoadingProblemSuggestions, setIsLoadingProblemSuggestions] =
    useState(false);
  const [isLoadingValueAddSuggestions, setIsLoadingValueAddSuggestions] =
    useState(false);
  const [getAISuggestions] = useGetAISuggestionsMutation();

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step3", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for unique value
  const fetchUniqueAISuggestions = async () => {
    setIsLoadingUniqueSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What makes your product/service unique?",
        context: "unique value proposition",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setUniqueAiSuggestions(response.suggestions);
      } else {
        setUniqueAiSuggestions([
          "Superior quality and craftsmanship",
          "Innovative technology and features",
          "Exceptional customer service",
          "Competitive pricing and value",
          "Sustainable and eco-friendly approach",
          "Personalized and customizable solutions",
          "Fast delivery and convenience",
          "Expert knowledge and experience",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI unique suggestions:", error);
      setUniqueAiSuggestions([
        "Superior quality and craftsmanship",
        "Innovative technology and features",
        "Exceptional customer service",
        "Competitive pricing and value",
        "Sustainable and eco-friendly approach",
        "Personalized and customizable solutions",
        "Fast delivery and convenience",
        "Expert knowledge and experience",
      ]);
    } finally {
      setIsLoadingUniqueSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for problem solved
  const fetchProblemAISuggestions = async () => {
    setIsLoadingProblemSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What problem does your product or service solve?",
        context: "problem solving",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setProblemAiSuggestions(response.suggestions);
      } else {
        setProblemAiSuggestions([
          "Saves time and increases efficiency",
          "Reduces costs and expenses",
          "Improves health and wellness",
          "Enhances communication and connectivity",
          "Simplifies complex processes",
          "Provides security and peace of mind",
          "Increases productivity and performance",
          "Solves accessibility and convenience issues",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI problem suggestions:", error);
      setProblemAiSuggestions([
        "Saves time and increases efficiency",
        "Reduces costs and expenses",
        "Improves health and wellness",
        "Enhances communication and connectivity",
        "Simplifies complex processes",
        "Provides security and peace of mind",
        "Increases productivity and performance",
        "Solves accessibility and convenience issues",
      ]);
    } finally {
      setIsLoadingProblemSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for value-add support
  const fetchValueAddAISuggestions = async () => {
    setIsLoadingValueAddSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "Do you offer any other value-add support or guarantees?",
        context: "value-add support and guarantees",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setValueAddAiSuggestions(response.suggestions);
      } else {
        setValueAddAiSuggestions([
          "24/7 customer support",
          "Money-back guarantee",
          "Free training and onboarding",
          "Extended warranty coverage",
          "Regular updates and maintenance",
          "Dedicated account manager",
          "Free consultation and advice",
          "Lifetime technical support",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI value-add suggestions:", error);
      setValueAddAiSuggestions([
        "24/7 customer support",
        "Money-back guarantee",
        "Free training and onboarding",
        "Extended warranty coverage",
        "Regular updates and maintenance",
        "Dedicated account manager",
        "Free consultation and advice",
        "Lifetime technical support",
      ]);
    } finally {
      setIsLoadingValueAddSuggestions(false);
    }
  };

  const handleRadioChange = (
    field: keyof ValueGenerationForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextareaChange = (
    field: keyof ValueGenerationForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomOption = (
    field:
      | "customUniqueOptions"
      | "customProblemOptions"
      | "customValueAddOptions",
    value: string
  ) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const uniqueDropdownRef = useRef<HTMLDivElement>(null);
  const problemDropdownRef = useRef<HTMLDivElement>(null);
  const valueAddDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        uniqueDropdownRef.current &&
        !uniqueDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showUniqueOptions: false }));
      }
      if (
        problemDropdownRef.current &&
        !problemDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showProblemOptions: false }));
      }
      if (
        valueAddDropdownRef.current &&
        !valueAddDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showValueAddOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUniqueOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedUniqueOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedUniqueOptions: currentOptions.filter((opt) => opt !== option),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedUniqueOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleProblemOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedProblemOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedProblemOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedProblemOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleValueAddOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedValueAddOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedValueAddOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedValueAddOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleTextareaClick = (
    optionField:
      | "showUniqueOptions"
      | "showProblemOptions"
      | "showValueAddOptions"
  ) => {
    setForm((prev) => ({
      ...prev,
      [optionField]: !prev[optionField],
    }));

    // Fetch AI suggestions when opening dropdowns
    if (
      optionField === "showUniqueOptions" &&
      uniqueAiSuggestions.length === 0
    ) {
      fetchUniqueAISuggestions();
    } else if (
      optionField === "showProblemOptions" &&
      problemAiSuggestions.length === 0
    ) {
      fetchProblemAISuggestions();
    } else if (
      optionField === "showValueAddOptions" &&
      valueAddAiSuggestions.length === 0
    ) {
      fetchValueAddAISuggestions();
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field:
      | "customUniqueOptions"
      | "customProblemOptions"
      | "customValueAddOptions",
    textareaField: keyof ValueGenerationForm
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step3", form);

    // Validate the form before proceeding
    const isValid = validateStep(2); // 0-based index for step 3

    if (isValid) {
      console.log("Value Generation Form Data:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Step 03 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Value Generation
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Question 1: What makes your product/service unique */}
                <div>
                  <label className="question-text">
                    What makes your product/service unique?
                  </label>
                  <div className="mt-4 relative">
                    <input
                      type="text"
                      value={
                        form.selectedUniqueOptions.length > 0
                          ? form.selectedUniqueOptions.join(", ")
                          : form.uniqueValue
                      }
                      onChange={(e) =>
                        handleTextareaChange("uniqueValue", e.target.value)
                      }
                      onFocus={() => handleTextareaClick("showUniqueOptions")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setForm((prev) => ({
                            ...prev,
                            showUniqueOptions: false,
                          }));
                        }
                      }}
                      placeholder="E.g, Renewable Energy, Architecture & Interior, Legal Consultancy, Event Management"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedUniqueOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Selected options:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedUniqueOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span className="mr-2">{option}</span>
                              <button
                                type="button"
                                onClick={() => handleUniqueOptionSelect(option)}
                                className="text-primary hover:text-primary/70"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dropdown with AI suggestions */}
                    {form.showUniqueOptions && (
                      <div className="mb-4 mt-2 " ref={uniqueDropdownRef}>
                        {/* AI Suggestions Section */}
                        {isLoadingUniqueSuggestions ? (
                          <div className="flex items-center p-2  rounded-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[1rem] font-normal text-gray-500 ml-2">
                              Loading AI suggestions...
                            </span>
                          </div>
                        ) : (
                          uniqueAiSuggestions.length > 0 && (
                            <>
                              {uniqueAiSuggestions.map((suggestion, index) => {
                                const isSelected =
                                  form.selectedUniqueOptions.includes(
                                    suggestion
                                  );
                                return (
                                  <button
                                    key={`ai-unique-${index}`}
                                    type="button"
                                    className={`flex items-center p-2 ml-7 rounded-lg cursor-pointer text-left transition-colors ${
                                      isSelected
                                        ? "bg-primary/10 border border-primary"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleUniqueOptionSelect(suggestion)
                                    }
                                  >
                                    <div
                                      className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
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
                                      {suggestion}
                                    </span>
                                  </button>
                                );
                              })}
                              {/* <div className="border-b border-gray-200"></div> */}
                            </>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question 2: What problem does your product or service solve */}
                <div>
                  <label className="question-text">
                    What problem does your product or service solve?
                  </label>
                  <div className="mt-4 relative">
                    <input
                      type="text"
                      value={
                        form.selectedProblemOptions.length > 0
                          ? form.selectedProblemOptions.join(", ")
                          : form.problemDescription
                      }
                      onChange={(e) =>
                        handleTextareaChange(
                          "problemDescription",
                          e.target.value
                        )
                      }
                      onFocus={() => handleTextareaClick("showProblemOptions")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setForm((prev) => ({
                            ...prev,
                            showProblemOptions: false,
                          }));
                        }
                      }}
                      placeholder="E.g. Helps small businesses manage their inventory without hiring extra staff"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedProblemOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Selected options:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedProblemOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span className="mr-2">{option}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleProblemOptionSelect(option)
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

                    {/* Dropdown with AI suggestions */}
                    {form.showProblemOptions && (
                      <div className="mb-4 mt-2" ref={problemDropdownRef}>
                        {/* AI Suggestions Section */}
                        {isLoadingProblemSuggestions ? (
                          <div className="flex items-center p-2  rounded-lg ">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-[1rem] font-normal text-gray-500 ml-2">
                              Loading AI suggestions...
                            </span>
                          </div>
                        ) : (
                          problemAiSuggestions.length > 0 && (
                            <>
                              {problemAiSuggestions.map((suggestion, index) => {
                                const isSelected =
                                  form.selectedProblemOptions.includes(
                                    suggestion
                                  );
                                return (
                                  <button
                                    key={`ai-problem-${index}`}
                                    type="button"
                                    className={`flex items-center p-2 ml-7 rounded-lg cursor-pointer text-left transition-colors ${
                                      isSelected
                                        ? "bg-primary/10 border border-primary"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleProblemOptionSelect(suggestion)
                                    }
                                  >
                                    <div
                                      className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
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
                                      {suggestion}
                                    </span>
                                  </button>
                                );
                              })}
                              {/* <div className="border-b border-gray-200"></div> */}
                            </>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question 3: Do you offer any other value-add support or guarantees */}
                <div>
                  <label className="question-text">
                    Do you offer any other value-add support or guarantees?
                  </label>
                  <div className="mt-4 relative">
                    <input
                      type="text"
                      placeholder="E.g. We provide a dedicated account manager and 24/7 technical support"
                      value={
                        form.selectedValueAddOptions.length > 0
                          ? form.selectedValueAddOptions.join(", ")
                          : form.valueAddDescription
                      }
                      onChange={(e) =>
                        handleTextareaChange(
                          "valueAddDescription",
                          e.target.value
                        )
                      }
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          showValueAddOptions: true,
                        }));
                        if (valueAddAiSuggestions.length === 0) {
                          fetchValueAddAISuggestions();
                        }
                      }}
                      onFocus={() => {
                        setForm((prev) => ({
                          ...prev,
                          showValueAddOptions: true,
                        }));
                        if (valueAddAiSuggestions.length === 0) {
                          fetchValueAddAISuggestions();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-4 py-3 bg-[#FCFCFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedValueAddOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Selected options:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedValueAddOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span className="mr-2">{option}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleValueAddOptionSelect(option)
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

                    {/* Sub-options below input */}

                    {form.showValueAddOptions && (
                      <div className="mb-4 mt-2" ref={valueAddDropdownRef}>
                        <div className="grid grid-cols-1 gap-2">
                          {/* Loading state for AI suggestions */}
                          {isLoadingValueAddSuggestions && (
                            <div className="flex items-center p-2  rounded-lg ">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-[1rem] font-normal text-gray-500 ml-2">
                                Loading AI suggestions...
                              </span>
                            </div>
                          )}

                          {/* AI Suggestions */}
                          {!isLoadingValueAddSuggestions &&
                            valueAddAiSuggestions.length > 0 && (
                              <>
                                {valueAddAiSuggestions.map(
                                  (suggestion, index) => {
                                    const isSelected =
                                      form.selectedValueAddOptions.includes(
                                        suggestion
                                      );
                                    return (
                                      <button
                                        key={`ai-valueadd-suggestion-${index}`}
                                        type="button"
                                        className={`flex items-center p-2 ml-7 rounded-lg cursor-pointer text-left transition-colors ${
                                          isSelected
                                            ? "bg-primary/10 border border-primary"
                                            : "hover:bg-gray-50"
                                        }`}
                                        onClick={() => {
                                          handleValueAddOptionSelect(
                                            suggestion
                                          );
                                        }}
                                      >
                                        <div
                                          className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
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
                                          {suggestion}
                                        </span>
                                      </button>
                                    );
                                  }
                                )}
                              </>
                            )}
                        </div>
                      </div>
                    )}
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
