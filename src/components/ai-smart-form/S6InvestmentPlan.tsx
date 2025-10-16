"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGetAISuggestionsMutation } from "@/redux/api/suggestions/suggestionsApi";
import { FiPlus } from "react-icons/fi";
import { formatEuro, parseEuro } from "@/utils/euFormat";

interface InvestmentItem {
  id: string;
  description: string;
  amount: string; // stored as human string, sanitized to numbers only (.,, and digits)
}

interface FixedInvestmentRow {
  key: string;
  label: string;
  amortizationRate: number; // e.g. 0.2 for 20%
  category: "materiale" | "immateriale";
  amount: string; // human input string
}

interface InvestmentPlanForm {
  initialInvestment: string; // numeric-only string
  investmentItems: InvestmentItem[];
  fixedInvestments: FixedInvestmentRow[];
}

const FIXED_INVESTMENTS_DEFINITION: Omit<FixedInvestmentRow, "amount">[] = [
  {
    key: "terreni",
    label: "Terreni",
    amortizationRate: 0.0,
    category: "materiale",
  },
  {
    key: "fabbricati",
    label: "Fabbricati (uso industriale), Capannoni, stabilimenti produttivi",
    amortizationRate: 0.03,
    category: "materiale",
  },
  {
    key: "impianti_macchinari",
    label:
      "Impianti e macchinari, Attrezzature di produzione, macchine industriali",
    amortizationRate: 0.1,
    category: "materiale",
  },
  {
    key: "it_elettronica",
    label: "Attrezzature elettroniche, Computer, server, periferiche",
    amortizationRate: 0.2,
    category: "materiale",
  },
  {
    key: "arredi_ufficio",
    label: "Arredi e mobili d’ufficio",
    amortizationRate: 0.12,
    category: "materiale",
  },
  {
    key: "autovetture",
    label: "Autovetture Auto aziendali",
    amortizationRate: 0.25,
    category: "materiale",
  },
  {
    key: "veicoli_commerciali",
    label: "Autocarri, furgoni, veicoli commerciali e industriali",
    amortizationRate: 0.2,
    category: "materiale",
  },
  {
    key: "licenze_software",
    label: "Licenze e Software gestionale, ERP, sistemi operativi",
    amortizationRate: 0.2,
    category: "immateriale",
  },
  {
    key: "brevetti_marchi",
    label: "Brevetti, marchi, diritti di proprietà intellettuale",
    amortizationRate: 0.2,
    category: "immateriale",
  },
];

function sanitizeEuroInput(raw: string): string {
  // keep only digits, dots and commas; strip letters and other chars
  return (raw || "").replace(/[^0-9.,]/g, "");
}

