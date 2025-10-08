"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
import { toggleSuggestionInInput } from "./utils/aiSuggestionUtils";
import { formatEuro, parseEuro } from "@/utils/euFormat";
//
function sanitizePercentInput(raw: string): string {
  // allow only digits and , .; keep as string in input
  return (raw || "").replace(/[^0-9.,]/g, "");
}
function percentToNumber(s: string | undefined): number {
  if (!s) return 0;
  const cleaned = s.replace(/,/g, ".");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function extractPercentFromText(text: string): string {
  if (!text) return "";
  // Try range like 15-25%
  const range = text.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)/);
  if (range) {
    const a = parseFloat(range[1].replace(/,/g, "."));
    const b = parseFloat(range[2].replace(/,/g, "."));
    if (!isNaN(a) && !isNaN(b)) {
      const avg = (a + b) / 2;
      return String(Math.min(100, Math.max(0, Number(avg.toFixed(2)))));
    }
  }
  // Fallback: first number in string
  const single = text.match(/(\d+(?:[.,]\d+)?)/);
  if (single) {
    const v = parseFloat(single[1].replace(/,/g, "."));
    if (!isNaN(v)) return String(Math.min(100, Math.max(0, Number(v.toFixed(2)))));
  }
  return "";
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
  growthPercent?: string;
  // New: customer payment collection breakdown
  immediateCollectionPercent?: string;
  collection60DaysPercent?: string;
  collection90DaysPercent?: string;
}

