"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
//
interface BusinessGoalVisionForm {
  businessGoals: string;
  businessGoalsDescription: string;
  longTermVision: string;
  longTermVisionDescription: string;
  mission: string;
  missionDescription: string;
  operationalArea: string;
  customBusinessGoals: string[];
  customLongTermVision: string[];
  customMission: string[];
  selectedBusinessGoalsOptions: string[];
  selectedLongTermVisionOptions: string[];
  selectedMissionOptions: string[];
  showBusinessGoalsOptions: boolean;
  showLongTermVisionOptions: boolean;
  showMissionOptions: boolean;
}

export default function S4BusinessGoalVision() {
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
  const [businessGoalsAiSuggestions, setBusinessGoalsAiSuggestions] = useState<
    string[]
  >([]);
  const [visionAiSuggestions, setVisionAiSuggestions] = useState<string[]>([]);
  const [missionAiSuggestions, setMissionAiSuggestions] = useState<string[]>(
    []
  );
  const [
    isLoadingBusinessGoalsSuggestions,
    setIsLoadingBusinessGoalsSuggestions,
  ] = useState(false);
  const [isLoadingVisionSuggestions, setIsLoadingVisionSuggestions] =
    useState(false);
  const [isLoadingMissionSuggestions, setIsLoadingMissionSuggestions] =
    useState(false);

  const persistedData = getFormData("step4");

  const [form, setForm] = useState<BusinessGoalVisionForm>(
    persistedData || {
      businessGoals: "",
      businessGoalsDescription: "",
      longTermVision: "",
      longTermVisionDescription: "",
      mission: "",
      missionDescription: "",
      operationalArea: "",
      customBusinessGoals: [],
      customLongTermVision: [],
      customMission: [],
      selectedBusinessGoalsOptions: [],
      selectedLongTermVisionOptions: [],
      selectedMissionOptions: [],
      showBusinessGoalsOptions: false,
      showLongTermVisionOptions: false,
      showMissionOptions: false,
    }
  );

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step4", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for business goals
  const fetchBusinessGoalsAISuggestions = async () => {
    setIsLoadingBusinessGoalsSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What is your business aiming to achieve?",
        context: "business goals and objectives",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setBusinessGoalsAiSuggestions(response.suggestions);
      } else {
        setBusinessGoalsAiSuggestions([
          "Become a market leader in our niche",
          "Launch innovative and disruptive products",
          "Attract investors and secure funding",
          "Expand into new markets and territories",
          "Build a strong brand reputation",
          "Achieve sustainable growth and profitability",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI business goals suggestions:", error);
      setBusinessGoalsAiSuggestions([
        "Become a market leader in our niche",
        "Launch innovative and disruptive products",
        "Attract investors and secure funding",
        "Expand into new markets and territories",
        "Build a strong brand reputation",
        "Achieve sustainable growth and profitability",
      ]);
    } finally {
      setIsLoadingBusinessGoalsSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for long-term vision
  const fetchVisionAISuggestions = async () => {
    setIsLoadingVisionSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What's your long-term vision?",
        context: "long-term vision and future aspirations",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setVisionAiSuggestions(response.suggestions);
      } else {
        setVisionAiSuggestions([
          "Build a global recognized worldwide brand",
          "Create a scalable and sustainable business model",
          "Achieve consistent long-term growth through innovation",
          "Transform the industry through cutting-edge solutions",
          "Become the go-to solution provider in our field",
          "Establish a legacy of positive impact and excellence",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI vision suggestions:", error);
      setVisionAiSuggestions([
        "Build a global recognized worldwide brand",
        "Create a scalable and sustainable business model",
        "Achieve consistent long-term growth through innovation",
        "Transform the industry through cutting-edge solutions",
        "Become the go-to solution provider in our field",
        "Establish a legacy of positive impact and excellence",
      ]);
    } finally {
      setIsLoadingVisionSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for mission
  const fetchMissionAISuggestions = async () => {
    setIsLoadingMissionSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "How would you describe your mission in one line?",
        context: "company mission and purpose",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setMissionAiSuggestions(response.suggestions);
      } else {
        setMissionAiSuggestions([
          "Empower individuals through accessible and affordable innovation",
          "Deliver sustainable solutions that improve everyday lives",
          "Bridge the gap between technology and human needs",
          "Create value through exceptional products and services",
          "Drive positive change through innovative solutions",
          "Enable success through reliable and efficient solutions",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI mission suggestions:", error);
      setMissionAiSuggestions([
        "Empower individuals through accessible and affordable innovation",
        "Deliver sustainable solutions that improve everyday lives",
        "Bridge the gap between technology and human needs",
        "Create value through exceptional products and services",
        "Drive positive change through innovative solutions",
        "Enable success through reliable and efficient solutions",
      ]);
    } finally {
      setIsLoadingMissionSuggestions(false);
    }
  };

  const goalDropdownRef = useRef<HTMLDivElement>(null);
  const visionDropdownRef = useRef<HTMLDivElement>(null);
  const missionDropdownRef = useRef<HTMLDivElement>(null);

  const handleRadioChange = (
    field: keyof BusinessGoalVisionForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextareaChange = (
    field: keyof BusinessGoalVisionForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomOption = (
    field: "customBusinessGoals" | "customLongTermVision" | "customMission",
    value: string
  ) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleBusinessGoalOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedBusinessGoalsOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedBusinessGoalsOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedBusinessGoalsOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleVisionOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedLongTermVisionOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedLongTermVisionOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedLongTermVisionOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleMissionOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedMissionOptions;
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          selectedMissionOptions: currentOptions.filter(
            (opt) => opt !== option
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedMissionOptions: [...currentOptions, option],
        };
      }
    });
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "customBusinessGoals" | "customLongTermVision" | "customMission",
    textareaField: keyof BusinessGoalVisionForm
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
      | "showBusinessGoalsOptions"
      | "showLongTermVisionOptions"
      | "showMissionOptions"
  ) => {
    const isCurrentlyOpen = form[optionField];

    setForm((prev) => ({
      ...prev,
      showBusinessGoalsOptions:
        optionField === "showBusinessGoalsOptions"
          ? !prev.showBusinessGoalsOptions
          : false,
      showLongTermVisionOptions:
        optionField === "showLongTermVisionOptions"
          ? !prev.showLongTermVisionOptions
          : false,
      showMissionOptions:
        optionField === "showMissionOptions" ? !prev.showMissionOptions : false,
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen) {
      if (
        optionField === "showBusinessGoalsOptions" &&
        businessGoalsAiSuggestions.length === 0
      ) {
        fetchBusinessGoalsAISuggestions();
      } else if (
        optionField === "showLongTermVisionOptions" &&
        visionAiSuggestions.length === 0
      ) {
        fetchVisionAISuggestions();
      } else if (
        optionField === "showMissionOptions" &&
        missionAiSuggestions.length === 0
      ) {
        fetchMissionAISuggestions();
      }
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        goalDropdownRef.current &&
        !goalDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showBusinessGoalsOptions: false }));
      }
      if (
        visionDropdownRef.current &&
        !visionDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showLongTermVisionOptions: false }));
      }
      if (
        missionDropdownRef.current &&
        !missionDropdownRef.current.contains(event.target as Node)
      ) {
        setForm((prev) => ({ ...prev, showMissionOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step4", form);

    // Validate the form before proceeding
    const isValid = validateStep(3); // 0-based index for step 4

    if (isValid) {
      console.log("Business Goal & Vision Form Submitted:", form);
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
            Passo 04 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Obiettivi e Visione Aziendale
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
                {/* Question 1: What is your business aiming to achieve? */}
                <div>
                  <label className="question-text">
                    Cosa vuole raggiungere la tua azienda?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={
                        form.selectedBusinessGoalsOptions.length > 0
                          ? form.selectedBusinessGoalsOptions.join(", ")
                          : form.businessGoalsDescription
                      }
                      onChange={(e) =>
                        handleTextareaChange(
                          "businessGoalsDescription",
                          e.target.value
                        )
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customBusinessGoals",
                          "businessGoalsDescription"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showBusinessGoalsOptions")
                      }
                      placeholder="Es. Miriamo a diventare leader nella tecnologia sostenibile..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedBusinessGoalsOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedBusinessGoalsOptions.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleBusinessGoalOptionSelect(option)
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
                  {form.showBusinessGoalsOptions && (
                    <div className="mt-2 space-y-2" ref={goalDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingBusinessGoalsSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        businessGoalsAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedBusinessGoalsOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                handleBusinessGoalOptionSelect(option)
                              }
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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
                      {form.customBusinessGoals.map((option, index) => {
                        const isSelected =
                          form.selectedBusinessGoalsOptions.includes(option);
                        return (
                          <button
                            key={`custom-goal-${index}`}
                            type="button"
                            className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              handleBusinessGoalOptionSelect(option)
                            }
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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

                {/* Question 2: What's your long-term vision? */}
                <div>
                  <label className="question-text">
                    Qual è la tua visione a lungo termine?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={
                        form.selectedLongTermVisionOptions.length > 0
                          ? form.selectedLongTermVisionOptions.join(", ")
                          : form.longTermVisionDescription
                      }
                      onChange={(e) =>
                        handleTextareaChange(
                          "longTermVisionDescription",
                          e.target.value
                        )
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customLongTermVision",
                          "longTermVisionDescription"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showLongTermVisionOptions")
                      }
                      placeholder="Es. Rivoluzionare l'industria attraverso l'innovazione..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedLongTermVisionOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedLongTermVisionOptions.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                <span className="mr-2">{option}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleVisionOptionSelect(option)
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
                  {form.showLongTermVisionOptions && (
                    <div className="mt-2  space-y-2" ref={visionDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingVisionSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        visionAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedLongTermVisionOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleVisionOptionSelect(option)}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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
                      {form.customLongTermVision.map((option, index) => {
                        const isSelected =
                          form.selectedLongTermVisionOptions.includes(option);
                        return (
                          <button
                            key={`custom-vision-${index}`}
                            type="button"
                            className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleVisionOptionSelect(option)}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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

                {/* Question 3: How would you describe your mission in one line? */}
                <div>
                  <label className="question-text">
                    Come descriveresti la tua missione in una riga?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={
                        form.selectedMissionOptions.length > 0
                          ? form.selectedMissionOptions.join(", ")
                          : form.missionDescription
                      }
                      onChange={(e) =>
                        handleTextareaChange(
                          "missionDescription",
                          e.target.value
                        )
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, "customMission", "missionDescription")
                      }
                      onClick={() => handleTextareaClick("showMissionOptions")}
                      placeholder="Es. Potenziare le aziende attraverso soluzioni all'avanguardia..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />

                    {/* Selected Options Display */}
                    {form.selectedMissionOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Opzioni selezionate:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedMissionOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span className="mr-2">{option}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleMissionOptionSelect(option)
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
                  {form.showMissionOptions && (
                    <div className="mt-4 space-y-2" ref={missionDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingMissionSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        missionAiSuggestions.map((option) => {
                          const isSelected =
                            form.selectedMissionOptions.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                                isSelected
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleMissionOptionSelect(option)}
                            >
                              <div
                                className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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
                      {form.customMission.map((option, index) => {
                        const isSelected =
                          form.selectedMissionOptions.includes(option);
                        return (
                          <button
                            key={`custom-mission-${index}`}
                            type="button"
                            className={`flex items-center p-2 bg-white rounded-lg cursor-pointer text-left transition-colors w-full ${
                              isSelected
                                ? "bg-primary/10 border border-primary"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleMissionOptionSelect(option)}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded mr-3 ml-5 flex items-center justify-center ${
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

                {/* Question 4: What will be the primary operational area for this business? */}
                <div>
                  <label className="question-text">
                    Quale sarà l'area operativa primaria per questa azienda?
                  </label>
                  <div className="mt-4 space-y-4">
                    {["Locale", "Nazionale", "Internazionale"].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.operationalArea === option
                            ? "border-primary"
                            : "border-[#888888]/30"
                        }`}
                        onClick={() =>
                          handleRadioChange("operationalArea", option)
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.operationalArea === option
                              ? "border-[#888888]/50 bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          {option}
                        </span>
                      </div>
                    ))}
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Es. Regionale – Asia del Sud o operazioni globali basate online"
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