export default function S6InvestmentPlan() {
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
  const [initialInvestmentAiSuggestions, setInitialInvestmentAiSuggestions] =
    useState<string[]>([]);
  const [investmentItemAiSuggestions, setInvestmentItemAiSuggestions] =
    useState<string[]>([]);

  // Loading states
  const [
    isLoadingInitialInvestmentSuggestions,
    setIsLoadingInitialInvestmentSuggestions,
  ] = useState(false);
  const [
    isLoadingInvestmentItemSuggestions,
    setIsLoadingInvestmentItemSuggestions,
  ] = useState(false);

  const persistedData = getFormData("step6");

  // Ensure proper initialization with type safety
  const initializeForm = (): InvestmentPlanForm => {
    const defaultForm: InvestmentPlanForm = {
      initialInvestment: "",
      investmentItems: [
        { id: "1", description: "", amount: "" },
        { id: "2", description: "", amount: "" },
        { id: "3", description: "", amount: "" },
      ],
      fixedInvestments: FIXED_INVESTMENTS_DEFINITION.map((row) => ({
        ...row,
        amount: "",
      })),
    };

    if (!persistedData) {
      return defaultForm;
    }

    // Merge persisted data with defaults, ensuring all required fields exist
    return {
      initialInvestment:
        persistedData.initialInvestment || defaultForm.initialInvestment,
      investmentItems: Array.isArray(persistedData.investmentItems)
        ? persistedData.investmentItems
        : defaultForm.investmentItems,
      fixedInvestments: Array.isArray(persistedData.fixedInvestments)
        ? persistedData.fixedInvestments.map((item: any) => {
            // Find matching definition to ensure we have all required properties
            const definition = FIXED_INVESTMENTS_DEFINITION.find(
              (def) => def.key === item.key
            );
            if (definition) {
              return {
                ...definition,
                amount: item.amount || "",
              };
            }
            return item;
          })
        : defaultForm.fixedInvestments,
    };
  };

  const [form, setForm] = useState<InvestmentPlanForm>(initializeForm());

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step6", form);
  }, [form, updateFormData]);

  // Function to fetch AI suggestions for initial investment
  const fetchInitialInvestmentAISuggestions = async () => {
    setIsLoadingInitialInvestmentSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What will you spend your initial investment on?",
        context: "business investment categories and startup expenses",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setInitialInvestmentAiSuggestions(response.suggestions);
      } else {
        setInitialInvestmentAiSuggestions([
          "Equipment",
          "Inventory",
          "Marketing & Advertising",
          "Technology & Software",
          "Office Setup",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI initial investment suggestions:", error);
      setInitialInvestmentAiSuggestions([
        "Equipment",
        "Inventory",
        "Marketing & Advertising",
        "Technology & Software",
        "Office Setup",
      ]);
    } finally {
      setIsLoadingInitialInvestmentSuggestions(false);
    }
  };

  // Function to fetch AI suggestions for investment items
  const fetchInvestmentItemAISuggestions = async () => {
    setIsLoadingInvestmentItemSuggestions(true);

    try {
      const response = await getAISuggestions({
        question: "What specific investment items do you need?",
        context: "business investment items and startup costs",
        businessType: "general",
      }).unwrap();

      if (response.success && response.suggestions) {
        setInvestmentItemAiSuggestions(response.suggestions);
      } else {
        setInvestmentItemAiSuggestions([
          "Equipment Purchase",
          "Inventory Stock",
          "Marketing Campaign",
          "Technology Setup",
          "Office Rent",
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI investment item suggestions:", error);
      setInvestmentItemAiSuggestions([
        "Equipment Purchase",
        "Inventory Stock",
        "Marketing Campaign",
        "Technology Setup",
        "Office Rent",
      ]);
    } finally {
      setIsLoadingInvestmentItemSuggestions(false);
    }
  };

  const handleInputChange = (
    field: keyof InvestmentPlanForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSanitizedInputChange = (
    field: keyof InvestmentPlanForm,
    value: string
  ) => {
    const sanitized = sanitizeEuroInput(value);
    setForm((prev) => ({ ...prev, [field]: sanitized }));
  };

  const handleInvestmentItemChange = (
    id: string,
    field: "description" | "amount",
    value: string
  ) => {
    const v = field === "amount" ? sanitizeEuroInput(value) : value;
    setForm((prev) => ({
      ...prev,
      investmentItems: prev.investmentItems.map((item) =>
        item.id === id ? { ...item, [field]: v } : item
      ),
    }));
  };

  const addInvestmentItem = () => {
    const newId = (form.investmentItems.length + 1).toString();
    setForm((prev) => ({
      ...prev,
      investmentItems: [
        ...prev.investmentItems,
        { id: newId, description: "", amount: "" },
      ],
    }));
  };

  const fixedInvestmentsTotal = () => {
    const list = form.fixedInvestments || [];
    return list.reduce(
      (sum: number, it: FixedInvestmentRow) =>
        sum + (parseEuro(it.amount) || 0),
      0
    );
  };

  const dynamicInvestmentsTotal = () => {
    return form.investmentItems.reduce((total, item) => {
      const amount = parseEuro(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const calculateTotal = () => {
    return dynamicInvestmentsTotal() + fixedInvestmentsTotal();
  };

  const materialTotal = () => {
    if (!form.fixedInvestments || form.fixedInvestments.length === 0) {
      return 0;
    }
    
    // Material investment keys from definition
    const materialKeys = [
      "terreni", "fabbricati", "impianti_macchinari", 
      "it_elettronica", "arredi_ufficio", "autovetture", "veicoli_commerciali"
    ];
    
    let total = 0;
    
    form.fixedInvestments.forEach((item) => {
      const isMaterialByKey = item.key && materialKeys.includes(item.key);
      const isMaterialByCategory = item.category === "materiale";
      
      // Also check by label matching as fallback
      const isMaterialByLabel = item.label && (
        item.label.toLowerCase().includes('terreni') ||
        item.label.toLowerCase().includes('fabbricati') ||
        item.label.toLowerCase().includes('impianti') ||
        item.label.toLowerCase().includes('macchinari') ||
        item.label.toLowerCase().includes('elettroniche') ||
        item.label.toLowerCase().includes('computer') ||
        item.label.toLowerCase().includes('arredi') ||
        item.label.toLowerCase().includes('mobili') ||
        item.label.toLowerCase().includes('autovetture') ||
        item.label.toLowerCase().includes('auto aziendali') ||
        item.label.toLowerCase().includes('autocarri') ||
        item.label.toLowerCase().includes('furgoni') ||
        item.label.toLowerCase().includes('veicoli')
      );
      
      const isMaterial = isMaterialByKey || isMaterialByCategory || isMaterialByLabel;
      
      if (isMaterial) {
        const amount = parseEuro(item.amount) || 0;
        total += amount;
      }
    });
    
    return total;
  };

  const immaterialTotal = () => {
    // Prefer explicit category, but also support legacy data without category by matching keys/labels
    const keys = ["licenze_software", "brevetti_marchi"] as const;
    const labelRegex = /(licen[zs]e|software|erp|sistemi operativi|brevetti|marchi|propriet[aà]|intellettuale)/i;

    return (form.fixedInvestments || []).reduce((sum, row) => {
      const isImmaterial =
        row.category === "immateriale" ||
        (row.key && (keys as readonly string[]).includes(row.key)) ||
        labelRegex.test(row.label || "");
      return isImmaterial ? sum + parseEuro(row.amount) : sum;
    }, 0);
  };

  const totalAnnualAmortization = () =>
    form.fixedInvestments.reduce(
      (sum, r) => sum + parseEuro(r.amount) * (r.amortizationRate || 0),
      0
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build accounting mapping and normalized numeric values
    const fixedInvestmentsNumeric = form.fixedInvestments.map((r) => ({
      key: r.key,
      label: r.label,
      amortizationRate: r.amortizationRate,
      category: r.category,
      amount: parseEuro(r.amount),
      annualAmortization: parseEuro(r.amount) * r.amortizationRate,
    }));

    const formData: any = {
      fundingSources: {
        initialInvestment: calculateTotal(),
        fromHome: calculateTotal(),
      },
      initialInvestmentDescription: form.initialInvestment,
      investmentItems: form.investmentItems.map((item) => ({
        id: item.id,
        description: item.description,
        amount: parseEuro(item.amount),
      })),
      fixedInvestments: fixedInvestmentsNumeric,
      totals: {
        totalInvestment: calculateTotal(),
        materiali: materialTotal(),
        immateriali: immaterialTotal(),
        annualAmortization: totalAnnualAmortization(),
      },
      accountingMapping: {
        statoPatrimoniale: {
          immobilizzazioni: {
            materiali: materialTotal(),
            immateriali: immaterialTotal(),
          },
        },
        contoEconomicoAValoreAggiunto: {
          ammortamentiAnnui: totalAnnualAmortization(),
        },
      },
    };

    // Save current form data to context before validation
    updateFormData("step6", formData);

    // Validate the form before proceeding
    const isValid = validateStep(5); // 0-based index for step 6

    if (isValid) {
      console.log("Investment Plan Form Submitted:", formData);
      console.log("Funding Sources:", formData.fundingSources);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  const handleTextareaChange = (
    field: keyof InvestmentPlanForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 06 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words">
              Piano di Investimento
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
                {/* Question: What will you spend your initial investment on? */}
                <div>
                  <label className="question-text">
                    Su cosa spenderai il tuo investimento iniziale?
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Scrivi la descrizione (testo) e inserisci gli importi nei
                    campi dedicati qui sotto.
                  </p>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={form.initialInvestment}
                      onChange={(e) =>
                        handleInputChange("initialInvestment", e.target.value)
                      }
                      placeholder="Scrivi in poche parole su cosa spenderai l'investimento iniziale"
                      className="w-full px-4 py-4 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[1rem] font-normal text-accent"
                    />
                  </div>
                </div>

                {/* Fixed Investment Categories with Amortization % */}
                <div className="space-y-6">
                  <div className="border-b border-b-[#888888]/30 pb-2">
                    <h3 className="question-text">
                      Tabella investimenti fissi
                    </h3>
                    <p className="text-sm text-gray-600">
                      Le percentuali di ammortamento sono precompilate in base
                      alla normativa italiana.
                    </p>
                  </div>
                  {/* Desktop/tablet grid */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-6 text-[1rem] font-medium text-accent">Tipo di investimento</div>
                      <div className="col-span-2 text-[1rem] font-medium text-accent text-center">Ammortamento %</div>
                      <div className="col-span-2 text-[1rem] font-medium text-accent text-right pr-1">Importo (€)</div>
                      <div className="col-span-2 text-[1rem] font-medium text-accent text-right">Ammortamento annuo (€)</div>
                    </div>
                    {form.fixedInvestments.map((it) => (
                      <div key={it.key} className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-6 text-[1rem] text-accent">{it.label}</div>
                        <div className="col-span-2 text-center text-[1rem] text-accent">{Math.round((it.amortizationRate || 0) * 100)}%</div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={it.amount}
                            onChange={(e) => {
                              const v = sanitizeEuroInput(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                fixedInvestments: prev.fixedInvestments.map((row) =>
                                  row.key === it.key ? { ...row, amount: v } : row
                                ),
                              }));
                            }}
                            placeholder="0"
className="w-full h-10 my-1 px-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-1 focus:ring-offset-white transition-shadow text-right"
                          />
                        </div>
                        <div className="col-span-2 text-right text-[1rem] text-accent pl-2">
                          {formatEuro(parseEuro(it.amount) * (it.amortizationRate || 0), { decimals: 2 })}
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-12 gap-6 pt-2 border-t border-[#888888]/20">
                      <div className="col-span-6 text-[0.95rem] text-accent">Totale investimenti fissi</div>
                      <div className="col-span-2"></div>
                      <div className="col-span-2 text-right font-medium text-accent">{formatEuro(fixedInvestmentsTotal(), { decimals: 2 })}</div>
                      <div className="col-span-2 text-right font-medium text-accent">{formatEuro(totalAnnualAmortization(), { decimals: 2 })}</div>
                    </div>
                  </div>

                  {/* Mobile stacked cards */}
                  <div className="md:hidden space-y-3">
                    {form.fixedInvestments.map((it) => (
                      <div key={it.key} className="border border-[#888888]/30 rounded-lg p-3 bg-white">
                        <div className="text-[1rem] font-medium text-accent mb-2">{it.label}</div>
                        <div className="flex items-center justify-between text-[0.95rem] text-accent mb-2">
                          <span>Ammortamento %</span>
                          <span className="font-medium">{Math.round((it.amortizationRate || 0) * 100)}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-[0.95rem] text-accent">Importo (€)</span>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={it.amount}
                            onChange={(e) => {
                              const v = sanitizeEuroInput(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                fixedInvestments: prev.fixedInvestments.map((row) =>
                                  row.key === it.key ? { ...row, amount: v } : row
                                ),
                              }));
                            }}
                            placeholder="0"
className="w-40 h-10 my-1 px-3 bg-[#FCFCFC] border border-[#888888]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-1 focus:ring-offset-white transition-shadow text-right"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[0.95rem] text-accent">
                          <span>Ammortamento annuo (€)</span>
                          <span className="font-medium">{formatEuro(parseEuro(it.amount) * (it.amortizationRate || 0), { decimals: 2 })}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-[#888888]/20">
                      <span className="text-[0.95rem] text-accent">Totale investimenti fissi</span>
                      <span className="text-[0.95rem] font-medium text-accent">{formatEuro(fixedInvestmentsTotal(), { decimals: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.95rem] text-accent">Ammortamento annuo totale</span>
                      <span className="text-[0.95rem] font-medium text-accent">{formatEuro(totalAnnualAmortization(), { decimals: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Investment Items Section (liberi) */}
                <div className="space-y-6">
                  {/* Headers (hide on small screens to avoid cramped layout) */}
             
                  {/* Totals and Accounting Mapping Summary */}
                  <div className="pt-6 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-[1rem] text-accent">
                        Immobilizzazioni materiali
                      </div>
                      <div className="text-right text-[1rem] text-accent">
                        {formatEuro(materialTotal(), { decimals: 2 })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-[1rem] text-accent">
                        Immobilizzazioni immateriali
                      </div>
                      <div className="text-right text-[1rem] text-accent">
                        {formatEuro(immaterialTotal(), { decimals: 2 })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-[1rem] text-accent">
                        Ammortamenti annui (CE)
                      </div>
                      <div className="text-right text-[1rem] text-accent">
                        {formatEuro(totalAnnualAmortization(), { decimals: 2 })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-[#888888]/30 pt-2 mt-2">
                      <div className="text-[1.1rem] font-medium text-accent">
                        Investimento Iniziale Totale
                      </div>
                      <div className="text-right text-[1.1rem] font-medium text-accent">
                        {formatEuro(calculateTotal(), { decimals: 2 })}
                      </div>
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
