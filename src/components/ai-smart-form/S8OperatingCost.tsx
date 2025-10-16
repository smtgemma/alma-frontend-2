"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { parseEuro, formatEuro } from "@/utils/euFormat";
//
interface OperatingCostItem {
  id: string;
  name: string;
  percentage: string;
  totalCost: string;
  showOptions: boolean;
}

interface OperatingCostForm {
  operatingCosts: string;
  operatingCostItems: OperatingCostItem[];
  firstYearTotalCost: string;
  firstYearNetProfit: string;
  netProfitMargin: string;
}

// Simple tooltip helper
const TOOLTIP_MAP: Record<string, string> = {
  cogs: "Costo del venduto: materie prime, merci, produzione diretta.",
  salaries: "Stipendi e salari: personale operativo e amministrativo.",
  marketing: "Marketing e pubblicità: campagne, social, contenuti, eventi.",
  rent: "Affitti: uffici, negozi, capannoni.",
  admin: "Amministrazione generale: utilities, software, consulenze, assicurazioni.",
  amortization: "Ammortamenti: quota annua degli investimenti (calcolata automaticamente).",
  other: "Altre spese: costi vari non ricorrenti e minori.",
  interest: "Oneri finanziari: interessi su prestiti e linee di credito.",
  tax: "Imposte: stima IRES 24% calcolata in base al reddito imponibile.",
  accounting: "Contabilità e consulenze: servizi professionali e compliance fiscale.",
};

// Resolve tooltip text by id or by matching the item name when ids differ
const getTooltipFromItem = (item: { id: string; name: string }) => {
  if (TOOLTIP_MAP[item.id]) return TOOLTIP_MAP[item.id];
  const name = (item.name || "").toLowerCase();
  if (name.includes("marketing")) return TOOLTIP_MAP.marketing;
  if (name.includes("salar") || name.includes("wage") || name.includes("dipendenti")) return TOOLTIP_MAP.salaries;
  if (name.includes("rent") || name.includes("affitt")) return TOOLTIP_MAP.rent;
  if (name.includes("general") || name.includes("amministr")) return TOOLTIP_MAP.admin;
  if (name.includes("accounting") || name.includes("contabil")) return TOOLTIP_MAP.accounting;
  if (name.includes("ammort") || name.includes("amortiz") ) return TOOLTIP_MAP.amortization;
  if (name.includes("interest") || name.includes("oneri")) return TOOLTIP_MAP.interest;
  if (name.includes("tax") || name.includes("imposte")) return TOOLTIP_MAP.tax;
  if (name.includes("cogs") || name.includes("vendut") || name.includes("goods")) return TOOLTIP_MAP.cogs;
  return TOOLTIP_MAP.other;
};

