"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  aggregateFormData,
  AggregatedFormData,
  logAggregatedData,
} from "@/utils/formDataAggregator";

// Form data interfaces for all steps
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
  uploaded_file?: Array<{
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string;
  }>;
}

interface BusinessIdeaForm {
  businessStage: string;
  productService: string;
  selectedProductCategory: string;
  selectedServiceCategory: string;
  deliveryMethod: string;
  companyOwnership: string;
  businessGoals: string;
  customProductCategories: string[];
  customServiceCategories: string[];
}

interface ValueGenerationForm {
  uniqueValue: string;
  problemSolved: string;
  problemDescription: string;
  valueAddSupport: string;
  valueAddDescription: string;
  customUniqueOptions: string[];
  customProblemOptions: string[];
  customValueAddOptions: string[];
  showUniqueOptions: boolean;
  showProblemOptions: boolean;
  showValueAddOptions: boolean;
}

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
  showIndustryOptions: boolean;
  showIdealClientOptions: boolean;
  showClientType01Options: boolean;
  showClientType02Options: boolean;
  showClientType03Options: boolean;
  showClientType04Options: boolean;
  showMarketingPlanOptions: boolean;
}

interface InvestmentItem {
  id: string;
  description: string;
  amount: string;
  showOptions?: boolean;
}

interface InvestmentPlanForm {
  initialInvestment: string;
  customInitialInvestment: string[];
  showInitialInvestmentOptions: boolean;
  investmentItems: InvestmentItem[];
}

interface ProductService {
  id: string;
  name: string;
  price: string;
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
  showExpectedRevenueOptions: boolean;
  showGrowthProjectionOptions: boolean;
  showBusinessShareOptions: boolean;
  showPricingLevelOptions: boolean;
  productServices: ProductService[];
}

interface OperatingCostItem {
  id: string;
  name: string;
  percentage: string;
  totalCost: string;
}

interface OperatingCostForm {
  operatingCosts: string;
  operatingCostItems: OperatingCostItem[];
  firstYearTotalCost: string;
  firstYearNetProfit: string;
  netProfitMargin: string;
}

interface FinancialPlanForm {
  yourOwnEquity: string;
  bankingSystem: string;
  otherInvestors: string;
}

// Validation error interface
interface ValidationErrors {
  [key: string]: string;
}

// Complete form data interface
export interface SmartFormData {
  step1: BusinessInfoForm;
  step2: BusinessIdeaForm;
  step3: ValueGenerationForm;
  step4: BusinessGoalVisionForm;
  step5: IndustryMarketForm;
  step6: InvestmentPlanForm;
  step7: RevenueModelForm;
  step8: OperatingCostForm;
  step9: FinancialPlanForm;
  step10: {}; // Review Plan - no form data
}

type StepContextType = {
  currentStep: number;
  formData: SmartFormData;
  errors: ValidationErrors;
  generatedPlan: {
    content: string;
    planId?: string;
    generatedAt?: string;
  } | null;
  isGeneratingPlan: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateFormData: <T extends keyof SmartFormData>(
    step: T,
    data: Partial<SmartFormData[T]>
  ) => void;
  getFormData: <T extends keyof SmartFormData>(step: T) => SmartFormData[T];
  validateStep: (step: number) => boolean;
  clearErrors: () => void;
  setFieldError: (field: string, error: string) => void;
  setGeneratedPlan: (
    plan: { content: string; planId?: string; generatedAt?: string } | null
  ) => void;
  setIsGeneratingPlan: (isGenerating: boolean) => void;
  getAggregatedData: () => AggregatedFormData;
  logFormData: () => void;
  exportFormDataAsJSON: () => string;
};

const SmartFormContext = createContext<StepContextType | undefined>(undefined);

export const useSmartForm = () => {
  const context = useContext(SmartFormContext);
  if (!context)
    throw new Error("useSmartForm must be used inside SmartFormProvider");
  return context;
};

// Pass maxSteps here or calculate it dynamically
const TOTAL_STEPS = 13; // Update this if you add/remove steps

