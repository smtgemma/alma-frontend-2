"use client";
//src/components/ai-smart-form/SmartFormContext.tsx
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
  businessType: string; // "existing" | "new"
  businessDocument: File | null;
  businessDocuments?: File[]; // Multiple PDF files (legacy)
  extractedContent?: string;
  location: string; // Town / City
  activity: string;
  totalEmployees: string;
  website: string;
  sourceLanguage: string; // e.g., "Italiano"
  targetLanguage: string; // e.g., "Euro"
  customBusinessStages?: string[];
  selectedBusinessStagesOptions?: string[];
  uploaded_file?: Array<{
    text_content: string;
    page_count: number;
    metadata: Record<string, any>;
    financial_data: any;
    document_type: string; // e.g., "balance_sheet" | "visura_camerale"
    file_name?: string; // Add file name for reference
  }>;
  // New fields for clearer separation of uploads and startup info
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
  startupStructure?: string; // Ditta individuale, SRL, etc.
  plannedEstablishmentDate?: string; // YYYY-MM-DD or free text
  // Extracted business identity fields from Visura Camerale
  extractedCompanyId?: string;
  extractedCompanyName?: string;
  extractedFounders?: string;
  extractedEstablishmentDate?: string;
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
  selectedProductCategoriesOptions: string[];
  selectedServiceCategoriesOptions: string[];
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
  selectedUniqueOptions: string[];
  selectedProblemOptions: string[];
  selectedValueAddOptions: string[];
  showUniqueOptions: boolean;
  showProblemOptions: boolean;
  showValueAddOptions: boolean;
  // Moved from Step 2
  companyOwnership?: string; // "Yes" | "No"
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
  selectedBusinessGoalsOptions: string[];
  selectedLongTermVisionOptions: string[];
  selectedMissionOptions: string[];
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
  selectedIndustryOptions: string[];
  selectedIdealClientOptions: string[];
  selectedClientType01Options: string[];
  selectedClientType02Options: string[];
  selectedClientType03Options: string[];
  selectedClientType04Options: string[];
  selectedMarketingPlanOptions: string[];
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
}

interface InvestmentPlanForm {
  initialInvestment: string;
  investmentItems: InvestmentItem[];
  // New fixed investment categories with amortization rates
  fixedInvestments?: Array<{
    key: string;
    label: string;
    amount: string; // numeric string in Euro
    amortizationRate: number; // percentage (e.g., 0.2 for 20%)
  }>;
}

interface ProductService {
  id: string;
  name: string;
  price: string;
  showOptions?: boolean;
  selectedOptions?: string[];
}