export default function S8OperatingCost() {
  const {
    nextStep,
    prevStep,
    getFormData,
    updateFormData,
    errors,
    validateStep,
  } = useSmartForm();

  const persistedData = getFormData("step8");
  const step7Data = getFormData("step7");
  const step6Data = getFormData("step6");

  // Refs for dropdown containers
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [form, setForm] = useState<OperatingCostForm>(() => {
    if (persistedData) {
      const updatedItems = persistedData.operatingCostItems.map((item) => ({
        ...item,
        showOptions: false,
      }));
      return { ...persistedData, operatingCostItems: updatedItems };
    }

    // Base: Year 1 expected revenue from Step 7
    const expectedRevenueBase = (() => {
      const raw = step7Data?.expectedRevenue || "0";
      // Try to parse currency or range
      const numeric = extractRevenueValue(raw);
      return numeric > 0 ? numeric : 0;
    })();

    // Ammortamenti from Step 6 fixed investments
    const amortizationFromInvestments = (() => {
      const list = step6Data?.fixedInvestments || [];
      const sum = list.reduce((acc: number, row: any) => {
        const amt = parseEuro(row.amount || "0");
        const rate = Number(row.amortizationRate || 0);
        return acc + amt * rate;
      }, 0);
      return sum;
    })();

    // Helper: calculate total cost from % of revenue
    const calcFromPercent = (pct: string) => {
      const percentageValue = parseFloat(pct.replace("%", "")) || 0;
      const totalCost = (percentageValue / 100) * expectedRevenueBase;
      return formatCurrency(totalCost);
    };

    return {
      operatingCosts: "",
      operatingCostItems: [
        { id: "cogs", name: "Cost of Goods Sold (COGS)", percentage: "30%", totalCost: calcFromPercent("30%"), showOptions: false },
        { id: "salaries", name: "Employee salaries and wages", percentage: "20%", totalCost: calcFromPercent("20%"), showOptions: false },
        { id: "marketing", name: "Marketing and advertising expenses", percentage: "5%", totalCost: calcFromPercent("5%"), showOptions: false },
        { id: "rent", name: "Rent", percentage: "1%", totalCost: calcFromPercent("1%"), showOptions: false },
        { id: "admin", name: "General administration", percentage: "2%", totalCost: calcFromPercent("2%"), showOptions: false },
        { id: "amortization", name: "Ammortamenti", percentage: "-", totalCost: formatCurrency(amortizationFromInvestments), showOptions: false },
        { id: "other", name: "Other expenses", percentage: "1%", totalCost: calcFromPercent("1%"), showOptions: false },
        { id: "interest", name: "Interest expenses", percentage: "1%", totalCost: calcFromPercent("1%"), showOptions: false },
      ],
      firstYearTotalCost: formatCurrency(0),
      firstYearNetProfit: formatCurrency(0),
      netProfitMargin: "0%",
    };
  });

  // Helper function to extract numeric value from currency string
  const extractNumericValue = (currencyString: string): number => {
    if (!currencyString) return 0;
    const numericValue = currencyString.replace(/[€$£¥,\s]/g, "");
    return parseFloat(numericValue) || 0;
  };

  // Helper function to extract revenue from range strings (e.g., "€50,000 - €150,000")
  const extractRevenueValue = (revenueString: string): number => {
    if (!revenueString) return 0;

    // Handle text descriptions like "Expected first-year revenue: approximately $750,000"
    // Extract all numbers with currency symbols from the text
    const currencyMatches = revenueString.match(/[€$£¥]\s*[\d,]+/g);
    if (currencyMatches && currencyMatches.length > 0) {
      // Take the last/largest currency value found
      const lastMatch = currencyMatches[currencyMatches.length - 1];
      return extractNumericValue(lastMatch);
    }

    // Handle standalone numbers like "750,000" or "750000"
    const numberMatches = revenueString.match(/[\d,]+/g);
    if (numberMatches && numberMatches.length > 0) {
      // Take the largest number found
      const numbers = numberMatches.map((match) =>
        parseFloat(match.replace(/,/g, ""))
      );
      const largestNumber = Math.max(...numbers);
      if (largestNumber > 1000) {
        // Assume it's a revenue amount if > 1000
        return largestNumber;
      }
    }

    // Handle range formats like "€50,000 - €150,000"
    if (revenueString.includes("-")) {
      // Extract the higher value from the range for conservative estimation
      const parts = revenueString.split("-");
      if (parts.length === 2) {
        const higherValue = parts[1].trim();
        return extractNumericValue(higherValue);
      }
    }

    // Handle "Under €50,000" format
    if (revenueString.toLowerCase().includes("under")) {
      const value = revenueString.replace(/under/gi, "").trim();
      return extractNumericValue(value);
    }

    // Handle "Over €500,000" format
    if (revenueString.toLowerCase().includes("over")) {
      const value = revenueString.replace(/over/gi, "").trim();
      return extractNumericValue(value);
    }

    // Handle direct currency values like "€100,000"
    return extractNumericValue(revenueString);
  };

  // Helper function to format currency (EU)
  const formatCurrency = (value: number): string => {
    return formatEuro(value, { decimals: 2 });
  };

  // Helper function to format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
  };

  // Helper function to extract percentage value
  const extractPercentageValue = (percentageString: string): number => {
    if (!percentageString) return 0;
    const numericValue = percentageString.replace(/[%\s]/g, "");
    return parseFloat(numericValue) || 0;
  };

  // Base: Expected Revenue from Step 7
  const getExpectedRevenueBase = (): number => {
    // Prefer revenueStreams total if provided
    const streams = (step7Data as any)?.revenueStreams || [];
    if (Array.isArray(streams) && streams.length > 0) {
      const total = streams.reduce((sum: number, row: any) => sum + (parseEuro(row.amount || "") || 0), 0);
      if (total > 0) return total;
    }
    return extractRevenueValue(step7Data?.expectedRevenue || "0");
  };

  // Calculate total cost for an item based on percentage and Expected Revenue
  const calculateItemTotalCost = (
    percentage: string,
    expectedRevenue: number
  ): number => {
    const percentageValue = extractPercentageValue(percentage);
    return (percentageValue / 100) * expectedRevenue;
  };

  // Calculate all summary values
  const calculateSummaryValues = (
    operatingCostItems: OperatingCostItem[],
    expectedRevenue: number
  ) => {
    // Calculate total operating costs
    const totalOperatingCosts = operatingCostItems.reduce((total, item) => {
      if (item.id === "amortization" || item.id === "tax") {
        // Ammortamenti and taxes are not percentage-based here
        return total + extractNumericValue(item.totalCost);
      }
      const itemCost = calculateItemTotalCost(
        item.percentage,
        expectedRevenue
      );
      return total + itemCost;
    }, 0);

    const expectedRevenueValue = expectedRevenue || 0;

    // Calculate net profit
    const netProfit = expectedRevenueValue - totalOperatingCosts;

    // Calculate profit margin
    const profitMargin =
      expectedRevenueValue > 0 ? (netProfit / expectedRevenueValue) * 100 : 0;

    return {
      totalCost: formatCurrency(totalOperatingCosts),
      netProfit: formatCurrency(netProfit),
      profitMargin: formatPercentage(profitMargin),
    };
  };

  // Update item total cost when percentage changes
  const updateItemTotalCost = (id: string, percentage: string) => {
    const expectedRevenue = getExpectedRevenueBase();
    const totalCost = calculateItemTotalCost(
      percentage,
      expectedRevenue
    );

    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) =>
        item.id === id
          ? { ...item, percentage, totalCost: formatCurrency(totalCost) }
          : item
      ),
    }));
  };

  // Recalculate all item costs when expected revenue changes
  const recalculateAllItemCosts = () => {
    const expectedRevenue = getExpectedRevenueBase();
    setForm((prev) => {
      const newItems = prev.operatingCostItems.map((item) => {
        if (item.id === "amortization" || item.id === "tax") {
          return item;
        }
        const totalCost = calculateItemTotalCost(
          item.percentage,
          expectedRevenue
        );
        const newTotal = formatCurrency(totalCost);
        if (item.totalCost === newTotal) return item; // no change for this row
        return { ...item, totalCost: newTotal };
      });
      // If nothing changed, return prev to avoid re-render loops
      const changed = newItems.some((it, idx) => it !== prev.operatingCostItems[idx]);
      if (!changed) return prev;
      return { ...prev, operatingCostItems: newItems };
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      Object.keys(dropdownRefs.current).forEach((itemId) => {
        const ref = dropdownRefs.current[itemId];
        if (ref && !ref.contains(target)) {
          setForm((prev) => ({
            ...prev,
            operatingCostItems: prev.operatingCostItems.map((item) =>
              item.id === itemId ? { ...item, showOptions: false } : item
            ),
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync form changes with context (guard against unnecessary updates)
  const lastSyncRef = useRef<string>("");
  useEffect(() => {
    const snapshot = JSON.stringify(form);
    if (snapshot !== lastSyncRef.current) {
      lastSyncRef.current = snapshot;
      updateFormData("step8", form);
    }
  }, [form, updateFormData]);

  // When step7 revenue changes, recompute item totals
  useEffect(() => {
    recalculateAllItemCosts();
  }, [step7Data?.expectedRevenue]);

  // When step6 fixed investments change, refresh amortization item only
  useEffect(() => {
    const list = step6Data?.fixedInvestments || [];
    const sum = list.reduce((acc: number, row: any) => {
      const amt = parseEuro(row.amount || "0");
      const rate = Number(row.amortizationRate || 0);
      return acc + amt * rate;
    }, 0);
    const newFormatted = formatCurrency(sum);

    setForm((prev) => {
      const current = prev.operatingCostItems.find((i) => i.id === "amortization");
      if (current && current.totalCost === newFormatted) return prev; // no change
      return {
        ...prev,
        operatingCostItems: prev.operatingCostItems.map((item) =>
          item.id === "amortization" ? { ...item, totalCost: newFormatted } : item
        ),
      };
    });
  }, [step6Data?.fixedInvestments]);

  // Build a signature that ignores the 'tax' row so setting tax doesn't retrigger the effect
  const nonTaxSignature = useMemo(() => {
    try {
      const items = (form.operatingCostItems || []).filter((i) => i.id !== 'tax');
      // include amortization total (depends on Step 6), but ignore other totals to avoid loops
      const mapped = items.map((i) => ({
        id: i.id,
        percentage: i.percentage,
        totalCost: i.id === 'amortization' ? i.totalCost : undefined,
      }));
      return JSON.stringify(mapped);
    } catch {
      return '';
    }
  }, [form.operatingCostItems]);

  // Automatically compute Income Tax (~IRES 24%) based on taxable income and update tax item
  useEffect(() => {
    const expectedRevenue = getExpectedRevenueBase();
    // Compute subtotal excluding tax (sum of all items except 'tax')
    const subtotalExcludingTax = (form.operatingCostItems || []).reduce((sum, item) => {
      if (item.id === 'tax') return sum;
      if (item.id === 'amortization') {
        return sum + extractNumericValue(item.totalCost);
      }
      const pct = extractPercentageValue(item.percentage);
      return sum + (pct / 100) * expectedRevenue;
    }, 0);
    const taxableIncome = Math.max(0, expectedRevenue - subtotalExcludingTax);
    const incomeTax = taxableIncome * 0.24; // 24% IRES baseline
    const formattedTax = formatCurrency(incomeTax);

    // Update tax only if it actually changed to avoid render loops
    setForm((prev) => {
      const currentTax = prev.operatingCostItems.find((i) => i.id === 'tax');
      if (currentTax && currentTax.totalCost === formattedTax) return prev;
      return {
        ...prev,
        operatingCostItems: prev.operatingCostItems.map((item) =>
          item.id === 'tax' ? { ...item, totalCost: formattedTax } : item
        ),
      };
    });
  }, [step7Data?.expectedRevenue, nonTaxSignature]);

  // Recompute summary whenever item costs or revenue change (after tax update)
  useEffect(() => {
    const expectedRevenue = getExpectedRevenueBase();
    const summary = calculateSummaryValues(form.operatingCostItems as any, expectedRevenue);
    setForm((prev) => {
      if (
        prev.firstYearTotalCost === summary.totalCost &&
        prev.firstYearNetProfit === summary.netProfit &&
        prev.netProfitMargin === summary.profitMargin
      ) {
        return prev; // avoid unnecessary re-render
      }
      return {
        ...prev,
        firstYearTotalCost: summary.totalCost,
        firstYearNetProfit: summary.netProfit,
        netProfitMargin: summary.profitMargin,
      };
    });
  }, [form.operatingCostItems, step7Data?.expectedRevenue]);

  const handleInputChange = (field: keyof OperatingCostForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOperatingCostItemChange = (
    id: string,
    field: "name" | "percentage" | "totalCost",
    value: string
  ) => {
    if (field === "percentage") {
      // Ensure percentage has % symbol if not present
      const formattedPercentage = value.includes("%") ? value : `${value}%`;
      // Update the percentage and recalculate total cost
      updateItemTotalCost(id, formattedPercentage);
    } else {
      setForm((prev) => ({
        ...prev,
        operatingCostItems: prev.operatingCostItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current form data to context before validation
    updateFormData("step8", form);

    // Validate the form before proceeding
    const isValid = validateStep(7); // 0-based index for step 8

    if (isValid) {
      nextStep();
    } else {
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center px-[5px] md:px-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white px-[5px] md:px-8 py-2 md:py-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Passo 08 di 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-snug md:leading-tight text-accent font-semibold tracking-tight break-words">
              Costi Operativi
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
                {/* Question: What are your operating costs? */}
                <div>
                  <label className="text-[24px] font-medium text-accent">
                    Quali sono i tuoi costi operativi?
                  </label>
                  <div className="mt-12 border-b border-b-[#888888]/30 ">
                    <h1 className="question-text pb-2">
                      Inserisci Spese Operative Annuali (Modifica percentuali o
                      lascia così):
                    </h1>
                  </div>
                </div>

                {/* Operating Costs Table */}
                <div className="mt-8">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="space-x-2">
                          <th className="text-left py-3 px-4 text-[1rem] font-medium text-accent w-1/2">
                            Elemento di Costo Operativo
                          </th>
                          <th className="text-center py-3 px-2 mx-4 text-[1rem] font-medium text-accent w-1/4 border-b border-b-[#888888]/30">
                            % dei Ricavi
                            <br />
                            <span className="text-sm font-normal">
                              (preimpostato ma modificabile)
                            </span>
                          </th>
                          <th className="text-center py-3 px-2 mx-4 text-[1rem] font-medium text-accent w-1/4 border-b border-b-[#888888]/30">
                            Costo Totale
                            <br />
                            <span className="text-sm font-normal">
                              (calcolato automaticamente)
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.operatingCostItems.map((item, index) => (
                          <tr key={item.id}>
                            <td className="py-3 px-4 w-1/2">
                              <span className="text-[1rem] font-normal text-accent flex items-center gap-2">
                                {item.name}
                                <span
                                  className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-300"
title={getTooltipFromItem(item)}
                                >
                                  i
                                </span>
                              </span>
                            </td>
                            <td className="py-3 text-center w-1/4 relative">
                              <input
                                type="text"
                                value={item.percentage}
                                onChange={(e) =>
                                  handleOperatingCostItemChange(
                                    item.id,
                                    "percentage",
                                    e.target.value
                                  )
                                }
                                className="w-full px-6 py-1 bg-transparent border-[0.3px] border-[#888888]/30 rounded focus:outline-none text-[1rem] font-normal text-accent text-start"
                              />
                            </td>
                            <td className="py-3 px-4 text-center w-1/4">
                              <span className="text-[1rem] font-normal text-accent">
                                {item.totalCost}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="mt-12 space-y-6 border-b border-b-[#888888]/30 border-t border-t-[#888888]/30 py-3">
                  <div className="space-y-4 px-4">
                    <div className="flex flex-col justify-start items-start py-2">
                      <span className="question-text">
                        Il tuo costo totale del primo anno è:
                      </span>
                      <span className="text-lg font-bold  text-accent">
                        {form.firstYearTotalCost}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start py-2">
                      <span className="question-text">
                        Il tuo profitto netto del primo anno è:
                      </span>
                      <span className="text-lg font-bold  text-accent">
                        {form.firstYearNetProfit}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start py-2">
                      <span className="question-text">
                        Il tuo margine di profitto netto è:
                      </span>
                      <span className="text-lg font-bold text-accent">
                        {form.netProfitMargin}
                      </span>
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
