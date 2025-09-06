"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";

interface BusinessIdeaForm {
  businessStage: string;
  productService: string;
  selectedProductCategory: string;
  selectedServiceCategory: string;
  deliveryMethod: string;
  companyOwnership: string;
  businessGoals: string[];
  customProductCategories: string[];
  customServiceCategories: string[];
}

export default function S2BusinessIdea() {
  const {
    nextStep,
    prevStep,
    getFormData,
    updateFormData,
    errors,
    validateStep,
  } = useSmartForm();

  // Get persisted data from context
  const persistedData = getFormData("step2");

  const [form, setForm] = useState<BusinessIdeaForm>(persistedData);

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step2", form);
  }, [form, updateFormData]);

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showProductInput, setShowProductInput] = useState(false);
  const [showServiceInput, setShowServiceInput] = useState(false);

  const productDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // AI Suggestions state
  const [productAiSuggestions, setProductAiSuggestions] = useState<string[]>(
    []
  );
  const [serviceAiSuggestions, setServiceAiSuggestions] = useState<string[]>(
    []
  );
  const [isLoadingProductSuggestions, setIsLoadingProductSuggestions] =
    useState(false);
  const [isLoadingServiceSuggestions, setIsLoadingServiceSuggestions] =
    useState(false);
  const [getAISuggestions] = useGetAISuggestionsMutation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductDropdown(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRadioChange = (field: keyof BusinessIdeaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Handle Product/Service selection behavior
    if (field === "productService") {
      if (value === "Product") {
        // Close service related states and show product input
        setShowServiceDropdown(false);
        setShowServiceInput(false);
        setShowProductInput(true);
        setShowProductDropdown(false);
        // Fetch AI suggestions for products if not already loaded
        if (productAiSuggestions.length === 0) {
          fetchProductAISuggestions();
        }
      } else if (value === "Service") {
        // Close product related states and show service input
        setShowProductDropdown(false);
        setShowProductInput(false);
        setShowServiceInput(true);
        setShowServiceDropdown(false);
        // Fetch AI suggestions for services if not already loaded
        if (serviceAiSuggestions.length === 0) {
          fetchServiceAISuggestions();
        }
      }
    }
  };

  const handleCheckboxChange = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      businessGoals: prev.businessGoals.includes(goal)
        ? prev.businessGoals.filter((g) => g !== goal)
        : [...prev.businessGoals, goal],
    }));
  };

  const handleProductCategorySelect = (category: string) => {
    setForm((prev) => ({ ...prev, selectedProductCategory: category }));
    // Keep dropdown open after selection
  };

  const handleServiceCategorySelect = (category: string) => {
    setForm((prev) => ({ ...prev, selectedServiceCategory: category }));
    // Keep dropdown open after selection
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, selectedProductCategory: e.target.value }));
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, selectedServiceCategory: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step2", form);

    // Validate the form before proceeding
    const isValid = validateStep(1); // 0-based index for step 2

    if (isValid) {
      console.log("Business Idea Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  // Function to fetch AI suggestions for products
  const fetchProductAISuggestions = async () => {
    setIsLoadingProductSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What are some popular product categories for businesses?",
        context: "product categories",
        businessType: form.businessStage,
      }).unwrap();

      if (response.success && response.suggestions) {
        setProductAiSuggestions(response.suggestions);
      } else {
        // Fallback to predefined suggestions if API fails
        setProductAiSuggestions([
          "Electronics & Technology",
          "Food & Beverages",
          "Health & Wellness Products",
          "Fashion & Apparel",
          "Home & Garden",
          "Sports & Fitness Equipment",
          "Beauty & Personal Care",
          "Books & Educational Materials",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI product suggestions:", error);
      // Fallback to predefined suggestions if API fails
      setProductAiSuggestions([
        "Electronics & Technology",
        "Food & Beverages",
        "Health & Wellness Products",
        "Fashion & Apparel",
        "Home & Garden",
        "Sports & Fitness Equipment",
        "Beauty & Personal Care",
        "Books & Educational Materials",
      ]);
    } finally {
      setIsLoadingProductSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for services
  const fetchServiceAISuggestions = async () => {
    setIsLoadingServiceSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What are some popular service categories for businesses?",
        context: "service categories",
        businessType: form.businessStage,
      }).unwrap();

      if (response.success && response.suggestions) {
        setServiceAiSuggestions(response.suggestions);
      } else {
        // Fallback to predefined suggestions if API fails
        setServiceAiSuggestions([
          "Digital Marketing & SEO",
          "Web Development & Design",
          "Business Consulting",
          "Financial Planning & Accounting",
          "Legal Services",
          "Healthcare & Medical Services",
          "Education & Training",
          "Real Estate Services",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI service suggestions:", error);
      // Fallback to predefined suggestions if API fails
      setServiceAiSuggestions([
        "Digital Marketing & SEO",
        "Web Development & Design",
        "Business Consulting",
        "Financial Planning & Accounting",
        "Legal Services",
        "Healthcare & Medical Services",
        "Education & Training",
        "Real Estate Services",
      ]);
    } finally {
      setIsLoadingServiceSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8 ">
          {/* Step Info */}
          <p className="text-center text-[1rem] text- font-medium mb-2">
            Step 02 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium ">
              Your Business Idea
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
                {/* Question 1: Business Stage */}
                <div>
                  <label className="question-text">
                    What stage is your business currently in? (required)
                  </label>
                  {errors.businessStage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessStage}
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {[
                      "Idea/Planning (Still developing the idea or preparing to launch)",
                      "Growing (Generating revenue and expanding)",
                      "Established (stable business with steady operations)",
                    ].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.businessStage === option
                            ? "border-primary"
                            : "border-[#888888]/50"
                        }`}
                        onClick={() =>
                          handleRadioChange("businessStage", option)
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                            form.businessStage === option
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent leading-relaxed">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question 2: Product or Service */}
                <div>
                  <label className="question-text">
                    Do you offer a product or a service? (required)
                  </label>
                  {errors.productService && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productService}
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {/* Product Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.productService === "Product"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          handleRadioChange("productService", "Product")
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.productService === "Product"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          Product
                        </span>
                      </div>

                      {/* Sub-options for Product */}
                      {form.productService === "Product" &&
                        showProductInput && (
                          <div
                            className="mt-3 space-y-2 relative"
                            ref={productDropdownRef}
                          >
                            {/* Input field */}
                            <div className="mb-4">
                              <input
                                type="text"
                                placeholder="E.g. Food & Beverages, Toys & Games"
                                value={form.selectedProductCategory}
                                onChange={handleProductInputChange}
                                onClick={() => setShowProductDropdown(true)}
                                onFocus={() => setShowProductDropdown(true)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                className={`w-full px-4 py-3 bg-[#FCFCFC] border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent ${
                                  errors.selectedProductCategory
                                    ? "border-red-500"
                                    : "border-gray-200"
                                }`}
                              />
                              {errors.selectedProductCategory && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.selectedProductCategory}
                                </p>
                              )}
                            </div>

                            {/* Sub-options below input */}
                            {showProductDropdown && (
                              <div className="mb-4 ">
                                <div className="grid grid-cols-1 gap-2">
                                  {/* Loading state for AI suggestions */}
                                  {isLoadingProductSuggestions && (
                                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                      <span className="text-[1rem] font-normal text-gray-500 ml-2">
                                        Loading AI suggestions...
                                      </span>
                                    </div>
                                  )}

                                  {/* AI Suggestions */}
                                  {!isLoadingProductSuggestions &&
                                    productAiSuggestions.length > 0 && (
                                      <>
                                        {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">AI Suggestions:</div> */}
                                        {productAiSuggestions.map(
                                          (suggestion, index) => (
                                            <button
                                              key={`ai-product-suggestion-${index}`}
                                              type="button"
                                              className="flex items-center p-1 ml-7 rounded-lg  cursor-pointer text-left transition-colors"
                                              onClick={() => {
                                                handleProductCategorySelect(
                                                  suggestion
                                                );
                                                setShowProductDropdown(false);
                                              }}
                                            >
                                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                              <span className="text-[1rem] font-normal text-accent">
                                                {suggestion}
                                              </span>
                                            </button>
                                          )
                                        )}
                                        {/* <div className="border-t border-gray-200 my-2"></div> */}
                                        {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">Other Options:</div> */}
                                      </>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Service Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.productService === "Service"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          handleRadioChange("productService", "Service")
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.productService === "Service"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          Service
                        </span>
                      </div>

                      {/* Sub-options for Service */}
                      {form.productService === "Service" &&
                        showServiceInput && (
                          <div
                            className="mt-3 space-y-2 relative"
                            ref={serviceDropdownRef}
                          >
                            {/* Input field */}
                            <div className="mb-4">
                              <input
                                type="text"
                                placeholder="E.g. Automotive Services, IT & Software Support"
                                value={form.selectedServiceCategory}
                                onChange={handleServiceInputChange}
                                onClick={() => setShowServiceDropdown(true)}
                                onFocus={() => setShowServiceDropdown(true)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                className={`w-full px-4 py-3 bg-[#FCFCFC] border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent ${
                                  errors.selectedServiceCategory
                                    ? "border-red-500"
                                    : "border-gray-200"
                                }`}
                              />
                              {errors.selectedServiceCategory && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.selectedServiceCategory}
                                </p>
                              )}
                            </div>

                            {/* Sub-options below input */}
                            {showServiceDropdown && (
                              <div className="mb-4 ">
                                <div className="grid grid-cols-1 gap-2">
                                  {/* Loading state for AI suggestions */}
                                  {isLoadingServiceSuggestions && (
                                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                      <span className="text-[1rem] font-normal text-gray-500 ml-2">
                                        Loading AI suggestions...
                                      </span>
                                    </div>
                                  )}

                                  {/* AI Suggestions */}
                                  {!isLoadingServiceSuggestions &&
                                    serviceAiSuggestions.length > 0 && (
                                      <>
                                        {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">AI Suggestions:</div> */}
                                        {serviceAiSuggestions.map(
                                          (suggestion, index) => (
                                            <button
                                              key={`ai-service-suggestion-${index}`}
                                              type="button"
                                              className="flex items-center p-1 ml-7 rounded-lg cursor-pointer text-left transition-colors"
                                              onClick={() => {
                                                handleServiceCategorySelect(
                                                  suggestion
                                                );
                                                setShowServiceDropdown(false);
                                              }}
                                            >
                                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                              <span className="text-[1rem] font-normal text-accent">
                                                {suggestion}
                                              </span>
                                            </button>
                                          )
                                        )}
                                        {/* <div className="border-t border-gray-200 my-2"></div> */}
                                        {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">Other Options:</div> */}
                                      </>
                                    )}

                                  {/* Custom service categories */}
                                  {form.customServiceCategories.map(
                                    (category, index) => (
                                      <button
                                        key={`custom-service-${index}`}
                                        type="button"
                                        className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors"
                                        onClick={() =>
                                          handleServiceCategorySelect(category)
                                        }
                                      >
                                        <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3"></div>
                                        <span className="text-[1rem] font-normal text-accent">
                                          {category}
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Question 3: Delivery Method */}
                <div>
                  <label className="question-text">
                    How do you deliver your product? (required)
                  </label>
                  {errors.deliveryMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deliveryMethod}
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {[
                      "Online",
                      "Physical location",
                      "Both online and at a physical location",
                    ].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.deliveryMethod === option
                            ? "border-primary"
                            : "border-[#888888]/50"
                        }`}
                        onClick={() =>
                          handleRadioChange("deliveryMethod", option)
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.deliveryMethod === option
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question 4: Company Ownership */}
                <div>
                  <label className="question-text">
                    Will the company own any inventions, digital assets,
                    trademarks, trade secrets or similar?
                  </label>
                  <div className="mt-4 space-y-4">
                    {["Yes", "No"].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.companyOwnership === option
                            ? "border-primary"
                            : "border-[#888888]/50"
                        }`}
                        onClick={() =>
                          handleRadioChange("companyOwnership", option)
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.companyOwnership === option
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question 5: Business Goals */}
                <div>
                  <label className="question-text">
                    What goals do you pursue with this business plan?
                  </label>
                  <div className="mt-4 space-y-4">
                    {/* {[
                                            'Launch a new Product or Service',
                                             'Secure Investor Funding or Grant',
                                             'Boost Sales & Revenue'
                                         ].map((option) => (
                                             <div key={option} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                                                 form.businessGoals.includes(option) ? 'border-primary' : 'border-gray-200'
                                             }`} onClick={() => handleCheckboxChange(option)}>
                                                 <div className={`w-4 h-4 border-2 mr-3 flex items-center justify-center ${
                                                     form.businessGoals.includes(option) ? 'border-primary bg-primary' : 'border-primary bg-white'
                                                 }`}>
                                                     {form.businessGoals.includes(option) && (
                                                         <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                         </svg>
                                                     )}
                                                 </div>
                                                 <span className="text-[1rem] font-normal text-accent">{option}</span>
                                             </div>
                                         ))} */}

                    {[
                      "Launch a New Product or Service",
                      "Secure Investor Funding or Grants",
                      "Boost Sales & Revenue",
                    ].map((category) => (
                      <div key={category} className="flex items-center">
                        <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3 ml-7 "></div>
                        <span className="text-[1rem] font-normal text-accent">
                          {category}
                        </span>
                      </div>
                    ))}
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
                    className="w-full py-3 bg-primary cursor-pointer text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
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
