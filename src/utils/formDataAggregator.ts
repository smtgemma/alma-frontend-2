import { SmartFormData } from "@/components/ai-smart-form/SmartFormContext";

// Interface for the final aggregated data format
export interface AggregatedFormData {
  uploaded_file: {
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
  }[];
  user_input: Array<{
    question: string;
    answer: string;
  }>;
  language?: string;
  currency?: string;
}

// Question mappings for each step - based on the form labels in your components
const stepQuestions: Record<string, Record<string, string>> = {
  step1: {
    businessName: "What is your business name?",
    businessStage: "Is this an existing or an upcoming business?",
    businessType: "Business type selection",
    location: "In what State / City will the business be located?",
    activity: "Describe your activity?",
    totalEmployees: "Total employees",
    website: "Do you have a website or online presence?",
    sourceLanguage: "Source plan language",
    targetLanguage: "Target plan Currency",
    selectedBusinessStagesOptions: "Selected business stages options",
  },
  step2: {
    businessStage: "What stage is your business currently in?",
    productService: "Do you offer a product or a service?",
    selectedProductCategory: "Product category",
    selectedServiceCategory: "Service category",
    deliveryMethod: "How do you deliver your product?",
    companyOwnership:
      "Will the company own any inventions, digital assets, discoveries, trade secrets or similar?",
    businessGoals: "What goals do you pursue with this business plan",
    selectedProductCategoriesOptions: "Selected product categories options",
    selectedServiceCategoriesOptions: "Selected service categories options",
  },
  step3: {
    uniqueValue: "What makes your product/service unique?",
    problemSolved: "What problem does your product or service solve?",
    problemDescription: "Problem description",
    valueAddSupport: "Do you offer any other value support or guarantees?",
    valueAddDescription: "Value add description",
    selectedUniqueOptions: "Selected unique value options",
    selectedProblemOptions: "Selected problem solving options",
    selectedValueAddOptions: "Selected value-add support options",
  },
  step4: {
    businessGoals: "What is your business aiming to achieve?",
    businessGoalsDescription: "Business goals description",
    longTermVision: "What's your long-term vision?",
    longTermVisionDescription: "Long-term vision description",
    mission: "How would you describe your mission in one line?",
    missionDescription: "Mission description",
    operationalArea:
      "What will be the primary operational area for the business?",
    selectedBusinessGoalsOptions: "Selected business goals options",
    selectedLongTermVisionOptions: "Selected long-term vision options",
    selectedMissionOptions: "Selected mission options",
  },
  step5: {
    industry: "Which industry does your business belong to?",
    idealClient: "Who is your ideal client?",
    clientType01: "Client type 01",
    clientType02: "Client type 02",
    clientType03: "Client type 03",
    clientType04: "Client type 04",
    marketingPlan: "How do you plan to reach them (marketing plan advice)?",
    selectedIndustryOptions: "Selected industry options",
    selectedIdealClientOptions: "Selected ideal client options",
    selectedClientType01Options: "Selected client type 01 options",
    selectedClientType02Options: "Selected client type 02 options",
    selectedClientType03Options: "Selected client type 03 options",
    selectedClientType04Options: "Selected client type 04 options",
    selectedMarketingPlanOptions: "Selected marketing plan options",
  },
  step6: {
    initialInvestment: "Initial Investment",
    investmentItems: "Investment breakdown items",
    selectedInitialInvestmentOptions: "Selected initial investment options",
  },
  step7: {
    expectedRevenue: "Expected Revenue",
    growthProjection: "Growth Projection",
    businessShare: "Business Share",
    pricingLevel: "Pricing Level",
    productServices: "Products/Services pricing",
    selectedExpectedRevenueOptions: "Selected expected revenue options",
    selectedGrowthProjectionOptions: "Selected growth projection options",
    selectedBusinessShareOptions: "Selected business share options",
    selectedPricingLevelOptions: "Selected pricing level options",
  },
  step8: {
    operatingCosts: "Operating Costs",
    operatingCostItems: "Operating cost breakdown",
    firstYearTotalCost: "First Year Total Cost",
    firstYearNetProfit: "First Year Net Profit",
    netProfitMargin: "Net Profit Margin",
  },
  step9: {
    yourOwnEquity: "Your Own Equity",
    bankingSystem: "Banking System",
    otherInvestors: "Other Investors",
  },
};