export default function S7RevenueModelPricing() {
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
  const [expectedRevenueAiSuggestions, setExpectedRevenueAiSuggestions] =
    useState<string[]>([]);
  const [growthProjectionAiSuggestions, setGrowthProjectionAiSuggestions] =
    useState<string[]>([]);
  const [businessShareAiSuggestions, setBusinessShareAiSuggestions] = useState<
    string[]
  >([]);
  const [pricingLevelAiSuggestions, setPricingLevelAiSuggestions] = useState<
    string[]
  >([]);

  // Loading states
  const [
    isLoadingExpectedRevenueSuggestions,
    setIsLoadingExpectedRevenueSuggestions,
  ] = useState(false);
  const [
    isLoadingGrowthProjectionSuggestions,
    setIsLoadingGrowthProjectionSuggestions,
  ] = useState(false);
  const [
    isLoadingBusinessShareSuggestions,
    setIsLoadingBusinessShareSuggestions,
  ] = useState(false);
  const [
    isLoadingPricingLevelSuggestions,
    setIsLoadingPricingLevelSuggestions,
  ] = useState(false);

  // Refs for dropdown containers
  const expectedRevenueDropdownRef = useRef<HTMLDivElement>(null);
  const growthProjectionDropdownRef = useRef<HTMLDivElement>(null);
  const businessShareDropdownRef = useRef<HTMLDivElement>(null);
  const pricingLevelDropdownRef = useRef<HTMLDivElement>(null);

  const persistedData = getFormData("step7");

  const [form, setForm] = useState<RevenueModelForm>(
    persistedData || {
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
        {
          id: "1",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "2",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "3",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
        {
          id: "4",
          name: "",
          price: "",
          showOptions: false,
          selectedOptions: [],
        },
      ],
      revenueStreams: [
        { id: "1", name: "Prodotto/Servizio 1", description: "", amount: "" },
        { id: "2", name: "Prodotto/Servizio 2", description: "", amount: "" },
      ],
      growthPercent: "",
      immediateCollectionPercent: "",
      collection60DaysPercent: "",
      collection90DaysPercent: "",
    }
  );

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step7", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for expected revenue
  const fetchExpectedRevenueAISuggestions = async () => {
    setIsLoadingExpectedRevenueSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What are the expected revenues on the first year?",
        context: "business revenue projections and financial forecasts",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setExpectedRevenueAiSuggestions(response.suggestions);
      } else {
        setExpectedRevenueAiSuggestions([
          "Under €50,000",
          "€50,000 - €150,000",
          "€150,000 - €500,000",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI expected revenue suggestions:", error);
      setExpectedRevenueAiSuggestions([
        "Under €50,000",
        "€50,000 - €150,000",
        "€150,000 - €500,000",
      ]);
    } finally {
      setIsLoadingExpectedRevenueSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for growth projection
  const fetchGrowthProjectionAISuggestions = async () => {
    setIsLoadingGrowthProjectionSuggestions(true);

    try {
      const response = await getAISuggestions({
        question:
          "What percentage of growing do you expect from the second year?",
        context: "business growth projections and expansion rates",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setGrowthProjectionAiSuggestions(response.suggestions);
      } else {
        setGrowthProjectionAiSuggestions([
          "Under €50.000",
          "€150.000",
          "€250.000",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI growth projection suggestions:", error);
      setGrowthProjectionAiSuggestions([
        "Under €50.000",
        "€150.000",
        "€250.000",
      ]);
    } finally {
      setIsLoadingGrowthProjectionSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for business share
  const fetchBusinessShareAISuggestions = async () => {
    setIsLoadingBusinessShareSuggestions(true);

    try {
      const response = await getAISuggestions({
        question:
          "What percentage of business share will come from each group of product services?",
        context: "business revenue distribution and product service allocation",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setBusinessShareAiSuggestions(response.suggestions);
      } else {
        setBusinessShareAiSuggestions([
          "25% - 30%",
          "30% - 40%",
          "40% - 50%",
          "50% - 60%",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI business share suggestions:", error);
      setBusinessShareAiSuggestions([
        "25% - 30%",
        "30% - 40%",
        "40% - 50%",
        "50% - 60%",
      ]);
    } finally {
      setIsLoadingBusinessShareSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for pricing level
  const fetchPricingLevelAISuggestions = async () => {
    setIsLoadingPricingLevelSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What is the expected pricing level?",
        context: "pricing strategies and market positioning",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setPricingLevelAiSuggestions(response.suggestions);
      } else {
        setPricingLevelAiSuggestions([
          "Premium Pricing (High-end market)",
          "Competitive Pricing (Market average)",
          "Penetration Pricing (Below market)",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI pricing level suggestions:", error);
      setPricingLevelAiSuggestions([
        "Premium Pricing (High-end market)",
        "Competitive Pricing (Market average)",
        "Penetration Pricing (Below market)",
      ]);
    } finally {
      setIsLoadingPricingLevelSuggestions(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        expectedRevenueDropdownRef.current &&
        !expectedRevenueDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showExpectedRevenueOptions: false }));
      }
      if (
        growthProjectionDropdownRef.current &&
        !growthProjectionDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showGrowthProjectionOptions: false }));
      }
      if (
        businessShareDropdownRef.current &&
        !businessShareDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showBusinessShareOptions: false }));
      }
      if (
        pricingLevelDropdownRef.current &&
        !pricingLevelDropdownRef.current.contains(target)
      ) {
        setForm((prev) => ({ ...prev, showPricingLevelOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof RevenueModelForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePercentChange = (field: keyof RevenueModelForm, value: string) => {
    const sanitized = sanitizePercentInput(value);
    setForm((prev) => ({ ...prev, [field]: sanitized }));
  };

  // Revenue Streams helpers
  const addRevenueStream = () => {
    setForm((prev) => ({
      ...prev,
      revenueStreams: [
        ...(prev.revenueStreams || []),
        { id: String((prev.revenueStreams?.length || 0) + 1), name: "", description: "", amount: "" },
      ],
    }));
  };

  const normalizeRevenueStreams = () => {
    return (form.revenueStreams || []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      amount: parseEuro(row.amount || ""),
    }));
  };

  const updateRevenueStream = (id: string, field: keyof RevenueStream, value: string) => {
    setForm((prev) => ({
      ...prev,
      revenueStreams: (prev.revenueStreams || []).map((row) =>
        row.id === id ? { ...row, [field]: value } as RevenueStream : row
      ),
    }));
  };

  const totalRevenueStreams = () => {
    const list = form.revenueStreams || [];
    return list.reduce((sum, row) => sum + (parseEuro(row.amount || "") || 0), 0);
  };

  const paymentPercents = () => ({
    immediate: percentToNumber(form.immediateCollectionPercent),
    days60: percentToNumber(form.collection60DaysPercent),
    days90: percentToNumber(form.collection90DaysPercent),
  });

  const paymentAmounts = () => {
    const total = totalRevenueStreams();
    const p = paymentPercents();
    return {
      immediate: (total * p.immediate) / 100,
      days60: (total * p.days60) / 100,
      days90: (total * p.days90) / 100,
      percentSum: p.immediate + p.days60 + p.days90,
    };
  };

  const growthForecast = (years = 5) => {
    const total = totalRevenueStreams();
    const g = percentToNumber(form.growthPercent);
    const rate = 1 + g / 100;
    const values: number[] = [];
    let current = total;
    for (let i = 0; i < years; i++) {
      if (i === 0) values.push(total);
      else {
        current = current * rate;
        values.push(current);
      }
    }
    return values;
  };

  // Option selection handlers for multiple selection
  const handleExpectedRevenueOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedExpectedRevenueOptions;
      const isSelected = currentOptions.includes(option);
      
      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }
      
      // Update input field using utility function
      const updatedInput = toggleSuggestionInInput(
        prev.expectedRevenue,
        option,
        isSelected
      );
      
      return {
        ...prev,
        selectedExpectedRevenueOptions: newOptions,
        expectedRevenue: updatedInput,
      };
    });
  };

  const handleGrowthProjectionOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedGrowthProjectionOptions;
      const isSelected = currentOptions.includes(option);
      
      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }
      
      // Update input field using utility function
      const updatedInput = toggleSuggestionInInput(
        prev.growthProjection,
        option,
        isSelected
      );
      
      return {
        ...prev,
        selectedGrowthProjectionOptions: newOptions,
        growthProjection: updatedInput,
      };
    });
  };

  const handleBusinessShareOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedBusinessShareOptions;
      const isSelected = currentOptions.includes(option);
      
      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }
      
      // Update input field using utility function
      const updatedInput = toggleSuggestionInInput(
        prev.businessShare,
        option,
        isSelected
      );
      
      return {
        ...prev,
        selectedBusinessShareOptions: newOptions,
        businessShare: updatedInput,
      };
    });
  };

  const handlePricingLevelOptionSelect = (option: string) => {
    setForm((prev) => {
      const currentOptions = prev.selectedPricingLevelOptions;
      const isSelected = currentOptions.includes(option);
      
      let newOptions;
      if (isSelected) {
        // Remove if already selected
        newOptions = currentOptions.filter((opt) => opt !== option);
      } else {
        // Add if not selected
        newOptions = [...currentOptions, option];
      }
      
      // Update input field using utility function
      const updatedInput = toggleSuggestionInInput(
        prev.pricingLevel,
        option,
        isSelected
      );
      
      return {
        ...prev,
        selectedPricingLevelOptions: newOptions,
        pricingLevel: updatedInput,
      };
    });
  };

  const handleAddCustomOption = (
    field:
      | "customExpectedRevenue"
      | "customGrowthProjection"
      | "customBusinessShare"
      | "customPricingLevel",
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
    field:
      | "customExpectedRevenue"
      | "customGrowthProjection"
      | "customBusinessShare"
      | "customPricingLevel",
    textareaField: keyof RevenueModelForm
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
      | "showExpectedRevenueOptions"
      | "showGrowthProjectionOptions"
      | "showBusinessShareOptions"
      | "showPricingLevelOptions"
  ) => {
    const isCurrentlyOpen = form[optionField];

    setForm((prev) => ({
      ...prev,
      showExpectedRevenueOptions:
        optionField === "showExpectedRevenueOptions"
          ? !prev.showExpectedRevenueOptions
          : false,
      showGrowthProjectionOptions:
        optionField === "showGrowthProjectionOptions"
          ? !prev.showGrowthProjectionOptions
          : false,
      showBusinessShareOptions:
        optionField === "showBusinessShareOptions"
          ? !prev.showBusinessShareOptions
          : false,
      showPricingLevelOptions:
        optionField === "showPricingLevelOptions"
          ? !prev.showPricingLevelOptions
          : false,
    }));

    // Fetch AI suggestions when opening dropdown
    if (!isCurrentlyOpen) {
      if (
        optionField === "showExpectedRevenueOptions" &&
        expectedRevenueAiSuggestions.length === 0
      ) {
        fetchExpectedRevenueAISuggestions();
      } else if (
        optionField === "showGrowthProjectionOptions" &&
        growthProjectionAiSuggestions.length === 0
      ) {
        fetchGrowthProjectionAISuggestions();
      } else if (
        optionField === "showBusinessShareOptions" &&
        businessShareAiSuggestions.length === 0
      ) {
        fetchBusinessShareAISuggestions();
      } else if (
        optionField === "showPricingLevelOptions" &&
        pricingLevelAiSuggestions.length === 0
      ) {
        fetchPricingLevelAISuggestions();
      }
    }
  };

  const handleProductServiceChange = (
    id: string,
    field: "name" | "price",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      productServices: prev.productServices.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addProductService = () => {
    const newId = (form.productServices.length + 1).toString();
    setForm((prev) => ({
      ...prev,
      productServices: [
        ...prev.productServices,
        { id: newId, name: "", price: "" },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalRicaviAnno1 = totalRevenueStreams();
    const payments = {
      immediate: parseFloat(form.immediateCollectionPercent || "0") || 0,
      days60: parseFloat(form.collection60DaysPercent || "0") || 0,
      days90: parseFloat(form.collection90DaysPercent || "0") || 0,
    };

    const payoutAmounts = paymentAmounts();

    const payload: any = {
      revenueStreams: normalizeRevenueStreams(),
      totalRevenueYear1: totalRicaviAnno1,
      growthPercent: form.growthPercent || "",
      payments,
      paymentAmounts: {
        immediate: payoutAmounts.immediate,
        days60: payoutAmounts.days60,
        days90: payoutAmounts.days90,
        percentSum: payoutAmounts.percentSum,
      },
      growthForecast: growthForecast(5),
      accountingMapping: {
        contoEconomicoAValoreAggiunto: {
          ricaviAnno1: totalRicaviAnno1,
        },
      },
    };

    updateFormData("step7", payload);

    const isValid = validateStep(6); // 0-based index for step 7

    if (isValid) {
      console.log("Revenue Model & Pricing Form Submitted:", payload);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
    }
  };

  function handleTextareaChange(field: string, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 07 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words">
              Modello di Ricavi e Prezzi
            </h2>
          </div>

          {/* Form */}
          <div className="px-[5px] md:px-8 py-4 md:py-8 relative">
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
                {/* Revenue Streams Table */}
                <div>
                  <label className="question-text">
                    Ricavi previsti per il 1° anno per Prodotto/Servizio
                  </label>

                  {/* Desktop/Tablet table */}
                  <div className="hidden md:block mt-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 text-[1rem] font-medium text-accent">REVENUE STREAMS</th>
                          <th className="text-left py-3 px-4 text-[1rem] font-medium text-accent">DESCRIZIONE PRODOTTO/SERVIZIO</th>
                          <th className="text-right py-3 px-4 text-[1rem] font-medium text-accent">FATTURATO (1° ANNO)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(form.revenueStreams || []).map((row) => (
                          <tr key={row.id}>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => updateRevenueStream(row.id, "name", e.target.value)}
                                placeholder={`Prodotto/Servizio ${row.id}`}
                                className="w-full px-3 py-2 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={row.description || ""}
                                onChange={(e) => updateRevenueStream(row.id, "description", e.target.value)}
                                placeholder="Descrizione (facoltativo)"
                                className="w-full px-3 py-2 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </td>
                            <td className="py-2 px-4 text-right">
                              <input
                                type="text"
                                value={row.amount}
                                onChange={(e) => updateRevenueStream(row.id, "amount", e.target.value)}
                                placeholder="Es. 100.000,00"
                                className="w-full text-right px-3 py-2 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile stacked layout */}
                  <div className="md:hidden mt-4 space-y-4">
                    {(form.revenueStreams || []).map((row) => (
                      <div key={row.id} className="p-3 rounded-lg border border-[#888888]/20 bg-white shadow-sm">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-accent mb-1">Revenue Stream</label>
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => updateRevenueStream(row.id, "name", e.target.value)}
                              placeholder={`Prodotto/Servizio ${row.id}`}
                              className="w-full px-3 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-accent mb-1">Descrizione Prodotto/Servizio</label>
                            <input
                              type="text"
                              value={row.description || ""}
                              onChange={(e) => updateRevenueStream(row.id, "description", e.target.value)}
                              placeholder="Descrizione (facoltativo)"
                              className="w-full px-3 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-accent mb-1">Fatturato (1° anno)</label>
                            <input
                              type="text"
                              value={row.amount}
                              onChange={(e) => updateRevenueStream(row.id, "amount", e.target.value)}
                              placeholder="Es. 100.000,00"
                              className="w-full text-right px-3 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      type="button"
                      onClick={addRevenueStream}
                      className="px-6 py-2 bg-[#A9A4FE] text-white text-[0.875rem] font-medium rounded-lg hover:bg-primary/90 transition-all"
                    >
                      + Aggiungi
                    </button>
                    <div className="text-[1rem] font-medium text-accent">
                      Totale: {formatEuro(totalRevenueStreams(), { decimals: 2 })}
                    </div>
                  </div>

                  {/* Existing Expected Revenue field retained with AI suggestions (optional) */}
                  <div className="mt-8">
                    <label className="question-text">Proiezione complessiva (facoltativa)</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={form.expectedRevenue}
                        onChange={(e) => handleTextareaChange("expectedRevenue", e.target.value)}
                        onKeyPress={(e) =>
                          handleKeyPress(e, "customExpectedRevenue", "expectedRevenue")
                        }
                        onClick={() => handleTextareaClick("showExpectedRevenueOptions")}
                        placeholder="Inserisci una proiezione personalizzata"
                        className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                      />
                    </div>
                  </div>

                  {/* Sub-options */}
                  {form.showExpectedRevenueOptions && (
                    <div ref={expectedRevenueDropdownRef} className="mt-4 space-y-2">
                      {/* AI Suggestions */}
                      {isLoadingExpectedRevenueSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        expectedRevenueAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                expectedRevenue: option,
                                showExpectedRevenueOptions: false,
                              }));
                            }}
                            className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-7"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customExpectedRevenue.map((option, index) => (
                        <button
                          key={`custom-revenue-${index}`}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              expectedRevenue: option,
                              showExpectedRevenueOptions: false,
                            }));
                          }}
                          className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                        >
                          <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3 ml-7"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product/Service Section 1 */}
                {/* <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.productServices.slice(0, 4).map((item, index) => (
                      <div key={item.id}>
                        <label className="text-[1rem] font-medium text-accent mb-2 block">
                          Prodotto/Servizio {index + 1}:
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleProductServiceChange(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                        />
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Customer Payments (Crediti vs. Clienti) */}
                <div className="mt-6">
                  <label className="question-text">Pagamenti dei clienti (Crediti vs. Clienti)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="text-sm text-accent">Incasso immediato (entro 30 gg) %</label>
                      <input
                        type="text"
                        value={form.immediateCollectionPercent || ""}
                        onChange={(e) => handlePercentChange("immediateCollectionPercent", e.target.value)}
                        className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-accent">Incasso a 60 giorni %</label>
                      <input
                        type="text"
                        value={form.collection60DaysPercent || ""}
                        onChange={(e) => handlePercentChange("collection60DaysPercent", e.target.value)}
                        className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-accent">Incasso a 90 giorni %</label>
                      <input
                        type="text"
                        value={form.collection90DaysPercent || ""}
                        onChange={(e) => handlePercentChange("collection90DaysPercent", e.target.value)}
                        className="w-full px-4 py-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment amounts summary */}
                <div className="mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-[0.95rem] text-accent">Somma percentuali</div>
                    <div className="text-right text-[0.95rem] text-accent md:col-span-1">{paymentAmounts().percentSum.toFixed(2)}%</div>
                    <div className="text-[0.95rem] text-accent">Totale incassi immediati</div>
                    <div className="text-right text-[0.95rem] text-accent">{formatEuro(paymentAmounts().immediate, { decimals: 2 })}</div>
                    <div className="text-[0.95rem] text-accent">Totale incassi 60 gg</div>
                    <div className="text-right text-[0.95rem] text-accent">{formatEuro(paymentAmounts().days60, { decimals: 2 })}</div>
                    <div className="text-[0.95rem] text-accent">Totale incassi 90 gg</div>
                    <div className="text-right text-[0.95rem] text-accent">{formatEuro(paymentAmounts().days90, { decimals: 2 })}</div>
                  </div>
                </div>

                {/* Growth percentage for future years */}
                <div>
                  <label className="question-text">
                    Quale percentuale di crescita prevedi per gli anni successivi?
                  </label>
                  <div className="mt-4">
                    <input
                      type="text"
                        value={form.growthPercent || ""}
                      onChange={(e) => handlePercentChange("growthPercent", e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "customGrowthProjection",
                          "growthProjection"
                        )
                      }
                      onClick={() =>
                        handleTextareaClick("showGrowthProjectionOptions")
                      }
                      placeholder="Inserisci una proiezione personalizzata"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>

                  {/* Sub-options */}
                  {form.showGrowthProjectionOptions && (
                    <div
                      ref={growthProjectionDropdownRef}
                      className="mt-4 space-y-2"
                    >
                      {/* AI Suggestions */}
                      {isLoadingGrowthProjectionSuggestions ? (
                        <div className="flex items-center p-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-[1rem] font-normal text-gray-500 ml-2">
                            Caricamento suggerimenti AI...
                          </span>
                        </div>
                      ) : (
                        growthProjectionAiSuggestions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const pct = extractPercentFromText(option);
                              setForm((prev) => ({
                                ...prev,
                                growthPercent: pct,
                                showGrowthProjectionOptions: false,
                              }));
                            }}
                            className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 ml-7"></div>
                            <span className="text-[1rem] font-normal text-accent">
                              {option}
                            </span>
                          </button>
                        ))
                      )}

                      {/* Custom options */}
                      {form.customGrowthProjection.map((option, index) => (
                        <button
                          key={`custom-growth-${index}`}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              growthProjection: option,
                              showGrowthProjectionOptions: false,
                            }));
                          }}
                          className="flex items-center w-full text-left p-2 rounded transition-colors hover:bg-gray-50"
                        >
                          <div className="w-2 h-2 bg-[#6B4AFF] rounded-full mr-3 ml-7"></div>
                          <span className="text-[1rem] font-normal text-accent">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Growth forecast preview (Years 1-5) */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {[1,2,3,4,5].map((y) => (
                            <th key={y} className="text-right py-2 px-3 text-[0.95rem] font-medium text-accent">Anno {y}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {growthForecast(5).map((v, idx) => (
                            <td key={idx} className="text-right py-2 px-3 text-[0.95rem] text-accent">{formatEuro(v, { decimals: 2 })}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CANCELLED SECTIONS per requirements: distribution by product groups and expected pricing level removed */}

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
