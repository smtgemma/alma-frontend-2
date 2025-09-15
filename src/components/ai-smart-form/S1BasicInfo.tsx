"use client";

import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
import { useExtractPdfMutation } from "@/redux/api/pdfExtraction/pdfExtractionApi";

interface BusinessInfoForm {
  businessName: string;
  businessStage: string;
  businessType: string;
  businessDocument: File | null;
  extractedContent?: string;
  location: string;
  activity: string;
  totalEmployees: string;
  website: string;
  sourceLanguage: string;
  targetLanguage: string;
  customBusinessStages?: string[];
  uploaded_file?: {
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
  }[];
}

export default function S1BasicInfo() {
  const { nextStep, getFormData, updateFormData, errors, validateStep } =
    useSmartForm();

  // Get persisted data from context
  const persistedData = getFormData("step1");

  const [form, setForm] = useState<BusinessInfoForm>(persistedData);

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step1", form);
  }, [form, updateFormData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        newBusinessDropdownRef.current &&
        !newBusinessDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNewBusinessDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newBusinessDropdownRef = useRef<HTMLDivElement>(null);
  const [showNewBusinessInput, setShowNewBusinessInput] = useState(false);
  const [showNewBusinessDropdown, setShowNewBusinessDropdown] = useState(false);

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [getAISuggestions] = useGetAISuggestionsMutation();
  const [extractPdf] = useExtractPdfMutation();

  const languages = ["Italian", "English"];
  const currency = ["Italy", "UK","Germany", "France","Spain","USA" ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      alert("Please upload a PDF file only.");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Set a timeout for the PDF extraction request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                "Request timeout - AI service is taking too long to respond"
              )
            ),
          30000
        ); // 30 seconds timeout
      });

      const extractionPromise = extractPdf({
        file: file,
        document_type: "company_extract",
      }).unwrap();

      const response = (await Promise.race([
        extractionPromise,
        timeoutPromise,
      ])) as any;

      setExtractedData(response);
      const mappedResponse = {
        text_content: response.text_content ?? "",
        page_count:
          typeof (response as any).page_count === "number"
            ? (response as any).page_count
            : 0,
        metadata: "metadata" in response ? (response as any).metadata : {},
        financial_data:
          "financial_data" in response
            ? (response as any).financial_data
            : null,
        document_type:
          typeof (response as any).document_type === "string"
            ? (response as any).document_type
            : "unknown",
      };

      setForm((prev) => ({
        ...prev,
        businessDocument: file,
        uploaded_file: prev.uploaded_file
          ? [...prev.uploaded_file, mappedResponse]
          : [mappedResponse],
      }));

      setUploadSuccess(true);

      // Auto-fill form fields if data is extracted
      if (
        response.text_content &&
        response.text_content !==
          "Document uploaded successfully. AI extraction service is currently unavailable."
      ) {
        console.log("Extracted data:", response);

        // Auto-fill form fields based on extracted data
        setForm((prev) => ({
          ...prev,
          businessName: response.business_name || prev.businessName,
          location: response.location || prev.location,
        }));
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);

      // Handle RTK Query errors
      let errorMessage = "Failed to upload and process the document.";

      if (error?.data) {
        // RTK Query error with response data
        errorMessage = error.data.message || error.data.detail || errorMessage;
        console.error("API Error:", error.data);
      } else if (error?.error) {
        // RTK Query network error
        errorMessage = error.error;
        console.error("Network Error:", error.error);
      } else if (error?.message) {
        // Standard error
        errorMessage = error.message;
        console.error("Error message:", error.message);
      }

      // Check if it's a network error, timeout, or API not accessible
      if (
        error?.status === "FETCH_ERROR" ||
        (error instanceof TypeError && error.message === "Failed to fetch") ||
        error?.message?.includes("timeout") ||
        error?.message?.includes("Request timeout")
      ) {
        // Network error - API proxy or external service unavailable
        setForm((prev) => ({ ...prev, businessDocument: file }));
        setUploadSuccess(true);
        setExtractedData({
          text_content:
            "Document uploaded successfully. AI extraction service is currently unavailable.",
          status: "uploaded_no_extraction",
          success: false,
        });
        console.warn(
          "AI extraction service unavailable, file uploaded without processing"
        );
      } else {
        // Other errors
        setUploadSuccess(false);
        alert(`${errorMessage} Please try again.`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, businessDocument: null }));
    setExtractedData(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to fetch AI suggestions
  const fetchAISuggestions = async () => {
    setIsLoadingSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What are common business stages for new businesses?",
        context: "business stages",
        businessType: "new",
      }).unwrap();

      if (response.success && response.suggestions) {
        setAiSuggestions(response.suggestions);
      } else {
        // Fallback to predefined suggestions if API fails
        setAiSuggestions([
          "Planning to launch within 3 months",
          "Planning to launch within 6 months",
          "Planning to launch within 1 year",
          "Still in research and planning phase",
          "Waiting for funding approval",
          "Finalizing business registration",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      // Fallback to predefined suggestions if API fails
      setAiSuggestions([
        "Planning to launch within 3 months",
        "Planning to launch within 6 months",
        "Planning to launch within 1 year",
        "Still in research and planning phase",
        "Waiting for funding approval",
        "Finalizing business registration",
      ]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step1", form);

    // Validate the form before proceeding
    const isValid = validateStep(0); // 0-based index for step 1

    if (isValid) {
      console.log("Business Info Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className=" bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8 ">
          {/* Step Info */}
          <p className="text-center text-[1rem] text-info font-medium mb-2">
            Step 01 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium ">
              Enter Basic
              <br />
              Business Information
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
                {/* Business Name */}
                <div>
                  <label className=" question-text">
                    What is your business name? (Required)
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.businessName
                        ? "border-red-500"
                        : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Stage */}
                <div>
                  <label className="question-text">
                    Is this an existing or an upcoming business? (Required)
                  </label>

                  {/* Radio Button Options */}
                  <div className="mt-4 space-y-4">
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.businessType}
                      </p>
                    )}
                    {/* Existing Business Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.businessType === "existing"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setForm({ ...form, businessType: "existing" });
                          // Close New Business dropdown states when Existing Business is selected
                          setShowNewBusinessInput(false);
                          setShowNewBusinessDropdown(false);
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.businessType === "existing"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent ">
                          Existing Business
                        </span>
                      </div>

                      {/* Conditional Content for Existing Business */}
                      {form.businessType === "existing" && (
                        <div className="mt-3 ml-7">
                          {/* Show attachment option only when not uploading */}
                          {!isUploading && !form.businessDocument && (
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <div className="bg-gray-50 p-3 rounded-full">
                                <GrAttachment className="text-primary" />
                              </div>
                              <span className="text-sm text-gray-600">
                                Attach business documents
                              </span>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </div>
                          )}

                          {/* Show upload status */}
                          {isUploading && (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-sm text-gray-600">
                                Processing document with AI... (This may take up
                                to 30 seconds)
                              </span>
                            </div>
                          )}

                          {form.businessDocument && !isUploading && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiCheck className="text-green-600 w-4 h-4" />
                                <span className="text-sm text-green-600">
                                  {form.businessDocument.name} uploaded
                                  successfully
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                  }}
                                  className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Display AI extraction status */}
                              {extractedData &&
                                extractedData.status ===
                                  "uploaded_no_extraction" && (
                                  <div className="text-xs p-2 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
                                    <span>⚠️ {extractedData.text_content}</span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* New Business Option */}
                    <div>
                      <div
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          form.businessType === "new"
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setForm({ ...form, businessType: "new" });
                          setShowNewBusinessInput(true);
                          setShowNewBusinessDropdown(false);
                          // Fetch AI suggestions when New Business is selected
                          if (aiSuggestions.length === 0) {
                            fetchAISuggestions();
                          }
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            form.businessType === "new"
                              ? "border-[#A9A4FE] bg-primary"
                              : "border-primary bg-white"
                          }`}
                        ></div>
                        <span className="text-[1rem] font-normal text-accent ">
                          New Business
                        </span>
                      </div>

                      {/* Conditional Content for New Business */}
                      {form.businessType === "new" && showNewBusinessInput && (
                        <div
                          className="mt-3 space-y-2 relative"
                          ref={newBusinessDropdownRef}
                        >
                          {/* Input field */}
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Others(E.g. When are you planning to establish the business?)"
                              value={form.businessStage}
                              onChange={handleInputChange}
                              name="businessStage"
                              onClick={() => setShowNewBusinessDropdown(true)}
                              onFocus={() => setShowNewBusinessDropdown(true)}
                              className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                            />
                          </div>

                          {/* Sub-options below input */}
                          {showNewBusinessDropdown && (
                            <div className="mb-4">
                              <div className="grid grid-cols-1 gap-2">
                                {/* Loading state for AI suggestions */}
                                {isLoadingSuggestions && (
                                  <div className="flex items-center p-2  rounded-lg">
                                    {/* <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 animate-pulse"></div> */}
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    <span className="text-[1rem] font-normal text-gray-500 ml-2">
                                      Loading AI suggestions...
                                    </span>
                                  </div>
                                )}

                                {/* AI Suggestions */}
                                {!isLoadingSuggestions &&
                                  aiSuggestions.length > 0 && (
                                    <>
                                      {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">AI Suggestions:</div> */}
                                      {aiSuggestions.map(
                                        (suggestion, index) => (
                                          <button
                                            key={`ai-suggestion-${index}`}
                                            type="button"
                                            className="flex items-center p-1 ml-7 rounded-lg cursor-pointer text-left transition-colors"
                                            onClick={() => {
                                              setForm({
                                                ...form,
                                                businessStage: suggestion,
                                              });
                                              setShowNewBusinessDropdown(false);
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

                                {/* Custom business stages */}
                                {form.customBusinessStages?.map(
                                  (stage, index) => (
                                    <button
                                      key={`custom-stage-${index}`}
                                      type="button"
                                      className="flex items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-left transition-colors"
                                      onClick={() => {
                                        setForm({
                                          ...form,
                                          businessStage: stage,
                                        });
                                        setShowNewBusinessDropdown(false);
                                      }}
                                    >
                                      <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3"></div>
                                      <span className="text-[1rem] font-normal text-accent">
                                        {stage}
                                      </span>
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Custom input for adding new stages */}
                          {/* <div className="mt-4">
                                                        <input
                                                            type="text"
                                                            placeholder=""
                                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                                    const newStage = e.currentTarget.value.trim();
                                                                    setForm({
                                                                        ...form,
                                                                        customBusinessStages: [...(form.customBusinessStages || []), newStage]
                                                                    });
                                                                    e.currentTarget.value = '';
                                                                }
                                                            }}
                                                        />
                                                    </div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="question-text">
                    In what State / City will the business be located?
                    (Required)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.location ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Activity Description */}
                <div>
                  <label className="question-text">
                    Describe your activity? (Required)
                  </label>
                  <textarea
                    name="activity"
                    value={form.activity}
                    onChange={handleInputChange}
                    rows={1}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                      errors.activity ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.activity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.activity}
                    </p>
                  )}
                </div>

                {/* Total Employees */}
                <div>
                  <label className="question-text">
                    Total employees (Required)
                  </label>
                  <input
                    type="number"
                    name="totalEmployees"
                    value={form.totalEmployees}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.totalEmployees
                        ? "border-red-500"
                        : "border-[#888888]/50"
                    }`}
                    required
                  />
                  {errors.totalEmployees && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalEmployees}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="question-text">
                    Do you have a website or online presence? (Required)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.website ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    placeholder=""
                    required
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>

                {/* Language Selection */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <label className="question-text">
                      Source plan language:
                    </label>
                    <div className="relative">
                      <select
                        name="sourceLanguage"
                        value={form.sourceLanguage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="question-text">
                      Target plan Currency:
                    </label>
                    <div className="relative">
                      <select
                        name="targetLanguage"
                        value={form.targetLanguage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                      >
                        {currency.map((currence) => (
                          <option key={currence} value={currence}>
                            {currence}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-primary cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-[1rem]"
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