/**
 * Converts form data into the required aggregated format
 * @param formData - The complete form data from SmartFormContext
 * @returns AggregatedFormData in the required format
 */
export function aggregateFormData(formData: SmartFormData): AggregatedFormData {
  console.log("🚀 Starting form data aggregation...");
  console.log("📋 Raw form data:", formData);

  const aggregated: AggregatedFormData = {
    uploaded_file: [],
    user_input: [],
    language: formData.step1?.sourceLanguage || undefined,
    currency: formData.step1?.targetLanguage || undefined,
  };

  // Process uploaded files from step1
  if (
    formData.step1.uploaded_file &&
    Array.isArray(formData.step1.uploaded_file)
  ) {
    aggregated.uploaded_file = formData.step1.uploaded_file.map((file) => ({
      text_content: file.text_content || "",
      page_count: file.page_count || 1,
      metadata: file.metadata || {},
      financial_data: file.financial_data || null,
      document_type: file.document_type || "company_extract",
    }));
  }

  // Process all form inputs across steps
  console.log("📝 Processing form steps...");
  Object.entries(formData).forEach(([stepKey, stepData]) => {
    console.log(`\n🔍 Processing ${stepKey}:`, stepData);
    const questions = stepQuestions[stepKey];
    if (!questions || !stepData) {
      console.log(`⚠️ Skipping ${stepKey} - no questions or data`);
      return;
    }

    Object.entries(stepData).forEach(([fieldKey, fieldValue]) => {
      console.log(`  📌 Field: ${fieldKey} =`, fieldValue);
      // Skip certain fields that shouldn't be in user_input
      if (
        fieldKey === "uploaded_file" ||
        fieldKey === "businessDocument" ||
        fieldKey === "extractedContent" ||
        fieldKey === "sourceLanguage" ||
        fieldKey === "targetLanguage" ||
        fieldKey.startsWith("custom") ||
        fieldKey.startsWith("show") ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      ) {
        return;
      }

      // Handle selected options arrays specially
      if (fieldKey.startsWith("selected") && fieldKey.endsWith("Options")) {
        console.log(`    ✅ Processing selected options: ${fieldKey}`);
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
          const baseQuestionKey = fieldKey
            .replace("selected", "")
            .replace("Options", "");
          const question =
            questions[baseQuestionKey] || `${baseQuestionKey} selected options`;
          console.log(
            `    📝 Adding to user_input: ${question} = ${fieldValue.join(
              ", "
            )}`
          );
          aggregated.user_input.push({
            question,
            answer: fieldValue.join(", "),
          });
        } else {
          console.log(`    ⚠️ Skipping ${fieldKey} - empty array`);
        }
        return;
      }

      // Get the question text
      const question = questions[fieldKey];
      if (!question) return;

      // Format the answer based on field type
      let answer = "";

      if (typeof fieldValue === "string" && fieldValue.trim()) {
        answer = fieldValue;
      } else if (typeof fieldValue === "number") {
        answer = fieldValue.toString();
      } else if (Array.isArray(fieldValue)) {
        // Handle arrays (like investment items, product services, etc.)
        if (fieldKey === "investmentItems") {
          answer = fieldValue
            .filter((item) => item.description || item.amount)
            .map((item) => `${item.description}: ${item.amount}`)
            .join(", ");
        } else if (fieldKey === "productServices") {
          answer = fieldValue
            .filter((item) => item.name || item.price)
            .map((item) => `${item.name}: ${item.price}`)
            .join(", ");
        } else if (fieldKey === "operatingCostItems") {
          answer = fieldValue
            .filter((item) => item.name || item.totalCost)
            .map(
              (item) => `${item.name}: ${item.totalCost} (${item.percentage})`
            )
            .join(", ");
        } else if (fieldKey === "businessGoals") {
          // businessGoals is a string, not an array
          answer =
            typeof fieldValue === "string" ? fieldValue : fieldValue.join(", ");
        } else {
          answer = fieldValue.join(", ");
        }
      } else if (typeof fieldValue === "object" && fieldValue !== null) {
        // Handle objects by converting to string representation
        answer = JSON.stringify(fieldValue);
      }

      // Only add if answer has content
      if (answer && answer.trim()) {
        console.log(
          `    📝 Adding to user_input: ${question} = ${answer.trim()}`
        );
        aggregated.user_input.push({
          question,
          answer: answer.trim(),
        });
      } else {
        console.log(`    ⚠️ Skipping ${fieldKey} - empty answer`);
      }
    });
  });

  console.log("\n🎉 Aggregation complete!");
  console.log("📊 Final aggregated data:", aggregated);
  console.log("📈 Total user inputs:", aggregated.user_input.length);
  console.log("📁 Total uploaded files:", aggregated.uploaded_file.length);

  return aggregated;
}