// Validation rules for each step - only for fields marked as (required)
const validationRules = {
  step1: (data: BusinessInfoForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.businessName?.trim()) {
      errors.businessName = "Business name is required";
    }
    if (!data.businessType) {
      errors.businessType =
        "Please select business type (Existing or New Business)";
    }
    if (!data.location?.trim()) {
      errors.location = "Location is required";
    }
    if (!data.activity?.trim()) {
      errors.activity = "Business activity is required";
    }
    if (!data.totalEmployees?.trim()) {
      errors.totalEmployees = "Total employees is required";
    }
    if (!data.website?.trim()) {
      errors.website = "Website is required";
    }
    return errors;
  },
  step2: (data: BusinessIdeaForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.businessStage) {
      errors.businessStage = "Please select your business stage";
    }
    if (!data.productService) {
      errors.productService = "Please select product or service";
    }
    if (
      data.productService === "Product" &&
      !data.selectedProductCategory?.trim()
    ) {
      errors.selectedProductCategory = "Product category is required";
    }
    if (
      data.productService === "Service" &&
      !data.selectedServiceCategory?.trim()
    ) {
      errors.selectedServiceCategory = "Service category is required";
    }
    if (!data.deliveryMethod) {
      errors.deliveryMethod = "Delivery method is required";
    }
    return errors;
  },
  step3: (data: ValueGenerationForm): ValidationErrors => {
    // No required fields in step 3 based on labels
    return {};
  },
  step4: (data: BusinessGoalVisionForm): ValidationErrors => {
    // No required fields in step 4 based on labels
    return {};
  },
  step5: (data: IndustryMarketForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.industry?.trim()) {
      errors.industry = "Industry is required";
    }
    return errors;
  },
  step6: (data: InvestmentPlanForm): ValidationErrors => {
    // No required fields in step 6 based on labels
    return {};
  },
  step7: (data: RevenueModelForm): ValidationErrors => {
    // No required fields in step 7 based on labels
    return {};
  },
  step8: (data: OperatingCostForm): ValidationErrors => {
    // No required fields in step 8 based on labels
    return {};
  },
  step9: (data: FinancialPlanForm): ValidationErrors => {
    // No required fields in step 9 based on labels
    return {};
  },
  step10: (data: any): ValidationErrors => {
    // Step 10 is review step, no validation needed
    return {};
  },
};

// Default form data
const getDefaultFormData = (): SmartFormData => ({
  step1: {
    businessName: "",
    businessStage: "",
    businessType: "",
    businessDocument: null,
    extractedContent: "",
    location: "",
    activity: "",
    totalEmployees: "",
    website: "",
    sourceLanguage: "English",
    targetLanguage: "English",
    customBusinessStages: [],
  },
  step2: {
    businessStage: "",
    productService: "",
    selectedProductCategory: "",
    selectedServiceCategory: "",
    deliveryMethod: "",
    companyOwnership: "",
    businessGoals: "",
    customProductCategories: [],
    customServiceCategories: [],
  },
  step3: {
    uniqueValue: "",
    problemSolved: "",
    problemDescription: "",
    valueAddSupport: "",
    valueAddDescription: "",
    customUniqueOptions: [],
    customProblemOptions: [],
    customValueAddOptions: [],
    showUniqueOptions: false,
    showProblemOptions: false,
    showValueAddOptions: false,
  },
  step4: {
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
  },
  step5: {
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
    showIndustryOptions: false,
    showIdealClientOptions: false,
    showClientType01Options: false,
    showClientType02Options: false,
    showClientType03Options: false,
    showClientType04Options: false,
    showMarketingPlanOptions: false,
  },
  step6: {
    initialInvestment: "",
    customInitialInvestment: [],
    showInitialInvestmentOptions: false,
    investmentItems: [
      { id: "1", description: "", amount: "", showOptions: false },
      { id: "2", description: "", amount: "", showOptions: false },
      { id: "3", description: "", amount: "", showOptions: false },
    ],
  },
  step7: {
    expectedRevenue: "",
    growthProjection: "",
    businessShare: "",
    pricingLevel: "",
    customExpectedRevenue: [],
    customGrowthProjection: [],
    customBusinessShare: [],
    customPricingLevel: [],
    showExpectedRevenueOptions: false,
    showGrowthProjectionOptions: false,
    showBusinessShareOptions: false,
    showPricingLevelOptions: false,
    productServices: [
      { id: "1", name: "", price: "" },
      { id: "2", name: "", price: "" },
      { id: "3", name: "", price: "" },
      { id: "4", name: "", price: "" },
    ],
  },
  step8: {
    operatingCosts: "",
    operatingCostItems: [
      {
        id: "1",
        name: "Marketing and advertising expenses",
        percentage: "50%",
        totalCost: "€50,000",
      },
      {
        id: "2",
        name: "Employee salaries and wages",
        percentage: "30%",
        totalCost: "€30,000",
      },
      { id: "3", name: "Rent", percentage: "50%", totalCost: "€50,000" },
      {
        id: "4",
        name: "General administrations",
        percentage: "30%",
        totalCost: "€30,000",
      },
      { id: "5", name: "Accounting", percentage: "50%", totalCost: "€50,000" },
      {
        id: "6",
        name: "Other expenses",
        percentage: "30%",
        totalCost: "€30,000",
      },
      { id: "7", name: "Income tax", percentage: "50%", totalCost: "€50,000" },
      {
        id: "8",
        name: "Interest expenses",
        percentage: "30%",
        totalCost: "€30,000",
      },
      {
        id: "9",
        name: "Other expenses",
        percentage: "50%",
        totalCost: "€50,000",
      },
    ],
    firstYearTotalCost: "€90,000",
    firstYearNetProfit: "€90,000",
    netProfitMargin: "38%",
  },
  step9: {
    yourOwnEquity: "",
    bankingSystem: "",
    otherInvestors: "",
  },
  step10: {},
});

