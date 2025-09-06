"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";

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

  const handleBusinessGoalOptionSelect = (option: string) => {
    setForm((prev) => ({
      ...prev,
      businessGoalsDescription: option,
      showBusinessGoalsOptions: false,
    }));
  };

  const handleLongTermVisionOptionSelect = (option: string) => {
    setForm((prev) => ({
      ...prev,
      longTermVisionDescription: option,
      showLongTermVisionOptions: false,
    }));
  };

  const handleMissionOptionSelect = (option: string) => {
    setForm((prev) => ({
      ...prev,
      missionDescription: option,
      showMissionOptions: false,
    }));
  };

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
            Step 04 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Business Goals & Vision
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
                    What is your business aiming to achieve?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.businessGoalsDescription}
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
                      placeholder="E.g. We aim to become a leader in sustainable technology..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showBusinessGoalsOptions && (
                    <div className="mt-2 space-y-2" ref={goalDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingBusinessGoalsSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Loading AI suggestions...
                          </span>
                        </div>
                      ) : (
                        businessGoalsAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                            onClick={() =>
                              handleBusinessGoalOptionSelect(option)
                            }
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customBusinessGoals.map((option, index) => (
                        <button
                          key={`custom-goal-${index}`}
                          type="button"
                          className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                          onClick={() => handleBusinessGoalOptionSelect(option)}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question 2: What's your long-term vision? */}
                <div>
                  <label className="question-text">
                    What's your long-term vision?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.longTermVisionDescription}
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
                      placeholder="E.g. To revolutionize the industry through innovation..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showLongTermVisionOptions && (
                    <div className="mt-2  space-y-2" ref={visionDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingVisionSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Loading AI suggestions...
                          </span>
                        </div>
                      ) : (
                        visionAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                            onClick={() =>
                              handleLongTermVisionOptionSelect(option)
                            }
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customLongTermVision.map((option, index) => (
                        <button
                          key={`custom-vision-${index}`}
                          type="button"
                          className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                          onClick={() =>
                            handleLongTermVisionOptionSelect(option)
                          }
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question 3: How would you describe your mission in one line? */}
                <div>
                  <label className="question-text">
                    How would you describe your mission in one line?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.missionDescription}
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
                      placeholder="E.g. Empowering businesses through cutting-edge solutions..."
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showMissionOptions && (
                    <div className="mt-4 space-y-2" ref={missionDropdownRef}>
                      {/* AI Suggestions */}
                      {isLoadingMissionSuggestions ? (
                        <div className="flex items-center p-2  rounded-lg ">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Loading AI suggestions...
                          </span>
                        </div>
                      ) : (
                        missionAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                            onClick={() => handleMissionOptionSelect(option)}
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customMission.map((option, index) => (
                        <button
                          key={`custom-mission-${index}`}
                          type="button"
                          className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors w-full"
                          onClick={() => handleMissionOptionSelect(option)}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-5"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question 4: What will be the primary operational area for this business? */}
                <div>
                  <label className="question-text">
                    What will be the primary operational area for this business?
                  </label>
                  <div className="mt-4 space-y-4">
                    {["Local", "National", "International"].map((option) => (
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
                        placeholder="E.g, Regional – South Asia or Online-based global operations"
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