/**
 * Gets a summary of the aggregated data
 * @param aggregatedData - The aggregated form data
 * @returns Summary object with counts and basic info
 */
export function getDataSummary(aggregatedData: AggregatedFormData) {
  return {
    totalUploadedFiles: aggregatedData.uploaded_file.length,
    totalUserInputs: aggregatedData.user_input.length,
    hasFiles: aggregatedData.uploaded_file.length > 0,
    businessName:
      aggregatedData.user_input.find((input) =>
        input.question.includes("business name")
      )?.answer || "",
    totalDataPoints:
      aggregatedData.uploaded_file.length + aggregatedData.user_input.length,
  };
}

/**
 * Validates the aggregated data
 * @param aggregatedData - The aggregated form data
 * @returns Validation result with any issues found
 */
export function validateAggregatedData(aggregatedData: AggregatedFormData) {
  const issues: string[] = [];

  // Check if we have any data at all
  if (
    aggregatedData.uploaded_file.length === 0 &&
    aggregatedData.user_input.length === 0
  ) {
    issues.push("No data found to aggregate");
  }

  // Check uploaded files validity
  aggregatedData.uploaded_file.forEach((file, index) => {
    if (!file.text_content || file.text_content.trim() === "") {
      issues.push(`Uploaded file ${index + 1} has no text content`);
    }
    if (!file.document_type) {
      issues.push(`Uploaded file ${index + 1} has no document type`);
    }
  });

  // Check user inputs validity
  aggregatedData.user_input.forEach((input, index) => {
    if (!input.question || input.question.trim() === "") {
      issues.push(`User input ${index + 1} has no question`);
    }
    if (!input.answer || input.answer.trim() === "") {
      issues.push(`User input ${index + 1} has no answer`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Exports the aggregated data to JSON format
 * @param aggregatedData - The aggregated form data
 * @returns JSON string of the aggregated data
 */
export function exportToJSON(aggregatedData: AggregatedFormData): string {
  return JSON.stringify(aggregatedData, null, 2);
}

/**
 * Logs the aggregated data in a readable format for debugging
 * @param aggregatedData - The aggregated form data
 */
export function logAggregatedData(aggregatedData: AggregatedFormData) {
  console.group("📊 Aggregated Form Data");

  console.log("📁 Uploaded Files:", aggregatedData.uploaded_file.length);
  aggregatedData.uploaded_file.forEach((file, index) => {
    console.log(`  File ${index + 1}:`, {
      type: file.document_type,
      contentLength: file.text_content?.length || 0,
      pageCount: file.page_count,
      hasMetadata: Object.keys(file.metadata || {}).length > 0,
    });
  });

  console.log("📝 User Inputs:", aggregatedData.user_input.length);
  aggregatedData.user_input.forEach((input, index) => {
    console.log(`  ${index + 1}. ${input.question}`);
    console.log(
      `     Answer: ${input.answer.substring(0, 100)}${
        input.answer.length > 100 ? "..." : ""
      }`
    );
  });

  const summary = getDataSummary(aggregatedData);
  console.log("📈 Summary:", summary);

  const validation = validateAggregatedData(aggregatedData);
  console.log("✅ Validation:", validation);

  console.groupEnd();
}