export const SmartFormProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SmartFormData>(getDefaultFormData());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generatedPlan, setGeneratedPlanState] = useState<{
    content: string;
    planId?: string;
    generatedAt?: string;
  } | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const validateStep = useCallback(
    (step: number): boolean => {
      const stepKey = `step${step + 1}` as keyof SmartFormData;
      const stepData = formData[stepKey];
      const validator =
        validationRules[stepKey as keyof typeof validationRules];

      if (validator) {
        const stepErrors = validator(stepData as any);
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
      }

      return true;
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    setErrors({}); // Clear errors when moving to next step
  }, []);

  const prevStep = useCallback(
    () => setCurrentStep((prev) => Math.max(prev - 1, 0)),
    []
  );

  const goToStep = useCallback(
    (step: number) =>
      setCurrentStep(Math.max(0, Math.min(step, TOTAL_STEPS - 1))),
    []
  );

  const updateFormData = useCallback(
    <T extends keyof SmartFormData>(
      step: T,
      data: Partial<SmartFormData[T]>
    ) => {
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          ...data,
        },
      }));
    },
    []
  );

  const getFormData = useCallback(
    <T extends keyof SmartFormData>(step: T): SmartFormData[T] => {
      return formData[step];
    },
    [formData]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const setGeneratedPlan = useCallback(
    (
      plan: { content: string; planId?: string; generatedAt?: string } | null
    ) => {
      console.log("=== SET GENERATED PLAN CALLED ===");
      console.log("Plan to be set:", plan);
      console.log("Plan content:", plan?.content);
      console.log("Plan content length:", plan?.content?.length);
      console.log("Plan content type:", typeof plan?.content);
      console.log(
        "Plan content is empty?",
        !plan?.content || plan?.content.trim() === ""
      );

      setGeneratedPlanState(plan);

      // Add a callback to verify the state was updated
      setTimeout(() => {
        console.log("=== STATE UPDATE VERIFICATION ===");
        console.log("Current generatedPlan state after update:", generatedPlan);
      }, 200);
    },
    [generatedPlan]
  );

  // Aggregation methods
  const getAggregatedData = useCallback((): AggregatedFormData => {
    return aggregateFormData(formData);
  }, [formData]);

  const logFormData = useCallback(() => {
    const aggregated = aggregateFormData(formData);
    logAggregatedData(aggregated);
  }, [formData]);

  const exportFormDataAsJSON = useCallback((): string => {
    const aggregated = aggregateFormData(formData);
    return JSON.stringify(aggregated, null, 2);
  }, [formData]);

  return (
    <SmartFormContext.Provider
      value={{
        currentStep,
        formData,
        errors,
        generatedPlan,
        isGeneratingPlan,
        nextStep,
        prevStep,
        goToStep,
        updateFormData,
        getFormData,
        validateStep,
        clearErrors,
        setFieldError,
        setGeneratedPlan,
        setIsGeneratingPlan,
        getAggregatedData,
        logFormData,
        exportFormDataAsJSON,
      }}
    >
      {children}
    </SmartFormContext.Provider>
  );
};
