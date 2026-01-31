"use client";

import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
import { useExtractPdfMutation } from "@/redux/api/pdfExtraction/pdfExtractionApi";

interface TeamMember {
  name: string;
  position: string;
  background: string;
}

interface BusinessInfoForm {
  businessName: string;
  businessStage: string;
  businessType: string;
  businessDocument: File | null;
  businessDocuments?: File[]; // Multiple PDF files - optional (legacy)
  extractedContent?: string;
  location: string;
  activity: string;
  totalEmployees: string;
  website: string;
  sourceLanguage: string;
  targetLanguage: string;
  customBusinessStages?: string[];
  selectedBusinessStagesOptions?: string[];
  teamMembers?: TeamMember[];
  uploaded_file?: {
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
    file_name?: string; // Add file name for reference
  }[];
  // New fields aligned with SmartFormContext
  balanceSheetFiles?: File[];
  visuraCameraleFiles?: File[];
  balanceSheetExtractions?: Array<{
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
    file_name?: string;
  }>;
  visuraCameraleExtractions?: Array<{
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
    file_name?: string;
  }>;
  startupStructure?: string;
  plannedEstablishmentDate?: string;
  extractedCompanyId?: string;
  extractedCompanyName?: string;
  extractedFounders?: string;
  extractedEstablishmentDate?: string;
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
      sourceLanguage: "Italiano",
      targetLanguage: "Euro",
      customBusinessStages: [],
      selectedBusinessStagesOptions: [],
      teamMembers: [{ name: "", position: "", background: "" }],
      balanceSheetFiles: [],
      visuraCameraleFiles: [],
      balanceSheetExtractions: [],
      visuraCameraleExtractions: [],
      startupStructure: "",
      plannedEstablishmentDate: "",
      extractedCompanyId: "",
      extractedCompanyName: "",
      extractedFounders: "",
      extractedEstablishmentDate: "",
    },
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
      // Close structure dropdown when clicking outside
      if (!(event.target as Element).closest(".structure-dropdown")) {
        setShowStructureDropdown(false);
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
  const balanceInputRef = useRef<HTMLInputElement>(null);
  const visuraInputRef = useRef<HTMLInputElement>(null);
  const unifiedFileInputRef = useRef<HTMLInputElement>(null);
  const newBusinessDropdownRef = useRef<HTMLDivElement>(null);
  const [showNewBusinessInput, setShowNewBusinessInput] = useState(false);
  const [showNewBusinessDropdown, setShowNewBusinessDropdown] = useState(false);
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [getAISuggestions] = useGetAISuggestionsMutation();
  const [extractPdf] = useExtractPdfMutation();

  const languages = ["Italiano"];
  const currency = ["Euro"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle team member input changes
  const handleTeamMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      teamMembers:
        prev.teamMembers?.map((member, i) =>
          i === index ? { ...member, [field]: value } : member,
        ) || [],
    }));
  };

  // Add new team member
  const addTeamMember = () => {
    setForm((prev) => ({
      ...prev,
      teamMembers: [
        ...(prev.teamMembers || []),
        { name: "", position: "", background: "" },
      ],
    }));
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers?.filter((_, i) => i !== index) || [],
    }));
  };

  // Custom handler for AI suggestion fields that preserves both user input and selected options
  const handleAISuggestionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof BusinessInfoForm,
    selectedOptionsField: keyof BusinessInfoForm,
  ) => {
    const { value } = e.target;

    // Update the input field value
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // When user is typing, we need to update the selected options to reflect what's actually in the input
    // Parse the current input to see what options are still there
    const inputItems = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const currentSelectedOptions =
      (form[selectedOptionsField] as string[]) || [];
    const allAISuggestions = [
      ...aiSuggestions,
      ...(form.customBusinessStages || []),
    ];

    // Filter selected options to only include those still present in the input
    const updatedSelectedOptions = currentSelectedOptions.filter((option) =>
      inputItems.includes(option),
    );

    // Update selected options if they've changed
    if (updatedSelectedOptions.length !== currentSelectedOptions.length) {
      setForm((prev) => ({
        ...prev,
        [selectedOptionsField]: updatedSelectedOptions,
      }));
    }
  };

  const handleFileUpload = async (file: File) => {
    // Allow images/docs/pdfs; only run extraction for PDFs, otherwise store file info
    const isPdf = file.type.includes("pdf");

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      let mappedResponse: any = null;

      if (isPdf) {
        // Set a timeout for the PDF extraction request
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(
                new Error(
                  "Request timeout - AI service is taking too long to respond",
                ),
              ),
            30000,
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
          typeof response.page_count,
        );

        mappedResponse = {
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
          file_name: file.name,
        };

        // Auto-fill form fields if data is extracted (PDF only)
        if (
          response.text_content &&
          response.text_content !==
            "Document uploaded successfully. AI extraction service is currently unavailable."
        ) {
          console.log("Extracted data:", response);

          // Attempt to map known metadata fields
          const meta = (response as any).metadata || {};
          const business_name =
            (response as any).business_name ||
            meta.business_name ||
            meta.denominazione ||
            "";
          const location =
            (response as any).location ||
            meta.address ||
            meta.sede_legale ||
            "";
          const company_id =
            meta.vat_number ||
            meta.piva ||
            meta.codice_fiscale ||
            meta.company_id ||
            "";
          const founders = Array.isArray(meta.founders)
            ? meta.founders.join(", ")
            : meta.founders || meta.soci || meta.amministratori || "";
          const establishment_date =
            meta.establishment_date ||
            meta.data_costituzione ||
            meta.data_iscrizione ||
            "";

          // Auto-fill form fields based on extracted data
          setForm((prev) => ({
            ...prev,
            businessName: business_name || prev.businessName,
            location: location || prev.location,
            extractedCompanyId: company_id || prev.extractedCompanyId,
            extractedCompanyName: business_name || prev.extractedCompanyName,
            extractedFounders: founders || prev.extractedFounders,
            extractedEstablishmentDate:
              establishment_date || prev.extractedEstablishmentDate,
          }));
        }
      } else {
        // Non-PDF: just store basic metadata
        mappedResponse = {
          text_content:
            "Document uploaded successfully. AI extraction not available for this file type.",
          status: "uploaded_no_extraction",
          success: false,
          document_type: "other",
          file_name: file.name,
          page_count: 1,
          metadata: {},
          financial_data: null,
        };
      }

      // Update lists (common for both PDF and non-PDF)
      setForm((prev) => {
        const existingFiles = prev.businessDocuments || [];
        const existingUploadedFiles = prev.uploaded_file || [];
        const updatedFiles = [...existingFiles, file];
        const updatedUploadedFiles = [...existingUploadedFiles, mappedResponse];
        return {
          ...prev,
          businessDocument: file,
          businessDocuments: updatedFiles,
          uploaded_file: updatedUploadedFiles,
        };
      });

      setUploadSuccess(true);
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
          "AI extraction service unavailable, file uploaded without processing",
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

    const pdfFiles = Array.from(files).filter((file) =>
      file.type.includes("pdf"),
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
          `📄 Processing file ${index + 1}/${pdfFiles.length}: ${file.name}`,
        );

        // Set a timeout for each PDF extraction request
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(
                new Error(
                  `Request timeout for ${file.name} - AI service is taking too long to respond`,
                ),
              ),
            30000,
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
          typeof response.page_count,
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
          existingFiles.map((f) => f.name),
        );
        console.log(
          "📁 New files:",
          pdfFiles.map((f) => f.name),
        );
        console.log(
          "📁 Existing uploaded files:",
          existingUploadedFiles.length,
        );

        const mergedFiles = [...existingFiles, ...pdfFiles];
        const mergedUploadedFiles = [
          ...existingUploadedFiles,
          ...extractedResults,
        ];

        console.log(
          "📁 Merged files:",
          mergedFiles.map((f) => f.name),
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
        `✅ ${pdfFiles.length} PDFs uploaded and extracted successfully`,
      );
    } catch (error: any) {
      console.error("❌ Multiple PDF upload/extraction failed:", error);
      alert(
        error?.message ||
          "Failed to upload PDFs. Please try again or contact support.",
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
        handleFileUpload(files[0]);
      } else if (files.length > 1) {
        handleMultipleFileUpload(files);
      }
    }
  };

  // Handle balance sheet file uploads
  const handleBalanceSheetUpload = async (files: FileList) => {
    const fileArr = Array.from(files);

    if (fileArr.length === 0) {
      console.log("❌ BALANCE SHEET - No files provided");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const results = await Promise.all(
        fileArr.map(async (file, index) => {
          try {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                console.log(
                  `⏰ BALANCE SHEET [${index + 1}] - Timeout reached for: ${file.name}`,
                );
                reject(new Error(`Request timeout for ${file.name}`));
              }, 30000);
            });

            const extractionPromise = extractPdf({
              file,
              document_type: "balance_sheet",
            }).unwrap();

            const response = (await Promise.race([
              extractionPromise,
              timeoutPromise,
            ])) as any;

            console.log(
              `✅ BALANCE SHEET [${index + 1}] - AI extraction completed for: ${file.name}`,
            );
            console.log(
              `📊 BALANCE SHEET [${index + 1}] - Extraction response:`,
              {
                text_content_length: response.text_content
                  ? response.text_content.length
                  : 0,
                page_count: response.page_count,
                has_metadata: !!response.metadata,
                has_financial_data: !!response.financial_data,
                document_type: response.document_type,
              },
            );
            console.log(
              `📝 BALANCE SHEET [${index + 1}] - Full extraction data:`,
              response,
            );

            const result = {
              text_content: response.text_content ?? "",
              page_count:
                typeof response.page_count === "number"
                  ? response.page_count
                  : parseInt(response.page_count) || 1,
              metadata: "metadata" in response ? response.metadata : {},
              financial_data:
                "financial_data" in response ? response.financial_data : null,
              document_type: "balance_sheet",
              file_name: file.name,
            };

            console.log(
              `📋 BALANCE SHEET [${index + 1}] - Processed result:`,
              result,
            );
            return result;
          } catch (error) {
            console.log(
              `❌ BALANCE SHEET [${index + 1}] - Extraction failed for: ${file.name}`,
              error,
            );

            // If extraction fails, still store the file but with error message
            const result = {
              text_content:
                "Document uploaded successfully. AI extraction service encountered an error.",
              status: "extraction_error",
              success: false,
              document_type: "balance_sheet",
              file_name: file.name,
              page_count: 1,
              metadata: {},
              financial_data: null,
              error: error instanceof Error ? error.message : "Unknown error",
            };

            console.log(
              `📋 BALANCE SHEET [${index + 1}] - Error result:`,
              result,
            );
            return result;
          }
        }),
      );

      console.log("\n🎉 BALANCE SHEET - All files processed successfully!");
      console.log("📊 BALANCE SHEET - Processing summary:", {
        total_files: results.length,
        successfully_extracted: results.filter(
          (r: any) =>
            r.document_type === "balance_sheet" &&
            r.status !== "uploaded_no_extraction" &&
            r.status !== "extraction_error",
        ).length,
        extraction_errors: results.filter(
          (r: any) => r.status === "extraction_error",
        ).length,
        total_pages: results.reduce((sum, r) => sum + (r.page_count || 0), 0),
      });
      console.log("📋 BALANCE SHEET - All results:", results);
      console.log("\n💾 BALANCE SHEET - Updating form state...");
      setForm((prev) => {
        const existingFiles = prev.balanceSheetFiles || [];
        const existingExtractions = prev.balanceSheetExtractions || [];
        const updatedForm = {
          ...prev,
          balanceSheetFiles: [...existingFiles, ...fileArr],
          balanceSheetExtractions: [...existingExtractions, ...results],
          // backward-compatible containers
          businessDocuments: [...(prev.businessDocuments || []), ...fileArr],
          uploaded_file: [...(prev.uploaded_file || []), ...results],
        };

        console.log("💾 BALANCE SHEET - Updated form state:", {
          total_balance_sheet_files: updatedForm.balanceSheetFiles?.length || 0,
          total_balance_sheet_extractions:
            updatedForm.balanceSheetExtractions?.length || 0,
          total_business_documents: updatedForm.businessDocuments?.length || 0,
          total_uploaded_files: updatedForm.uploaded_file?.length || 0,
        });

        // Log the complete extraction array structure
        console.log("\n📋 BALANCE SHEET - Complete extraction array:");
        console.log(
          "🔍 Balance Sheet Extractions:",
          updatedForm.balanceSheetExtractions,
        );
        console.log("🔍 All Uploaded Files Array:", updatedForm.uploaded_file);

        // Verify array structure for each extraction
        if (
          updatedForm.balanceSheetExtractions &&
          updatedForm.balanceSheetExtractions.length > 0
        ) {
          updatedForm.balanceSheetExtractions.forEach((extraction, index) => {
            console.log(`📄 Balance Sheet Extraction [${index + 1}]:`, {
              file_name: extraction.file_name,
              document_type: extraction.document_type,
              text_content_length: extraction.text_content
                ? extraction.text_content.length
                : 0,
              page_count: extraction.page_count,
              has_metadata: !!extraction.metadata,
              has_financial_data: !!extraction.financial_data,
              metadata_keys: extraction.metadata
                ? Object.keys(extraction.metadata)
                : [],
              full_object: extraction,
            });
          });
        }

        return updatedForm;
      });

      console.log(
        "\n🎆 BALANCE SHEET - Upload process completed successfully!",
      );
      setUploadSuccess(true);

      // reset input value so user can re-upload same file names if needed
      if (balanceInputRef.current) {
        balanceInputRef.current.value = "";
        console.log("🔄 BALANCE SHEET - File input reset for future uploads");
      }

      console.log("✅ BALANCE SHEET - Process finished, UI updated");
    } catch (error) {
      console.error("\n❌ BALANCE SHEET - Upload process failed!");
      console.error("🚨 BALANCE SHEET - Error details:", error);
      console.error("🚨 BALANCE SHEET - Error type:", typeof error);
      console.error(
        "🚨 BALANCE SHEET - Error message:",
        error instanceof Error ? error.message : String(error),
      );

      // Log additional error context if available
      if (error && typeof error === "object") {
        if ("status" in error)
          console.error(
            "🚨 BALANCE SHEET - Error status:",
            (error as any).status,
          );
        if ("data" in error)
          console.error("🚨 BALANCE SHEET - Error data:", (error as any).data);
        if ("stack" in error)
          console.error(
            "🚨 BALANCE SHEET - Error stack:",
            (error as any).stack,
          );
      }

      alert("Failed to upload Balance Sheet files. Please try again.");
    } finally {
      console.log(
        "\n🏁 BALANCE SHEET - Finally block executed, cleaning up...",
      );
      setIsUploading(false);
      console.log(
        "🔄 BALANCE SHEET - Upload state reset (isUploading = false)",
      );
    }

    console.log(
      "\n🏁 BALANCE SHEET - handleBalanceSheetUpload function completed",
    );
  };

  // Handle visura camerale file uploads
  const handleVisuraCameraleUpload = async (files: FileList) => {
    const fileArr = Array.from(files);
    console.log("🚀 VISURA CAMERALE - Starting file upload process");
    console.log(
      "📁 VISURA CAMERALE - Files to upload:",
      fileArr.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    );

    if (fileArr.length === 0) {
      console.log("❌ VISURA CAMERALE - No files provided");
      return;
    }

    console.log(`📊 VISURA CAMERALE - Processing ${fileArr.length} file(s)`);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const results = await Promise.all(
        fileArr.map(async (file, index) => {
          console.log(
            `\n📄 VISURA CAMERALE [${index + 1}/${fileArr.length}] - Processing: ${file.name}`,
          );
          console.log(
            `📄 File type: ${file.type}, Size: ${(file.size / 1024).toFixed(2)} KB`,
          );

          // AI service accepts all file types, so always try extraction
          console.log(
            `🔄 VISURA CAMERALE [${index + 1}] - Starting AI extraction for: ${file.name}`,
          );
          console.log(
            `📊 VISURA CAMERALE [${index + 1}] - Document type: visura_camerale`,
          );

          try {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                console.log(
                  `⏰ VISURA CAMERALE [${index + 1}] - Timeout reached for: ${file.name}`,
                );
                reject(new Error(`Request timeout for ${file.name}`));
              }, 30000);
            });

            const extractionPromise = extractPdf({
              file,
              document_type: "visura_camerale",
            }).unwrap();
            const response = (await Promise.race([
              extractionPromise,
              timeoutPromise,
            ])) as any;

            console.log(
              `✅ VISURA CAMERALE [${index + 1}] - AI extraction completed for: ${file.name}`,
            );
            console.log(
              `📊 VISURA CAMERALE [${index + 1}] - Extraction response:`,
              {
                text_content_length: response.text_content
                  ? response.text_content.length
                  : 0,
                page_count: response.page_count,
                has_metadata: !!response.metadata,
                has_financial_data: !!response.financial_data,
                document_type: response.document_type,
              },
            );
            console.log(
              `📝 VISURA CAMERALE [${index + 1}] - Full extraction data:`,
              response,
            );

            const result = {
              text_content: response.text_content ?? "",
              page_count:
                typeof response.page_count === "number"
                  ? response.page_count
                  : parseInt(response.page_count) || 1,
              metadata: "metadata" in response ? response.metadata : {},
              financial_data:
                "financial_data" in response ? response.financial_data : null,
              document_type: "visura_camerale",
              file_name: file.name,
            };

            console.log(
              `📋 VISURA CAMERALE [${index + 1}] - Processed result:`,
              result,
            );
            return result;
          } catch (error) {
            console.log(
              `❌ VISURA CAMERALE [${index + 1}] - Extraction failed for: ${file.name}`,
              error,
            );

            // If extraction fails, still store the file but with error message
            const result = {
              text_content:
                "Document uploaded successfully. AI extraction service encountered an error.",
              status: "extraction_error",
              success: false,
              document_type: "visura_camerale",
              file_name: file.name,
              page_count: 1,
              metadata: {},
              financial_data: null,
              error: error instanceof Error ? error.message : "Unknown error",
            };

            console.log(
              `📋 VISURA CAMERALE [${index + 1}] - Error result:`,
              result,
            );
            return result;
          }
        }),
      );

      console.log("\n🎉 VISURA CAMERALE - All files processed successfully!");
      console.log("📊 VISURA CAMERALE - Processing summary:", {
        total_files: results.length,
        successfully_extracted: results.filter(
          (r: any) =>
            r.document_type === "visura_camerale" &&
            r.status !== "uploaded_no_extraction" &&
            r.status !== "extraction_error",
        ).length,
        extraction_errors: results.filter(
          (r: any) => r.status === "extraction_error",
        ).length,
        total_pages: results.reduce((sum, r) => sum + (r.page_count || 0), 0),
      });
      console.log("📋 VISURA CAMERALE - All results:", results);

      // Attempt to autofill company profile fields from the first extraction metadata
      console.log("\n🔍 VISURA CAMERALE - Checking for autofill data...");
      const firstPdfResult = results.find(
        (r: any) =>
          r.document_type === "visura_camerale" &&
          r.status !== "uploaded_no_extraction" &&
          r.status !== "extraction_error",
      );

      if (firstPdfResult) {
        console.log(
          "📊 VISURA CAMERALE - Found PDF extraction data for autofill:",
          firstPdfResult,
        );
        const md = firstPdfResult.metadata || {};
        console.log("🔍 VISURA CAMERALE - Metadata for autofill:", md);

        const business_name = md.business_name || md.denominazione || "";
        const location = md.address || md.sede_legale || "";
        const company_id = md.vat_number || md.piva || md.codice_fiscale || "";
        const founders = Array.isArray(md.founders)
          ? md.founders.join(", ")
          : md.founders || md.soci || md.amministratori || "";
        const establishment_date =
          md.establishment_date ||
          md.data_costituzione ||
          md.data_iscrizione ||
          "";

        console.log("📝 VISURA CAMERALE - Extracted fields for autofill:", {
          business_name,
          location,
          company_id,
          founders,
          establishment_date,
        });

        console.log(
          "\n💾 VISURA CAMERALE - Updating form state with autofill...",
        );
        setForm((prev) => {
          const existingFiles = prev.visuraCameraleFiles || [];
          const existingExtractions = prev.visuraCameraleExtractions || [];
          const updatedForm = {
            ...prev,
            visuraCameraleFiles: [...existingFiles, ...fileArr],
            visuraCameraleExtractions: [...existingExtractions, ...results],
            businessDocuments: [...(prev.businessDocuments || []), ...fileArr],
            uploaded_file: [...(prev.uploaded_file || []), ...results],
            // Profile autofill (non-destructive)
            businessName: prev.businessName || business_name,
            location: prev.location || location,
            extractedCompanyId: prev.extractedCompanyId || company_id,
            extractedCompanyName: prev.extractedCompanyName || business_name,
            extractedFounders: prev.extractedFounders || founders,
            extractedEstablishmentDate:
              prev.extractedEstablishmentDate || establishment_date,
          };

          console.log("💾 VISURA CAMERALE - Updated form state:", {
            total_visura_files: updatedForm.visuraCameraleFiles?.length || 0,
            total_visura_extractions:
              updatedForm.visuraCameraleExtractions?.length || 0,
            total_business_documents:
              updatedForm.businessDocuments?.length || 0,
            total_uploaded_files: updatedForm.uploaded_file?.length || 0,
            businessName: updatedForm.businessName,
            location: updatedForm.location,
            extractedCompanyId: updatedForm.extractedCompanyId,
            extractedCompanyName: updatedForm.extractedCompanyName,
            extractedFounders: updatedForm.extractedFounders,
            extractedEstablishmentDate: updatedForm.extractedEstablishmentDate,
          });

          // Log the complete extraction array structure
          console.log("\n📋 VISURA CAMERALE - Complete extraction array:");
          console.log(
            "🔍 Visura Camerale Extractions:",
            updatedForm.visuraCameraleExtractions,
          );
          console.log(
            "🔍 All Uploaded Files Array:",
            updatedForm.uploaded_file,
          );

          // Verify array structure for each extraction
          if (
            updatedForm.visuraCameraleExtractions &&
            updatedForm.visuraCameraleExtractions.length > 0
          ) {
            updatedForm.visuraCameraleExtractions.forEach(
              (extraction, index) => {
                console.log(`📄 Visura Camerale Extraction [${index + 1}]:`, {
                  file_name: extraction.file_name,
                  document_type: extraction.document_type,
                  text_content_length: extraction.text_content
                    ? extraction.text_content.length
                    : 0,
                  page_count: extraction.page_count,
                  has_metadata: !!extraction.metadata,
                  has_financial_data: !!extraction.financial_data,
                  metadata_keys: extraction.metadata
                    ? Object.keys(extraction.metadata)
                    : [],
                  full_object: extraction,
                });
              },
            );
          }

          return updatedForm;
        });

        console.log("✅ VISURA CAMERALE - Form updated with autofill data");
      } else {
        console.log(
          "⚠️ VISURA CAMERALE - No PDF extraction data found, adding files without autofill",
        );

        console.log(
          "\n💾 VISURA CAMERALE - Updating form state without autofill...",
        );
        setForm((prev) => {
          const existingFiles = prev.visuraCameraleFiles || [];
          const existingExtractions = prev.visuraCameraleExtractions || [];
          const updatedForm = {
            ...prev,
            visuraCameraleFiles: [...existingFiles, ...fileArr],
            visuraCameraleExtractions: [...existingExtractions, ...results],
            businessDocuments: [...(prev.businessDocuments || []), ...fileArr],
            uploaded_file: [...(prev.uploaded_file || []), ...results],
          };

          console.log(
            "💾 VISURA CAMERALE - Updated form state (no autofill):",
            {
              total_visura_files: updatedForm.visuraCameraleFiles?.length || 0,
              total_visura_extractions:
                updatedForm.visuraCameraleExtractions?.length || 0,
              total_business_documents:
                updatedForm.businessDocuments?.length || 0,
              total_uploaded_files: updatedForm.uploaded_file?.length || 0,
            },
          );

          // Log the complete extraction array structure (no autofill case)
          console.log(
            "\n📋 VISURA CAMERALE - Complete extraction array (no autofill):",
          );
          console.log(
            "🔍 Visura Camerale Extractions:",
            updatedForm.visuraCameraleExtractions,
          );
          console.log(
            "🔍 All Uploaded Files Array:",
            updatedForm.uploaded_file,
          );

          // Verify array structure for each extraction
          if (
            updatedForm.visuraCameraleExtractions &&
            updatedForm.visuraCameraleExtractions.length > 0
          ) {
            updatedForm.visuraCameraleExtractions.forEach(
              (extraction, index) => {
                console.log(
                  `📄 Visura Camerale Extraction [${index + 1}] (no autofill):`,
                  {
                    file_name: extraction.file_name,
                    document_type: extraction.document_type,
                    text_content_length: extraction.text_content
                      ? extraction.text_content.length
                      : 0,
                    page_count: extraction.page_count,
                    has_metadata: !!extraction.metadata,
                    has_financial_data: !!extraction.financial_data,
                    metadata_keys: extraction.metadata
                      ? Object.keys(extraction.metadata)
                      : [],
                    full_object: extraction,
                  },
                );
              },
            );
          }

          return updatedForm;
        });

        console.log("✅ VISURA CAMERALE - Form updated without autofill");
      }

      console.log(
        "\n🎆 VISURA CAMERALE - Upload process completed successfully!",
      );
      setUploadSuccess(true);

      if (visuraInputRef.current) {
        visuraInputRef.current.value = "";
        console.log("🔄 VISURA CAMERALE - File input reset for future uploads");
      }

      console.log("✅ VISURA CAMERALE - Process finished, UI updated");
    } catch (error) {
      console.error("\n❌ VISURA CAMERALE - Upload process failed!");
      console.error("🚨 VISURA CAMERALE - Error details:", error);
      console.error("🚨 VISURA CAMERALE - Error type:", typeof error);
      console.error(
        "🚨 VISURA CAMERALE - Error message:",
        error instanceof Error ? error.message : String(error),
      );

      // Log additional error context if available
      if (error && typeof error === "object") {
        if ("status" in error)
          console.error(
            "🚨 VISURA CAMERALE - Error status:",
            (error as any).status,
          );
        if ("data" in error)
          console.error(
            "🚨 VISURA CAMERALE - Error data:",
            (error as any).data,
          );
        if ("stack" in error)
          console.error(
            "🚨 VISURA CAMERALE - Error stack:",
            (error as any).stack,
          );
      }

      alert("Failed to upload Visura Camerale files. Please try again.");
    } finally {
      console.log(
        "\n🏁 VISURA CAMERALE - Finally block executed, cleaning up...",
      );
      setIsUploading(false);
      console.log(
        "🔄 VISURA CAMERALE - Upload state reset (isUploading = false)",
      );
    }

    console.log(
      "\n🏁 VISURA CAMERALE - handleVisuraCameraleUpload function completed",
    );
  };

  // Handle unified file upload (combines balance sheet and visura camerale functionality)
  const handleUnifiedFileUpload = async (files: FileList) => {
    const fileArr = Array.from(files);
    console.log("🚀 UNIFIED UPLOAD - Starting file upload process");
    console.log(
      "📁 Files to upload:",
      fileArr.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    );

    if (fileArr.length === 0) {
      console.log("❌ UNIFIED UPLOAD - No files provided");
      return;
    }

    console.log(`📊 UNIFIED UPLOAD - Processing ${fileArr.length} file(s)`);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const results = await Promise.all(
        fileArr.map(async (file, index) => {
          console.log(
            `\n📄 UNIFIED UPLOAD [${index + 1}/${
              fileArr.length
            }] - Processing: ${file.name}`,
          );
          console.log(
            `📄 File type: ${file.type}, Size: ${(file.size / 1024).toFixed(
              2,
            )} KB`,
          );

          if (file.type.includes("pdf")) {
            console.log(
              `🔄 UNIFIED UPLOAD [${
                index + 1
              }] - Starting PDF extraction for: ${file.name}`,
            );

            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                console.log(
                  `⏰ UNIFIED UPLOAD [${index + 1}] - Timeout reached for: ${
                    file.name
                  }`,
                );
                reject(new Error(`Request timeout for ${file.name}`));
              }, 30000);
            });

            // Use general document extraction for unified upload
            const extractionPromise = extractPdf({
              file,
              document_type: "company_extract",
            }).unwrap();
            const response = (await Promise.race([
              extractionPromise,
              timeoutPromise,
            ])) as any;

            console.log(
              `✅ UNIFIED UPLOAD [${
                index + 1
              }] - PDF extraction completed for: ${file.name}`,
            );
            console.log(
              `📊 UNIFIED UPLOAD [${index + 1}] - Extraction response:`,
              {
                text_content_length: response.text_content
                  ? response.text_content.length
                  : 0,
                page_count: response.page_count,
                has_metadata: !!response.metadata,
                has_financial_data: !!response.financial_data,
                document_type: response.document_type,
              },
            );
            console.log(
              `📝 UNIFIED UPLOAD [${index + 1}] - Full extraction data:`,
              response,
            );

            const result = {
              text_content: response.text_content ?? "",
              page_count:
                typeof response.page_count === "number"
                  ? response.page_count
                  : parseInt(response.page_count) || 1,
              metadata: "metadata" in response ? response.metadata : {},
              financial_data:
                "financial_data" in response ? response.financial_data : null,
              document_type: "company_extract",
              file_name: file.name,
            };

            console.log(
              `📋 UNIFIED UPLOAD [${index + 1}] - Processed result:`,
              result,
            );
            return result;
          } else {
            console.log(
              `📄 UNIFIED UPLOAD [${
                index + 1
              }] - Non-PDF file, skipping extraction: ${file.name}`,
            );

            const result = {
              text_content:
                "Document uploaded successfully. AI extraction not available for this file type.",
              status: "uploaded_no_extraction",
              success: false,
              document_type: "other",
              file_name: file.name,
              page_count: 1,
              metadata: {},
              financial_data: null,
            };

            console.log(
              `📋 UNIFIED UPLOAD [${index + 1}] - Non-PDF result:`,
              result,
            );
            return result;
          }
        }),
      );

      console.log("\n🎉 UNIFIED UPLOAD - All files processed successfully!");
      console.log("📊 UNIFIED UPLOAD - Processing summary:", {
        total_files: results.length,
        pdf_files: results.filter((r) => r.document_type === "company_extract")
          .length,
        other_files: results.filter((r) => r.document_type === "other").length,
        total_pages: results.reduce((sum, r) => sum + (r.page_count || 0), 0),
      });
      console.log("📋 UNIFIED UPLOAD - All results:", results);

      // Attempt to autofill company profile fields from the first extraction metadata
      console.log("\n🔍 UNIFIED UPLOAD - Checking for autofill data...");
      const firstPdfResult = results.find(
        (r) => r.document_type === "company_extract",
      );

      if (firstPdfResult) {
        console.log(
          "📊 UNIFIED UPLOAD - Found PDF extraction data for autofill:",
          firstPdfResult,
        );
        const md = firstPdfResult.metadata || {};
        console.log("🔍 UNIFIED UPLOAD - Metadata for autofill:", md);

        const business_name = md.business_name || md.denominazione || "";
        const location = md.address || md.sede_legale || "";
        const company_id =
          md.vat_number || md.piva || md.codice_fiscale || md.company_id || "";
        const founders = Array.isArray(md.founders)
          ? md.founders.join(", ")
          : md.founders || md.soci || md.amministratori || "";
        const establishment_date =
          md.establishment_date ||
          md.data_costituzione ||
          md.data_iscrizione ||
          "";

        console.log("📝 UNIFIED UPLOAD - Extracted fields for autofill:", {
          business_name,
          location,
          company_id,
          founders,
          establishment_date,
        });

        setForm((prev) => {
          const updatedForm = {
            ...prev,
            businessDocuments: [...(prev.businessDocuments || []), ...fileArr],
            uploaded_file: [...(prev.uploaded_file || []), ...results],
            // Profile autofill (non-destructive)
            businessName: prev.businessName || business_name,
            location: prev.location || location,
            extractedCompanyId: prev.extractedCompanyId || company_id,
            extractedCompanyName: prev.extractedCompanyName || business_name,
            extractedFounders: prev.extractedFounders || founders,
            extractedEstablishmentDate:
              prev.extractedEstablishmentDate || establishment_date,
          };

          console.log("💾 UNIFIED UPLOAD - Updated form state:", {
            total_business_documents:
              updatedForm.businessDocuments?.length || 0,
            total_uploaded_files: updatedForm.uploaded_file?.length || 0,
            businessName: updatedForm.businessName,
            location: updatedForm.location,
            extractedCompanyId: updatedForm.extractedCompanyId,
            extractedCompanyName: updatedForm.extractedCompanyName,
            extractedFounders: updatedForm.extractedFounders,
            extractedEstablishmentDate: updatedForm.extractedEstablishmentDate,
          });

          return updatedForm;
        });

        console.log("✅ UNIFIED UPLOAD - Form updated with autofill data");
      } else {
        console.log(
          "⚠️ UNIFIED UPLOAD - No PDF extraction data found, adding files without autofill",
        );

        // If no PDF extraction data, just add files
        setForm((prev) => {
          const updatedForm = {
            ...prev,
            businessDocuments: [...(prev.businessDocuments || []), ...fileArr],
            uploaded_file: [...(prev.uploaded_file || []), ...results],
          };

          console.log("💾 UNIFIED UPLOAD - Updated form state (no autofill):", {
            total_business_documents:
              updatedForm.businessDocuments?.length || 0,
            total_uploaded_files: updatedForm.uploaded_file?.length || 0,
          });

          return updatedForm;
        });

        console.log("✅ UNIFIED UPLOAD - Form updated without autofill");
      }

      console.log(
        "\n🎆 UNIFIED UPLOAD - Upload process completed successfully!",
      );
      setUploadSuccess(true);

      // Reset input value so user can re-upload same file names if needed
      if (unifiedFileInputRef.current) {
        unifiedFileInputRef.current.value = "";
        console.log("🔄 UNIFIED UPLOAD - File input reset for future uploads");
      }

      console.log("✅ UNIFIED UPLOAD - Process finished, UI updated");
    } catch (error) {
      console.error("\n❌ UNIFIED UPLOAD - Upload process failed!");
      console.error("🚨 UNIFIED UPLOAD - Error details:", error);
      console.error("🚨 UNIFIED UPLOAD - Error type:", typeof error);
      console.error(
        "🚨 UNIFIED UPLOAD - Error message:",
        error instanceof Error ? error.message : String(error),
      );

      // Log additional error context if available
      if (error && typeof error === "object") {
        if ("status" in error)
          console.error(
            "🚨 UNIFIED UPLOAD - Error status:",
            (error as any).status,
          );
        if ("data" in error)
          console.error("🚨 UNIFIED UPLOAD - Error data:", (error as any).data);
        if ("stack" in error)
          console.error(
            "🚨 UNIFIED UPLOAD - Error stack:",
            (error as any).stack,
          );
      }

      alert("Failed to upload files. Please try again.");
    } finally {
      console.log(
        "\n🏁 UNIFIED UPLOAD - Finally block executed, cleaning up...",
      );
      setIsUploading(false);
      console.log(
        "🔄 UNIFIED UPLOAD - Upload state reset (isUploading = false)",
      );
    }

    console.log(
      "\n🏁 UNIFIED UPLOAD - handleUnifiedFileUpload function completed",
    );
  };

  const removeFile = () => {
    console.log("🗑️ Removing all uploaded files");
    setForm((prev) => ({
      ...prev,
      businessDocument: null,
      businessDocuments: [],
      uploaded_file: [],
      balanceSheetFiles: [],
      visuraCameraleFiles: [],
      balanceSheetExtractions: [],
      visuraCameraleExtractions: [],
    }));
    setExtractedData(null);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (unifiedFileInputRef.current) unifiedFileInputRef.current.value = "";
    if (balanceInputRef.current) balanceInputRef.current.value = "";
    if (visuraInputRef.current) visuraInputRef.current.value = "";
    console.log("✅ All files and form state cleared");
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

    // Log all extraction arrays before submission
    console.log("\n📋 S1BasicInfo - FINAL EXTRACTION ARRAYS FOR SUBMISSION:");
    console.log("📊 Form extraction summary:", {
      total_balance_sheet_files: form.balanceSheetFiles?.length || 0,
      total_balance_sheet_extractions:
        form.balanceSheetExtractions?.length || 0,
      total_visura_camerale_files: form.visuraCameraleFiles?.length || 0,
      total_visura_camerale_extractions:
        form.visuraCameraleExtractions?.length || 0,
      total_business_documents: form.businessDocuments?.length || 0,
      total_uploaded_files: form.uploaded_file?.length || 0,
    });

    // Log Balance Sheet extractions
    if (
      form.balanceSheetExtractions &&
      form.balanceSheetExtractions.length > 0
    ) {
      console.log("\n📄 BALANCE SHEET EXTRACTIONS (Final Array):");
      console.log(
        "🔍 Complete Balance Sheet array:",
        form.balanceSheetExtractions,
      );
      form.balanceSheetExtractions.forEach((extraction, index) => {
        console.log(`📄 Balance Sheet [${index + 1}] Final Object:`, {
          file_name: extraction.file_name,
          document_type: extraction.document_type,
          text_content_preview: extraction.text_content
            ? extraction.text_content.substring(0, 100) + "..."
            : "No content",
          text_content_length: extraction.text_content
            ? extraction.text_content.length
            : 0,
          page_count: extraction.page_count,
          metadata: extraction.metadata,
          financial_data: extraction.financial_data,
          complete_object: extraction,
        });
      });
    } else {
      console.log("⚠️ No Balance Sheet extractions found");
    }

    // Log Visura Camerale extractions
    if (
      form.visuraCameraleExtractions &&
      form.visuraCameraleExtractions.length > 0
    ) {
      console.log("\n📄 VISURA CAMERALE EXTRACTIONS (Final Array):");
      console.log(
        "🔍 Complete Visura Camerale array:",
        form.visuraCameraleExtractions,
      );
      form.visuraCameraleExtractions.forEach((extraction, index) => {
        console.log(`📄 Visura Camerale [${index + 1}] Final Object:`, {
          file_name: extraction.file_name,
          document_type: extraction.document_type,
          text_content_preview: extraction.text_content
            ? extraction.text_content.substring(0, 100) + "..."
            : "No content",
          text_content_length: extraction.text_content
            ? extraction.text_content.length
            : 0,
          page_count: extraction.page_count,
          metadata: extraction.metadata,
          financial_data: extraction.financial_data,
          complete_object: extraction,
        });
      });
    } else {
      console.log("⚠️ No Visura Camerale extractions found");
    }

    // Log combined uploaded_file array (legacy compatibility)
    if (form.uploaded_file && form.uploaded_file.length > 0) {
      console.log("\n📄 ALL UPLOADED FILES ARRAY (Legacy compatibility):");
      console.log("🔍 Complete uploaded_file array:", form.uploaded_file);
      form.uploaded_file.forEach((extraction, index) => {
        console.log(`📄 Uploaded File [${index + 1}] Object:`, {
          file_name: extraction.file_name,
          document_type: extraction.document_type,
          text_content_length: extraction.text_content
            ? extraction.text_content.length
            : 0,
          page_count: extraction.page_count,
          has_metadata: !!extraction.metadata,
          has_financial_data: !!extraction.financial_data,
          complete_object: extraction,
        });
      });
    }

    console.log("\n📊 S1BasicInfo - READY FOR SUBMISSION WITH EXTRACTIONS");

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
        errors,
      );
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className=" bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8 ">
          {/* Step Info */}
          <p className="text-center text-[1rem] text-info font-medium mb-2">
            Passo 01 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words ">
              Inserisci le Informazioni
              <br className="hidden sm:block" />
              Aziendali di Base
            </h2>
          </div>

          {/* Form */}
          <div className="px-[5px] md:px-8 py-2 md:py-8 relative">
            {/* Top Right Decorative Image */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
              <img
                src="/images/dotted-top.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="bg-white rounded-2xl px-[5px] md:px-8 py-4 md:py-8 m-2 md:m-8 shadow-lg relative"
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
                          Impresa esistente
                        </span>
                      </div>

                      {/* Conditional Content for Existing Business */}
                      {form.businessType === "existing" && (
                        <div className="mt-3 ml-7 space-y-8">
                          {/* Balance Sheet Uploads */}
                          <div>
                            <div className="mb-2">
                              <span className="text-[0.95rem] font-medium text-accent">
                                Bilancio (ultimo) – allega file
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-50 p-3 rounded-full">
                                <GrAttachment className="text-primary" />
                              </div>
                              <label className="text-sm text-gray-600 cursor-pointer">
                                Carica uno o più file (PDF/Immagini/Documenti)
                                <input
                                  ref={balanceInputRef}
                                  type="file"
                                  accept="application/pdf,image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handleBalanceSheetUpload(e.target.files);
                                    } else {
                                      console.log(
                                        "⚠️ BALANCE SHEET - No files selected",
                                      );
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                              {form.balanceSheetFiles &&
                                form.balanceSheetFiles.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      console.log(
                                        "🔄 BALANCE SHEET - 'Add more files' button clicked",
                                      );
                                      console.log(
                                        "📁 BALANCE SHEET - Current files count:",
                                        form.balanceSheetFiles?.length || 0,
                                      );
                                      balanceInputRef.current?.click();
                                    }}
                                    className="px-3 py-2 bg-[#A9A4FE] text-white text-[0.875rem] font-medium rounded-lg hover:bg-primary/90 transition-all"
                                  >
                                    + Aggiungi altri file
                                  </button>
                                )}
                            </div>
                            {/* List of uploaded balance sheet files */}
                            {form.balanceSheetFiles &&
                              form.balanceSheetFiles.length > 0 && (
                                <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                                  {form.balanceSheetFiles.map((file, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                      <span className="text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-gray-500 flex-shrink-0">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                      </span>
                                      <span className="text-gray-400 text-xs">
                                        {file.type.includes("pdf")
                                          ? "PDF"
                                          : file.type.includes("image")
                                            ? "IMG"
                                            : "DOC"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* Visura Camerale Uploads */}
                          <div>
                            <div className="mb-2">
                              <span className="text-[0.95rem] font-medium text-accent">
                                Visura Camerale – allega file
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-50 p-3 rounded-full">
                                <GrAttachment className="text-primary" />
                              </div>
                              <label className="text-sm text-gray-600 cursor-pointer">
                                Carica uno o più file (PDF/Immagini/Documenti)
                                <input
                                  ref={visuraInputRef}
                                  type="file"
                                  accept="application/pdf,image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  multiple
                                  onChange={(e) => {
                                    console.log(
                                      "📁 VISURA CAMERALE - File input changed",
                                    );
                                    console.log(
                                      "📁 VISURA CAMERALE - Files selected:",
                                      e.target.files?.length || 0,
                                    );
                                    if (e.target.files) {
                                      console.log(
                                        "📝 VISURA CAMERALE - File details:",
                                        Array.from(e.target.files).map((f) => ({
                                          name: f.name,
                                          type: f.type,
                                          size: f.size,
                                        })),
                                      );
                                      handleVisuraCameraleUpload(
                                        e.target.files,
                                      );
                                    } else {
                                      console.log(
                                        "⚠️ VISURA CAMERALE - No files selected",
                                      );
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                              {form.visuraCameraleFiles &&
                                form.visuraCameraleFiles.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      console.log(
                                        "🔄 VISURA CAMERALE - 'Add more files' button clicked",
                                      );
                                      console.log(
                                        "📁 VISURA CAMERALE - Current files count:",
                                        form.visuraCameraleFiles?.length || 0,
                                      );
                                      visuraInputRef.current?.click();
                                    }}
                                    className="px-3 py-2 bg-[#A9A4FE] text-white text-[0.875rem] font-medium rounded-lg hover:bg-primary/90 transition-all"
                                  >
                                    + Aggiungi altri file
                                  </button>
                                )}
                            </div>
                            {/* List of uploaded visura files */}
                            {form.visuraCameraleFiles &&
                              form.visuraCameraleFiles.length > 0 && (
                                <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                                  {form.visuraCameraleFiles.map((file, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                      <span className="text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-gray-500 flex-shrink-0">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                      </span>
                                      <span className="text-gray-400 text-xs">
                                        {file.type.includes("pdf")
                                          ? "PDF"
                                          : file.type.includes("image")
                                            ? "IMG"
                                            : "DOC"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* Upload status */}
                          {isUploading && (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-sm text-gray-600">
                                Elaborazione documento con AI... (Potrebbe
                                richiedere fino a 30 secondi)
                              </span>
                            </div>
                          )}

                          {form.uploaded_file &&
                            form.uploaded_file.length > 0 &&
                            !isUploading && (
                              <div className="text-xs p-2 rounded bg-green-50 text-green-700 border border-green-200">
                                <span>
                                  ✅ {form.uploaded_file.length} file elaborati
                                  con successo
                                </span>
                                <div className="mt-1 text-gray-600">
                                  Pagine totali:{" "}
                                  {form.uploaded_file.reduce(
                                    (total, file) =>
                                      total + (file.page_count || 1),
                                    0,
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Company Profile summary (from Visura) */}
                          {(form.extractedCompanyName ||
                            form.extractedCompanyId ||
                            form.extractedFounders ||
                            form.extractedEstablishmentDate) && (
                            <div className="mt-4 border rounded-lg p-4 bg-[#FCFCFC]">
                              <h4 className="text-[1rem] font-semibold text-accent mb-2">
                                Profilo aziendale (da Visura)
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.95rem] text-accent">
                                {form.extractedCompanyName && (
                                  <div className="flex justify-between">
                                    <span>Denominazione</span>
                                    <span className="font-medium">
                                      {form.extractedCompanyName}
                                    </span>
                                  </div>
                                )}
                                {form.extractedCompanyId && (
                                  <div className="flex justify-between">
                                    <span>P.IVA/C.F.</span>
                                    <span className="font-medium">
                                      {form.extractedCompanyId}
                                    </span>
                                  </div>
                                )}
                                {form.extractedEstablishmentDate && (
                                  <div className="flex justify-between">
                                    <span>Data costituzione</span>
                                    <span className="font-medium">
                                      {form.extractedEstablishmentDate}
                                    </span>
                                  </div>
                                )}
                                {form.location && (
                                  <div className="flex justify-between">
                                    <span>Sede</span>
                                    <span className="font-medium">
                                      {form.location}
                                    </span>
                                  </div>
                                )}
                                {form.extractedFounders && (
                                  <div className="md:col-span-2 flex justify-between">
                                    <span>Fondatori</span>
                                    <span className="font-medium text-right">
                                      {form.extractedFounders}
                                    </span>
                                  </div>
                                )}
                              </div>
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
                          Impresa da costituire
                        </span>
                      </div>

                      {/* Conditional Content for New Business */}
                      {form.businessType === "new" && showNewBusinessInput && (
                        <div
                          className="mt-3 space-y-4 relative"
                          ref={newBusinessDropdownRef}
                        >
                          {/* Startup structure */}
                          <div className="relative structure-dropdown">
                            <label className="text-[0.95rem] text-accent">
                              Struttura prevista
                            </label>
                            <input
                              type="text"
                              name="startupStructure"
                              value={form.startupStructure || ""}
                              onChange={handleInputChange}
                              onClick={() => setShowStructureDropdown(true)}
                              onFocus={() => setShowStructureDropdown(true)}
                              placeholder="Seleziona o inserisci una struttura personalizzata"
                              className="w-full mt-1 px-4 py-3 bg-[#FCFCFC] border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                            />

                            {/* Structure dropdown */}
                            {showStructureDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {[
                                  "Ditta individuale",
                                  "Società di persone",
                                  "Società a responsabilità limitata",
                                  "Società per Azioni",
                                ].map((structure, index) => (
                                  <div
                                    key={index}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-[1rem] font-normal text-accent border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        startupStructure: structure,
                                      });
                                      setShowStructureDropdown(false);
                                    }}
                                  >
                                    {structure}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Planned establishment date */}
                          <div>
                            <label className="text-[0.95rem] text-accent">
                              Quando prevedi di costituire l'azienda?
                            </label>
                            <input
                              type="text"
                              placeholder="Es. Dicembre 2025"
                              value={form.plannedEstablishmentDate || ""}
                              name="plannedEstablishmentDate"
                              onChange={handleInputChange}
                              className="w-full mt-1 px-4 py-3 bg-[#FCFCFC] border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                            />
                          </div>

                          {/* Keep AI suggestion stage input below if needed */}
                          <div className="mb-2">
                            <input
                              type="text"
                              placeholder="Descrizione o stadio dell'impresa (facoltativo)"
                              value={form.businessStage}
                              onChange={(e) =>
                                handleAISuggestionInputChange(
                                  e,
                                  "businessStage",
                                  "selectedBusinessStagesOptions",
                                )
                              }
                              name="businessStage"
                              onClick={() => setShowNewBusinessDropdown(true)}
                              onFocus={() => setShowNewBusinessDropdown(true)}
                              className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                            />

                            {/* Selected Options Display */}
                            {form.selectedBusinessStagesOptions &&
                              form.selectedBusinessStagesOptions.length > 0 && (
                                <div className="mt-3 hidden md:block">
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
                                                  (opt) => opt !== option,
                                                ) || [];

                                              // Simple approach: Remove the option from input field directly
                                              const currentInput =
                                                form.businessStage || "";

                                              // Remove the option from input - handle various comma scenarios
                                              const patterns = [
                                                new RegExp(
                                                  `, *${option.replace(
                                                    /[.*+?^${}()|[\]\\]/g,
                                                    "\\$&",
                                                  )} *,`,
                                                  "gi",
                                                ), // middle: ", option,"
                                                new RegExp(
                                                  `^${option.replace(
                                                    /[.*+?^${}()|[\]\\]/g,
                                                    "\\$&",
                                                  )} *, *`,
                                                  "gi",
                                                ), // start: "option, "
                                                new RegExp(
                                                  `, *${option.replace(
                                                    /[.*+?^${}()|[\]\\]/g,
                                                    "\\$&",
                                                  )} *$`,
                                                  "gi",
                                                ), // end: ", option"
                                                new RegExp(
                                                  `^${option.replace(
                                                    /[.*+?^${}()|[\]\\]/g,
                                                    "\\$&",
                                                  )} *$`,
                                                  "gi",
                                                ), // only: "option"
                                              ];

                                              let updatedInput = currentInput;
                                              // Apply patterns to remove the option
                                              patterns.forEach(
                                                (pattern, index) => {
                                                  if (index === 0) {
                                                    updatedInput =
                                                      updatedInput.replace(
                                                        pattern,
                                                        ", ",
                                                      ); // Replace middle with single comma
                                                  } else {
                                                    updatedInput =
                                                      updatedInput.replace(
                                                        pattern,
                                                        "",
                                                      ); // Remove start, end, or only
                                                  }
                                                },
                                              );

                                              // Clean up any double commas or leading/trailing commas
                                              updatedInput = updatedInput
                                                .replace(/,\s*,/g, ",")
                                                .replace(
                                                  /^\s*,\s*|\s*,\s*$/g,
                                                  "",
                                                )
                                                .trim();

                                              setForm({
                                                ...form,
                                                selectedBusinessStagesOptions:
                                                  newOptions,
                                                businessStage: updatedInput,
                                              });
                                            }}
                                            className="text-primary hover:text-primary/70"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ),
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
                                              suggestion,
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
                                                    suggestion,
                                                  );

                                                let newOptions;
                                                if (isAlreadySelected) {
                                                  // Remove if already selected
                                                  newOptions =
                                                    currentOptions.filter(
                                                      (opt) =>
                                                        opt !== suggestion,
                                                    );
                                                } else {
                                                  // Add if not selected
                                                  newOptions = [
                                                    ...currentOptions,
                                                    suggestion,
                                                  ];
                                                }

                                                // Simple approach: Remove the suggestion from input field directly
                                                const currentInput =
                                                  form.businessStage || "";
                                                let updatedInput = currentInput;

                                                if (isAlreadySelected) {
                                                  // Remove the suggestion from input - handle various comma scenarios
                                                  const patterns = [
                                                    new RegExp(
                                                      `, *${suggestion.replace(
                                                        /[.*+?^${}()|[\]\\]/g,
                                                        "\\$&",
                                                      )} *,`,
                                                      "gi",
                                                    ), // middle: ", suggestion,"
                                                    new RegExp(
                                                      `^${suggestion.replace(
                                                        /[.*+?^${}()|[\]\\]/g,
                                                        "\\$&",
                                                      )} *, *`,
                                                      "gi",
                                                    ), // start: "suggestion, "
                                                    new RegExp(
                                                      `, *${suggestion.replace(
                                                        /[.*+?^${}()|[\]\\]/g,
                                                        "\\$&",
                                                      )} *$`,
                                                      "gi",
                                                    ), // end: ", suggestion"
                                                    new RegExp(
                                                      `^${suggestion.replace(
                                                        /[.*+?^${}()|[\]\\]/g,
                                                        "\\$&",
                                                      )} *$`,
                                                      "gi",
                                                    ), // only: "suggestion"
                                                  ];

                                                  // Apply patterns to remove the suggestion
                                                  patterns.forEach(
                                                    (pattern, index) => {
                                                      if (index === 0) {
                                                        updatedInput =
                                                          updatedInput.replace(
                                                            pattern,
                                                            ", ",
                                                          ); // Replace middle with single comma
                                                      } else {
                                                        updatedInput =
                                                          updatedInput.replace(
                                                            pattern,
                                                            "",
                                                          ); // Remove start, end, or only
                                                      }
                                                    },
                                                  );

                                                  // Clean up any double commas or leading/trailing commas
                                                  updatedInput = updatedInput
                                                    .replace(/,\s*,/g, ",")
                                                    .replace(
                                                      /^\s*,\s*|\s*,\s*$/g,
                                                      "",
                                                    )
                                                    .trim();
                                                } else {
                                                  // Add the suggestion to input
                                                  if (updatedInput.trim()) {
                                                    updatedInput = `${updatedInput}, ${suggestion}`;
                                                  } else {
                                                    updatedInput = suggestion;
                                                  }
                                                }

                                                setForm({
                                                  ...form,
                                                  selectedBusinessStagesOptions:
                                                    newOptions,
                                                  businessStage: updatedInput,
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
                                        },
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
                                        stage,
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
                                              (opt) => opt !== stage,
                                            );
                                          } else {
                                            // Add if not selected
                                            newOptions = [
                                              ...currentOptions,
                                              stage,
                                            ];
                                          }

                                          // Simple approach: Remove the stage from input field directly
                                          const currentInput =
                                            form.businessStage || "";
                                          let updatedInput = currentInput;

                                          if (isAlreadySelected) {
                                            // Remove the stage from input - handle various comma scenarios
                                            const patterns = [
                                              new RegExp(
                                                `, *${stage.replace(
                                                  /[.*+?^${}()|[\]\\]/g,
                                                  "\\$&",
                                                )} *,`,
                                                "gi",
                                              ), // middle: ", stage,"
                                              new RegExp(
                                                `^${stage.replace(
                                                  /[.*+?^${}()|[\]\\]/g,
                                                  "\\$&",
                                                )} *, *`,
                                                "gi",
                                              ), // start: "stage, "
                                              new RegExp(
                                                `, *${stage.replace(
                                                  /[.*+?^${}()|[\]\\]/g,
                                                  "\\$&",
                                                )} *$`,
                                                "gi",
                                              ), // end: ", stage"
                                              new RegExp(
                                                `^${stage.replace(
                                                  /[.*+?^${}()|[\]\\]/g,
                                                  "\\$&",
                                                )} *$`,
                                                "gi",
                                              ), // only: "stage"
                                            ];

                                            // Apply patterns to remove the stage
                                            patterns.forEach(
                                              (pattern, index) => {
                                                if (index === 0) {
                                                  updatedInput =
                                                    updatedInput.replace(
                                                      pattern,
                                                      ", ",
                                                    ); // Replace middle with single comma
                                                } else {
                                                  updatedInput =
                                                    updatedInput.replace(
                                                      pattern,
                                                      "",
                                                    ); // Remove start, end, or only
                                                }
                                              },
                                            );

                                            // Clean up any double commas or leading/trailing commas
                                            updatedInput = updatedInput
                                              .replace(/,\s*,/g, ",")
                                              .replace(/^\s*,\s*|\s*,\s*$/g, "")
                                              .trim();
                                          } else {
                                            // Add the stage to input
                                            if (updatedInput.trim()) {
                                              updatedInput = `${updatedInput}, ${stage}`;
                                            } else {
                                              updatedInput = stage;
                                            }
                                          }

                                          setForm({
                                            ...form,
                                            selectedBusinessStagesOptions:
                                              newOptions,
                                            businessStage: updatedInput,
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
                                  },
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
                    Hai un sito web o presenza online? (Facoltativo)
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.website ? "border-red-500" : "border-[#888888]/50"
                    }`}
                    placeholder="Inserisci URL del sito web"
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>

                {/* Management Team */}
                <div>
                  <label className="question-text">
                    Il tuo team di gestione:
                  </label>
                  <div className="space-y-4 mt-4">
                    {form.teamMembers?.map((member, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-accent">
                            Membro del Team {index + 1}
                          </h4>
                          {form.teamMembers && form.teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Rimuovi
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm text-accent mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) =>
                                handleTeamMemberChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Nome completo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-accent mb-1">
                              Posizione:
                            </label>
                            <input
                              type="text"
                              value={member.position}
                              onChange={(e) =>
                                handleTeamMemberChange(
                                  index,
                                  "position",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Es. CEO, CTO, Responsabile Vendite"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-accent mb-1">
                              Background:
                            </label>
                            <input
                              type="text"
                              value={member.background}
                              onChange={(e) =>
                                handleTeamMemberChange(
                                  index,
                                  "background",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Esperienza e competenze"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="flex items-center gap-2 px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <span className="text-xl">+</span>
                      Aggiungi altro membro
                    </button>
                  </div>
                </div>

                {/* Language and Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Language */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label
                      htmlFor="sourceLanguage"
                      className="question-text min-w-[90px]"
                    >
                      Lingua:
                    </label>
                    <div className="w-full sm:max-w-[260px]">
                      {languages.length > 1 ? (
                        <select
                          id="sourceLanguage"
                          name="sourceLanguage"
                          value={form.sourceLanguage}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white text-accent border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-auto"
                        >
                          {languages.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="sourceLanguage"
                          readOnly
                          value={form.sourceLanguage}
                          className="w-full px-4 py-3 bg-white text-accent border border-[#888888]/50 rounded-lg focus:outline-none cursor-default"
                          aria-readonly="true"
                        />
                      )}
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label
                      htmlFor="targetLanguage"
                      className="question-text min-w-[90px]"
                    >
                      Valuta:
                    </label>
                    <div className="w-full sm:max-w-[260px]">
                      {currency.length > 1 ? (
                        <select
                          id="targetLanguage"
                          name="targetLanguage"
                          value={form.targetLanguage}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white text-accent border border-[#888888]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-auto"
                        >
                          {currency.map((currence) => (
                            <option key={currence} value={currence}>
                              {currence}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="targetLanguage"
                          readOnly
                          value={form.targetLanguage}
                          className="w-full px-4 py-3 bg-white text-accent border border-[#888888]/50 rounded-lg focus:outline-none cursor-default"
                          aria-readonly="true"
                        />
                      )}
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
