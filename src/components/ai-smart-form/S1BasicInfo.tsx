"use client";
//
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
  businessDocuments?: File[]; // Multiple PDF files - optional
  extractedContent?: string;
  location: string;
  activity: string;
  totalEmployees: string;
  website: string;
  sourceLanguage: string;
  targetLanguage: string;
  customBusinessStages?: string[];
  selectedBusinessStagesOptions?: string[];
  uploaded_file?: {
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
    file_name?: string; // Add file name for reference
  }[];
}

export default function S1BasicInfo() {
  const { nextStep, getFormData, updateFormData, errors, validateStep } =
    useSmartForm();

  // Get persisted data from context
  const persistedData = getFormData("step1");

  const [form, setForm] = useState<BusinessInfoForm>(
    persistedData || {
      businessName: "",
      businessStage: "",
      businessType: "",
      businessDocument: null,
      businessDocuments: [], // Multiple PDF files
      extractedContent: "",
      location: "",
      activity: "",
      totalEmployees: "",
      website: "",
      sourceLanguage: "",
      targetLanguage: "",
      customBusinessStages: [],
      selectedBusinessStagesOptions: [],
    }
  );

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
  const currency = ["Italy", "UK", "Germany", "France", "Spain", "USA"];

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
      console.log("📄 Single file response data:", response);
      console.log("📊 Single file page_count:", response.page_count);
      console.log(
        "📊 Single file page_count type:",
        typeof response.page_count
      );

      const mappedResponse = {
        text_content: response.text_content ?? "",
        page_count:
          typeof (response as any).page_count === "number"
            ? (response as any).page_count
            : typeof (response as any).page_count === "string"
            ? parseInt((response as any).page_count) || 1
            : 1, // Default to 1 if no page count
        metadata: "metadata" in response ? (response as any).metadata : {},
        financial_data:
          "financial_data" in response
            ? (response as any).financial_data
            : null,
        document_type:
          typeof (response as any).document_type === "string"
            ? (response as any).document_type
            : "company_extract",
      };

      setForm((prev) => {
        // Handle both single and multiple file scenarios
        const existingFiles = prev.businessDocuments || [];
        const existingUploadedFiles = prev.uploaded_file || [];

        console.log(
          "📁 Single file upload - Existing files:",
          existingFiles.map((f) => f.name)
        );
        console.log("📁 Single file upload - New file:", file.name);

        // Add new file to existing files list
        const updatedFiles = [...existingFiles, file];
        const updatedUploadedFiles = [...existingUploadedFiles, mappedResponse];

        console.log(
          "📁 Single file upload - Updated files:",
          updatedFiles.map((f) => f.name)
        );
        console.log(
          "📁 Single file upload - Updated uploaded files:",
          updatedUploadedFiles.length
        );

        return {
          ...prev,
          businessDocument: file, // Keep for backward compatibility
          businessDocuments: updatedFiles, // Add to multiple files list
          uploaded_file: updatedUploadedFiles,
        };
      });

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

  // Handle multiple PDF uploads
  const handleMultipleFileUpload = async (files: FileList) => {
    console.log("🚀 S1BasicInfo - Multiple PDF upload started");
    console.log(
      "📁 Files to upload:",
      Array.from(files).map((f) => f.name)
    );

    const pdfFiles = Array.from(files).filter((file) =>
      file.type.includes("pdf")
    );

    if (pdfFiles.length === 0) {
      alert("Please upload PDF files only.");
      return;
    }

    if (pdfFiles.length !== files.length) {
      alert("Some files were skipped. Only PDF files are allowed.");
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const uploadPromises = pdfFiles.map(async (file, index) => {
        console.log(
          `📄 Processing file ${index + 1}/${pdfFiles.length}: ${file.name}`
        );

        // Set a timeout for each PDF extraction request
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(
                new Error(
                  `Request timeout for ${file.name} - AI service is taking too long to respond`
                )
              ),
            30000
          ); // 30 seconds timeout per file
        });

        const extractionPromise = extractPdf({
          file: file,
          document_type: "company_extract",
        }).unwrap();

        const response = (await Promise.race([
          extractionPromise,
          timeoutPromise,
        ])) as any;

        console.log(`✅ File ${index + 1} extracted successfully:`, file.name);
        console.log(`📄 File ${index + 1} response data:`, response);
        console.log(`📊 File ${index + 1} page_count:`, response.page_count);
        console.log(
          `📊 File ${index + 1} page_count type:`,
          typeof response.page_count
        );

        return {
          text_content: response.text_content ?? "",
          page_count:
            typeof (response as any).page_count === "number"
              ? (response as any).page_count
              : typeof (response as any).page_count === "string"
              ? parseInt((response as any).page_count) || 1
              : 1, // Default to 1 if no page count
          metadata: "metadata" in response ? (response as any).metadata : {},
          financial_data:
            "financial_data" in response
              ? (response as any).financial_data
              : null,
          document_type:
            typeof (response as any).document_type === "string"
              ? (response as any).document_type
              : "company_extract",
          file_name: file.name, // Add file name for reference
        };
      });

      const extractedResults = await Promise.all(uploadPromises);

      console.log("🎉 All PDFs extracted successfully:", extractedResults);

      setForm((prev) => {
        // Merge with existing files if any
        const existingFiles = prev.businessDocuments || [];
        const existingUploadedFiles = prev.uploaded_file || [];

        console.log(
          "📁 Existing files:",
          existingFiles.map((f) => f.name)
        );
        console.log(
          "📁 New files:",
          pdfFiles.map((f) => f.name)
        );
        console.log(
          "📁 Existing uploaded files:",
          existingUploadedFiles.length
        );

        const mergedFiles = [...existingFiles, ...pdfFiles];
        const mergedUploadedFiles = [
          ...existingUploadedFiles,
          ...extractedResults,
        ];

        console.log(
          "📁 Merged files:",
          mergedFiles.map((f) => f.name)
        );
        console.log("📁 Merged uploaded files:", mergedUploadedFiles.length);

        return {
          ...prev,
          businessDocuments: mergedFiles,
          uploaded_file: mergedUploadedFiles,
        };
      });

      setUploadSuccess(true);
      console.log(
        `✅ ${pdfFiles.length} PDFs uploaded and extracted successfully`
      );
    } catch (error: any) {
      console.error("❌ Multiple PDF upload/extraction failed:", error);
      alert(
        error?.message ||
          "Failed to upload PDFs. Please try again or contact support."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files) {
      if (files.length === 1) {
        // Single file upload (backward compatibility)
        handleFileUpload(files[0]);
      } else if (files.length > 1) {
        // Multiple files upload
        handleMultipleFileUpload(files);
      }
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
    if (files) {
      if (files.length === 1) {
        // Single file upload (backward compatibility)
        handleFileUpload(files[0]);
      } else if (files.length > 1) {
        // Multiple files upload
        handleMultipleFileUpload(files);
      }
    }
  };

  const removeFile = () => {
    setForm((prev) => ({
      ...prev,
      businessDocument: null,
      businessDocuments: [],
      uploaded_file: [],
    }));
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
    console.log("🚀 S1BasicInfo - Form submit started");
    console.log("📝 S1BasicInfo - Current form data:", form);

    // Save current form data to context before validation
    updateFormData("step1", form);

    // Validate the form before proceeding
    const isValid = validateStep(0); // 0-based index for step 1

    if (isValid) {
      console.log("✅ S1BasicInfo - Validation passed, moving to next step");
      console.log("💾 S1BasicInfo - Business Info Form Submitted:", form);
      nextStep();
    } else {
      console.log(
        "❌ S1BasicInfo - Validation failed, showing errors:",
        errors
      );
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
            Passo 01 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium ">
              Inserisci le Informazioni
              <br />
              Aziendali di Base
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
                    Qual è il nome della tua azienda? (Obbligatorio)
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
                    È un'azienda esistente o in arrivo? (Obbligatorio)
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
                          Azienda Esistente
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
                                Allega documenti aziendali (PDF singoli o
                                multipli)
                              </span>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                multiple
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
                                Elaborazione documento con AI... (Potrebbe
                                richiedere fino a 30 secondi)
                              </span>
                            </div>
                          )}

                          {/* Single file display - only show if no multiple files */}
                          {form.businessDocument &&
                            (!form.businessDocuments ||
                              form.businessDocuments.length === 0) &&
                            !isUploading && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FiCheck className="text-green-600 w-4 h-4" />
                                  <span className="text-sm text-green-600">
                                    {form.businessDocument.name} caricato con
                                    successo
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
                                      <span>
                                        ⚠️ {extractedData.text_content}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* Multiple files display */}
                          {form.businessDocuments &&
                            form.businessDocuments.length > 0 &&
                            !isUploading && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <FiCheck className="text-green-600 w-4 h-4" />
                                  <span className="text-sm text-green-600 font-medium">
                                    {form.businessDocuments.length} PDF
                                    {form.businessDocuments.length > 1
                                      ? "s"
                                      : ""}{" "}
                                    uploaded successfully
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

                                {/* List of uploaded files */}
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {form.businessDocuments.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                      <span className="text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-gray-500 flex-shrink-0">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Display extracted content summary */}
                                {form.uploaded_file &&
                                  form.uploaded_file.length > 0 && (
                                    <div className="text-xs p-2 rounded bg-green-50 text-green-700 border border-green-200">
                                      <span>
                                        ✅ {form.uploaded_file.length} file
                                        {form.uploaded_file.length > 1
                                          ? "s"
                                          : ""}{" "}
                                        extracted successfully
                                      </span>
                                      <div className="mt-1 text-gray-600">
                                        Total pages:{" "}
                                        {form.uploaded_file.reduce(
                                          (total, file) => {
                                            const pageCount =
                                              file.page_count || 1;
                                            console.log(
                                              `📄 File: ${
                                                file.file_name || "Unknown"
                                              }, Page Count: ${pageCount}`
                                            );
                                            return total + pageCount;
                                          },
                                          0
                                        )}
                                      </div>
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
                          Nuova Azienda
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
                              placeholder="Altri (Es. Quando stai pianificando di stabilire l'azienda?)"
                              value={form.businessStage}
                              onChange={handleInputChange}
                              name="businessStage"
                              onClick={() => setShowNewBusinessDropdown(true)}
                              onFocus={() => setShowNewBusinessDropdown(true)}
                              className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                            />

                            {/* Selected Options Display */}
                            {form.selectedBusinessStagesOptions &&
                              form.selectedBusinessStagesOptions.length > 0 && (
                                <div className="mt-3">
                                  <div className="text-sm text-gray-600 mb-2">
                                    Opzioni selezionate:
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {form.selectedBusinessStagesOptions.map(
                                      (option, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                        >
                                          <span className="mr-2">{option}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newOptions =
                                                form.selectedBusinessStagesOptions?.filter(
                                                  (opt) => opt !== option
                                                ) || [];
                                              setForm({
                                                ...form,
                                                selectedBusinessStagesOptions:
                                                  newOptions,
                                                businessStage:
                                                  newOptions.join(", "),
                                              });
                                            }}
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
                                      Caricamento suggerimenti AI...
                                    </span>
                                  </div>
                                )}

                                {/* AI Suggestions */}
                                {!isLoadingSuggestions &&
                                  aiSuggestions.length > 0 && (
                                    <>
                                      {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">AI Suggestions:</div> */}
                                      {aiSuggestions.map(
                                        (suggestion, index) => {
                                          const isSelected =
                                            form.selectedBusinessStagesOptions?.includes(
                                              suggestion
                                            ) || false;
                                          return (
                                            <button
                                              key={`ai-suggestion-${index}`}
                                              type="button"
                                              className={`flex items-center p-1 ml-7 rounded-lg cursor-pointer text-left transition-colors ${
                                                isSelected
                                                  ? "bg-primary/10 border border-primary"
                                                  : "hover:bg-gray-50"
                                              }`}
                                              onClick={() => {
                                                const currentOptions =
                                                  form.selectedBusinessStagesOptions ||
                                                  [];
                                                const isAlreadySelected =
                                                  currentOptions.includes(
                                                    suggestion
                                                  );

                                                let newOptions;
                                                if (isAlreadySelected) {
                                                  // Remove if already selected
                                                  newOptions =
                                                    currentOptions.filter(
                                                      (opt) =>
                                                        opt !== suggestion
                                                    );
                                                } else {
                                                  // Add if not selected
                                                  newOptions = [
                                                    ...currentOptions,
                                                    suggestion,
                                                  ];
                                                }

                                                setForm({
                                                  ...form,
                                                  selectedBusinessStagesOptions:
                                                    newOptions,
                                                  businessStage:
                                                    newOptions.join(", "),
                                                });
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
                                      {/* <div className="border-t border-gray-200 my-2"></div> */}
                                      {/* <div className="text-xs text-gray-500 font-medium mb-1 px-2">Other Options:</div> */}
                                    </>
                                  )}

                                {/* Custom business stages */}
                                {form.customBusinessStages?.map(
                                  (stage, index) => {
                                    const isSelected =
                                      form.selectedBusinessStagesOptions?.includes(
                                        stage
                                      ) || false;
                                    return (
                                      <button
                                        key={`custom-stage-${index}`}
                                        type="button"
                                        className={`flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer text-left transition-colors ${
                                          isSelected
                                            ? "bg-primary/10 border-primary"
                                            : "bg-white hover:bg-gray-50"
                                        }`}
                                        onClick={() => {
                                          const currentOptions =
                                            form.selectedBusinessStagesOptions ||
                                            [];
                                          const isAlreadySelected =
                                            currentOptions.includes(stage);

                                          let newOptions;
                                          if (isAlreadySelected) {
                                            // Remove if already selected
                                            newOptions = currentOptions.filter(
                                              (opt) => opt !== stage
                                            );
                                          } else {
                                            // Add if not selected
                                            newOptions = [
                                              ...currentOptions,
                                              stage,
                                            ];
                                          }

                                          setForm({
                                            ...form,
                                            selectedBusinessStagesOptions:
                                              newOptions,
                                            businessStage:
                                              newOptions.join(", "),
                                          });
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
                                          {stage}
                                        </span>
                                      </button>
                                    );
                                  }
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
                    In quale Stato / Città sarà ubicata l'azienda?
                    (Obbligatorio)
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
                    Descrivi la tua attività? (Obbligatorio)
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
                    Totale dipendenti (Obbligatorio)
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
                    Hai un sito web o presenza online?
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.website ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    placeholder=""
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
                      Lingua del piano sorgente:
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
                      Valuta del piano target:
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