interface RevenueStream {
  id: string;
  name: string;
  description?: string;
  amount: string;
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
  // Revenue streams table
  revenueStreams?: RevenueStream[];
  growthPercent?: string; // expected growth for future years
  // New: customer payment collection breakdown
  immediateCollectionPercent?: string; // e.g., "50" for 50%
  collection60DaysPercent?: string; // e.g., "30"
  collection90DaysPercent?: string; // e.g., "20"
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

// Business plan API response interface
interface BusinessPlanApiResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    fundingSources?: {
      initialInvestment: number;
      fromHome: number;
      bankLoan: number;
      totalInvestment: number;
      fixedInvestments?: Array<{
        key: string;
        label: string;
        amortizationRate: number;
        category: string;
        amount: number;
        annualAmortization: number;
      }>;
    };
    user_input: {
      uploaded_file?: Array<{
        text_content: string;
        page_count: number;
        metadata: Record<string, any>;
        financial_data: any;
        document_type: string;
      }>;
      user_input: Array<{
        question: string;
        answer: string;
      }>;
      language: string;
      currency: string;
    };
    [key: string]: any;
  };
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
  loadBusinessPlanData: (apiResponse: BusinessPlanApiResponse) => void;
  resetFormData: () => void;
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
      errors.businessName = "Il nome dell'azienda è obbligatorio";
    }
    if (!data.businessType) {
      errors.businessType =
        "Seleziona il tipo di azienda (Esistente o Nuova Azienda)";
    }
    if (!data.location?.trim()) {
      errors.location = "La posizione è obbligatoria";
    }
    if (!data.activity?.trim()) {
      errors.activity = "L'attività aziendale è obbligatoria";
    }
    if (!data.totalEmployees?.trim()) {
      errors.totalEmployees = "Il totale dei dipendenti è obbligatorio";
    }
    return errors;
  },
  step2: (data: BusinessIdeaForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.businessStage) {
      errors.businessStage = "Seleziona la fase della tua azienda";
    }
    if (!data.productService) {
      errors.productService = "Seleziona prodotto o servizio";
    }
    if (
      data.productService === "Product" &&
      !data.selectedProductCategory?.trim()
    ) {
      errors.selectedProductCategory =
        "La categoria del prodotto è obbligatoria";
    }
    if (
      data.productService === "Service" &&
      !data.selectedServiceCategory?.trim()
    ) {
      errors.selectedServiceCategory =
        "La categoria del servizio è obbligatoria";
    }
    if (!data.deliveryMethod) {
      errors.deliveryMethod = "Il metodo di consegna è obbligatorio";
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
      errors.industry = "L'industria è obbligatoria";
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
    sourceLanguage: "Italiano",
    targetLanguage: "Euro",
    customBusinessStages: [],
    selectedBusinessStagesOptions: [],
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
    selectedProductCategoriesOptions: [],
    selectedServiceCategoriesOptions: [],
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
    selectedUniqueOptions: [],
    selectedProblemOptions: [],
    selectedValueAddOptions: [],
    showUniqueOptions: false,
    showProblemOptions: false,
    showValueAddOptions: false,
    companyOwnership: "",
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
    selectedBusinessGoalsOptions: [],
    selectedLongTermVisionOptions: [],
    selectedMissionOptions: [],
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
    selectedIndustryOptions: [],
    selectedIdealClientOptions: [],
    selectedClientType01Options: [],
    selectedClientType02Options: [],
    selectedClientType03Options: [],
    selectedClientType04Options: [],
    selectedMarketingPlanOptions: [],
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
    investmentItems: [
      {
        id: "1",
        description: "",
        amount: "",
      },
      {
        id: "2",
        description: "",
        amount: "",
      },
      {
        id: "3",
        description: "",
        amount: "",
      },
    ],
    fixedInvestments: [
      { key: "terreni", label: "Terreni", amount: "", amortizationRate: 0 },
      {
        key: "fabbricati",
        label: "Fabbricati (uso industriale), Capannoni, stabilimenti produttivi",
        amount: "",
        amortizationRate: 0.03,
      },
      {
        key: "impianti",
        label: "Impianti e macchinari, Attrezzature di produzione, macchine industriali",
        amount: "",
        amortizationRate: 0.1,
      },
      {
        key: "it",
        label: "Attrezzature elettroniche, Computer, server, periferiche",
        amount: "",
        amortizationRate: 0.2,
      },
      { key: "arredi", label: "Arredi e mobili d’ufficio", amount: "", amortizationRate: 0.12 },
      { key: "auto", label: "Autovetture Auto aziendali", amount: "", amortizationRate: 0.25 },
      {
        key: "veicoli",
        label: "Autocarri, furgoni, veicoli commerciali e industriali",
        amount: "",
        amortizationRate: 0.2,
      },
      {
        key: "software",
        label: "Licenze e Software gestionale, ERP, sistemi operativi",
        amount: "",
        amortizationRate: 0.2,
      },
      {
        key: "ip",
        label: "Brevetti, marchi, diritti di proprietà intellettuale",
        amount: "",
        amortizationRate: 0.2,
      },
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
    selectedExpectedRevenueOptions: [],
    selectedGrowthProjectionOptions: [],
    selectedBusinessShareOptions: [],
    selectedPricingLevelOptions: [],
    showExpectedRevenueOptions: false,
    showGrowthProjectionOptions: false,
    showBusinessShareOptions: false,
    showPricingLevelOptions: false,
    productServices: [
      { id: "1", name: "", price: "", showOptions: false, selectedOptions: [] },
      { id: "2", name: "", price: "", showOptions: false, selectedOptions: [] },
      { id: "3", name: "", price: "", showOptions: false, selectedOptions: [] },
      { id: "4", name: "", price: "", showOptions: false, selectedOptions: [] },
    ],
    revenueStreams: [
      { id: "1", name: "Prodotto/Servizio 1", description: "", amount: "" },
      { id: "2", name: "Prodotto/Servizio 2", description: "", amount: "" },
    ],
    growthPercent: "",
    immediateCollectionPercent: "",
    collection60DaysPercent: "",
    collection90DaysPercent: "",
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

// Function to map API response to form data structure
const mapBusinessPlanToFormData = (apiResponse: BusinessPlanApiResponse): Partial<SmartFormData> => {
  const { data } = apiResponse;
  const userInputs = data.user_input?.user_input || [];
  const uploadedFiles = data.user_input?.uploaded_file || [];
  
  // Helper function to find answer by question
  const findAnswer = (questionKeyword: string): string => {
    const input = userInputs.find(item => 
      item.question.toLowerCase().includes(questionKeyword.toLowerCase())
    );
    return input?.answer || "";
  };
  
  // Helper function to parse selected options from comma-separated string
  const parseSelectedOptions = (answer: string): string[] => {
    return answer ? answer.split(',').map(s => s.trim()).filter(s => s) : [];
  };
  
  // Helper function to parse fixed investments from answer string
  const parseFixedInvestments = (answer: string) => {
    const investments = getDefaultFormData().step6.fixedInvestments || [];
    if (!answer) return investments;
    
    const parts = answer.split(',');
    const updatedInvestments = [...investments];
    
    parts.forEach(part => {
      const [label, amountStr] = part.split(':');
      if (label && amountStr) {
        const cleanLabel = label.trim();
        const amount = amountStr.trim();
        const investmentIndex = updatedInvestments.findIndex(inv => 
          inv.label.toLowerCase().includes(cleanLabel.toLowerCase()) ||
          cleanLabel.toLowerCase().includes(inv.label.toLowerCase())
        );
        if (investmentIndex >= 0) {
          updatedInvestments[investmentIndex].amount = amount;
        }
      }
    });
    
    return updatedInvestments;
  };
  
  // Helper function to parse revenue streams
  const parseRevenueStreams = (answer: string): RevenueStream[] => {
    if (!answer) return getDefaultFormData().step7.revenueStreams || [];
    
    const parts = answer.split(',');
    const streams: RevenueStream[] = [];
    
    parts.forEach((part, index) => {
      const [name, amount] = part.split(':');
      if (name && amount) {
        streams.push({
          id: (index + 1).toString(),
          name: name.trim(),
          description: "",
          amount: amount.trim()
        });
      }
    });
    
    return streams.length > 0 ? streams : getDefaultFormData().step7.revenueStreams || [];
  };
  
  // Map the data
  const formData: Partial<SmartFormData> = {
    step1: {
      ...getDefaultFormData().step1,
      businessName: findAnswer("business name"),
      businessType: findAnswer("business type") === "existing" ? "existing" : "new",
      location: findAnswer("state") || findAnswer("city") || findAnswer("located"),
      activity: findAnswer("describe your activity") || findAnswer("activity"),
      totalEmployees: findAnswer("total employees") || findAnswer("employees"),
      website: findAnswer("website") || findAnswer("online presence"),
      businessStage: findAnswer("stage") || findAnswer("currently in"),
      sourceLanguage: data.user_input?.language || "Italiano",
      targetLanguage: data.user_input?.currency === "Euro" ? "Euro" : "Euro",
      // Map uploaded files
      balanceSheetExtractions: uploadedFiles.filter(f => f.document_type === "balance_sheet"),
      visuraCameraleExtractions: uploadedFiles.filter(f => f.document_type === "visura_camerale"),
    },
    step2: {
      ...getDefaultFormData().step2,
      businessStage: findAnswer("stage") || findAnswer("currently in"),
      productService: findAnswer("product or service") === "Product" ? "Product" : "Service",
      selectedProductCategory: findAnswer("product category"),
      selectedServiceCategory: findAnswer("service category"),
      deliveryMethod: findAnswer("deliver") || findAnswer("delivery"),
      selectedProductCategoriesOptions: parseSelectedOptions(findAnswer("ProductCategories selected")),
      selectedServiceCategoriesOptions: parseSelectedOptions(findAnswer("ServiceCategories selected")),
    },
    step3: {
      ...getDefaultFormData().step3,
      uniqueValue: findAnswer("unique") || findAnswer("makes your"),
      valueAddSupport: findAnswer("value add") || findAnswer("support"),
      selectedUniqueOptions: parseSelectedOptions(findAnswer("Unique selected")),
      selectedValueAddOptions: parseSelectedOptions(findAnswer("ValueAdd selected")),
      companyOwnership: findAnswer("own any inventions") || findAnswer("digital assets"),
    },
    step4: {
      ...getDefaultFormData().step4,
      businessGoals: findAnswer("business goals"),
      businessGoalsDescription: findAnswer("Business goals description"),
      mission: findAnswer("mission"),
      missionDescription: findAnswer("Mission description"),
      operationalArea: findAnswer("operational area") || findAnswer("primary operational"),
      selectedBusinessGoalsOptions: parseSelectedOptions(findAnswer("BusinessGoals selected")),
      selectedMissionOptions: parseSelectedOptions(findAnswer("Mission selected")),
    },
    step5: {
      ...getDefaultFormData().step5,
      industry: findAnswer("industry") || findAnswer("business belong"),
      idealClient: findAnswer("ideal client") || findAnswer("target customer"),
      marketingPlan: findAnswer("reach them") || findAnswer("marketing plan"),
      selectedIndustryOptions: parseSelectedOptions(findAnswer("Industry selected")),
      selectedIdealClientOptions: parseSelectedOptions(findAnswer("IdealClient selected")),
      selectedMarketingPlanOptions: parseSelectedOptions(findAnswer("MarketingPlan selected")),
    },
    step6: {
      ...getDefaultFormData().step6,
      initialInvestment: findAnswer("initial investment") || data.fundingSources?.initialInvestment?.toString() || "",
      fixedInvestments: data.fundingSources?.fixedInvestments?.map(inv => ({
        key: inv.key,
        label: inv.label,
        amount: inv.amount.toString(),
        amortizationRate: inv.amortizationRate
      })) || parseFixedInvestments(findAnswer("fixed investments")),
    },
    step7: {
      ...getDefaultFormData().step7,
      growthProjection: findAnswer("growth percentage") || findAnswer("expected growth"),
      growthPercent: findAnswer("growth percentage") || findAnswer("expected growth"),
      revenueStreams: parseRevenueStreams(findAnswer("revenue by product") || findAnswer("first-year revenue")),
      immediateCollectionPercent: findAnswer("immediate collection"),
      collection60DaysPercent: findAnswer("60 days"),
      collection90DaysPercent: findAnswer("90 days"),
    },
    step8: {
      ...getDefaultFormData().step8,
      firstYearTotalCost: findAnswer("total cost") || findAnswer("first year total cost"),
      firstYearNetProfit: findAnswer("net profit") || findAnswer("first year net profit"),
      netProfitMargin: findAnswer("profit margin") || findAnswer("net profit margin"),
    },
    step9: {
      ...getDefaultFormData().step9,
      yourOwnEquity: findAnswer("your own equity") || findAnswer("equity") || data.fundingSources?.fromHome?.toString() || "",
      bankingSystem: findAnswer("banking system") || findAnswer("bank loan") || data.fundingSources?.bankLoan?.toString() || "",
      otherInvestors: findAnswer("other investors") || "",
    },
  };
  
  return formData;
};

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
      // Avoid chatty console logs in production; update quietly
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
      setGeneratedPlanState(plan);
    },
    []
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

  const loadBusinessPlanData = useCallback((apiResponse: BusinessPlanApiResponse) => {
    console.log('📊 Loading business plan data:', apiResponse);
    const mappedData = mapBusinessPlanToFormData(apiResponse);
    
    setFormData(prevData => {
      const newData = { ...prevData };
      
      // Merge each step's data
      Object.entries(mappedData).forEach(([stepKey, stepData]) => {
        if (stepData && newData[stepKey as keyof SmartFormData]) {
          newData[stepKey as keyof SmartFormData] = {
            ...newData[stepKey as keyof SmartFormData],
            ...stepData
          } as any;
        }
      });
      
      console.log('✅ Form data updated with business plan data:', newData);
      return newData;
    });
    
    // Clear any existing errors
    setErrors({});
  }, []);

  const resetFormData = useCallback(() => {
    console.log('🔄 Resetting form data to defaults');
    setFormData(getDefaultFormData());
    setErrors({});
    setCurrentStep(0);
  }, []);

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
        loadBusinessPlanData,
        resetFormData,
      }}
    >
      {children}
    </SmartFormContext.Provider>
  );
};
