"use client";

import React, { useState, useEffect } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { parseEuro, formatEuro } from "@/utils/euFormat";

// Italian number formatting utilities
const parseItalianNumber = (value: string): number => {
  if (!value) return 0;
  // Remove spaces and convert Italian format to English format
  // Italian: 1.234,56 -> English: 1234.56
  const cleaned = value
    .replace(/\s/g, "") // Remove spaces
    .replace(/\./g, "") // Remove thousands separators (dots)
    .replace(",", "."); // Replace decimal comma with dot
  return parseFloat(cleaned) || 0;
};

const formatItalianNumber = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return "0,00";

  // Format number with proper decimals
  const formatted = value.toFixed(decimals);
  const [integer, decimal] = formatted.split(".");

  // Add thousands separators (dots) to integer part
  const integerWithSeparators = integer.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    "$1."
  );

  // Combine with Italian decimal separator (comma)
  return decimal
    ? `${integerWithSeparators},${decimal}`
    : integerWithSeparators;
};

interface OperatingCostItem {
  id: string;
  name: string;
  percentage: string;
  totalCost: string;
  isAutoCalculated: boolean;
  showTooltip: boolean;
}

interface SupplierPayments {
  immediateCollection: string; // % of revenues collected immediately (cash or within 30 days)
  collection60Days: string; // % of revenues collected with 60 days delay
  collection90Days: string; // % of revenues collected with 90 days delay
}

interface OperatingCostForm {
  operatingCostItems: OperatingCostItem[];
  supplierPayments: SupplierPayments;
  totalOperatingCosts: string;
  netProfit: string;
  profitMargin: string;
}

// Enhanced tooltip helper with detailed explanations for non-experts
const TOOLTIP_MAP: Record<string, string> = {
  cogs: "Costo del venduto (COGS): Include materie prime, merci acquistate per la rivendita, costi di produzione diretti, manodopera diretta e altri costi direttamente collegati ai prodotti/servizi venduti. Esempio: se vendi scarpe, include il costo delle scarpe che acquisti dal fornitore.",
  salaries:
    "Stipendi e salari: Retribuzioni di dipendenti, contributi previdenziali, TFR, benefit aziendali, formazione del personale. Include tutto il personale operativo e amministrativo. Esempio: stipendio mensile di un commesso €1,500 + contributi €500 = €2,000/mese.",
  marketing:
    "Marketing e pubblicità: Campagne pubblicitarie, social media, contenuti, eventi, fiere, materiale promozionale, sito web, SEO, Google Ads, Facebook Ads, influencer marketing, branding. Esempio: budget mensile €1,000 per Google Ads + €500 per social media.",
  rent: "Affitti: Canoni di locazione per uffici, negozi, capannoni, magazzini, spazi produttivi, parcheggi e qualsiasi immobile utilizzato per l'attività. Esempio: affitto negozio €2,000/mese + magazzino €800/mese.",
  admin:
    "Amministrazione generale: Utilities (luce, gas, acqua, telefono), software gestionale, consulenze legali/fiscali, assicurazioni, cancelleria, spese bancarie, servizi professionali. Esempio: bollette €300/mese + software €100/mese + commercialista €200/mese.",
  amortization:
    "Ammortamenti: Quota annuale di deprezzamento degli investimenti fissi (macchinari, attrezzature, software, brevetti). Calcolata automaticamente in base agli investimenti inseriti nel Passo 6. Esempio: se hai comprato un computer da €2,000 con ammortamento al 20%, l'ammortamento annuo è €400.",
  other:
    "Altre spese: Costi vari operativi non classificabili nelle altre categorie, spese di viaggio, rappresentanza, manutenzioni, riparazioni, spese legali straordinarie. Esempio: riparazione impianto €500, viaggio cliente €300, spese legali €800.",
  interest:
    "Oneri finanziari: Interessi passivi su prestiti bancari, mutui, linee di credito, finanziamenti, leasing, commissioni bancarie, spese per servizi finanziari. Esempio: prestito €50,000 al 4% annuo = €2,000 di interessi/anno.",
  tax: "Imposte sul reddito: IRES (24% sui redditi delle società) calcolata automaticamente in base al reddito imponibile dopo aver sottratto tutti i costi operativi. Esempio: se il reddito imponibile è €100,000, l'IRES è €24,000.",
};

export default function S8OperatingCost() {
  // Clear localStorage for this step to ensure fresh start
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("smartform-step8");
    }
  }, []);
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

  // Get Year 1 Revenue from Step 7
  const getExpectedRevenue = (): number => {
    const streams = (step7Data as any)?.revenueStreams || [];
    if (Array.isArray(streams) && streams.length > 0) {
      const total = streams.reduce(
        (sum: number, row: any) => sum + (parseEuro(row.amount || "") || 0),
        0
      );
      if (total > 0) {
        console.log("📈 Revenue from streams:", total);
        return total;
      }
    }
    const revenue = extractRevenueValue(step7Data?.expectedRevenue || "0");
    console.log("📈 Revenue calculation:", {
      step7Data: !!step7Data,
      expectedRevenue: step7Data?.expectedRevenue,
      parsedRevenue: revenue,
      streams: streams.length,
    });
    return revenue;
  };

  // Helper function to extract revenue from various string formats
  const extractRevenueValue = (revenueString: string): number => {
    if (!revenueString) return 0;

    const currencyMatches = revenueString.match(/[€$£¥]\s*[\d,]+/g);
    if (currencyMatches && currencyMatches.length > 0) {
      const lastMatch = currencyMatches[currencyMatches.length - 1];
      return extractNumericValue(lastMatch);
    }

    const numberMatches = revenueString.match(/[\d,]+/g);
    if (numberMatches && numberMatches.length > 0) {
      const numbers = numberMatches.map((match) =>
        parseFloat(match.replace(/,/g, ""))
      );
      const largestNumber = Math.max(...numbers);
      if (largestNumber > 1000) {
        return largestNumber;
      }
    }

    if (revenueString.includes("-")) {
      const parts = revenueString.split("-");
      if (parts.length === 2) {
        const higherValue = parts[1].trim();
        return extractNumericValue(higherValue);
      }
    }

    return extractNumericValue(revenueString);
  };

  const extractNumericValue = (currencyString: string): number => {
    if (!currencyString) return 0;
    const numericValue = currencyString.replace(/[€$£¥,\s]/g, "");
    return parseFloat(numericValue) || 0;
  };

  // Calculate amortization from Step 6 investments
  const calculateAmortization = (): number => {
    const list = step6Data?.fixedInvestments || [];
    const sum = list.reduce((acc: number, row: any) => {
      const amt = parseEuro(row.amount || "0");
      const rate = Number(row.amortizationRate || 0);
      return acc + amt * rate;
    }, 0);
    return sum;
  };

  // Calculate automatic interest expenses from Step 9 bank loan
  const calculateInterestExpenses = (): number => {
    const step9Data = getFormData("step9") as any;
    console.log("📊 Step 9 raw data:", step9Data);

    // Try multiple field names to get bank loan amount
    const bankLoan = parseEuro(step9Data?.sources?.bankLoan || step9Data?.bankingSystem || step9Data?.loanAmount || "0") || 0;
    
    // Try multiple field names to get interest rate, default to 5% if not set
    let interestRate = step9Data?.sources?.bankLoanInterestRate || step9Data?.interestRate || 0;
    
    // If no interest rate is set and we have a loan amount, use default 5%
    if (!interestRate && bankLoan > 0) {
      interestRate = 5;
      console.log("💰 Using default 5% interest rate");
    }
    
    // If no loan amount but we're expecting one (user hasn't completed step 9 yet), 
    // estimate with a typical loan amount based on expected revenue
    const expectedRevenue = getExpectedRevenue();
    const estimatedLoanAmount = bankLoan || (expectedRevenue > 0 ? expectedRevenue * 0.3 : 0); // Assume 30% of revenue if no loan specified
    const estimatedInterestRate = interestRate || 5; // Default 5%
    
    const annualInterest = estimatedLoanAmount * (estimatedInterestRate / 100);

    console.log("💰 Interest calculation:", {
      step9DataExists: !!step9Data,
      originalBankLoan: bankLoan,
      estimatedLoanAmount,
      originalInterestRate: step9Data?.sources?.bankLoanInterestRate || step9Data?.interestRate,
      estimatedInterestRate,
      annualInterest,
      calculation: `${estimatedLoanAmount} × (${estimatedInterestRate} / 100) = ${annualInterest}`,
      isEstimate: !bankLoan || !interestRate
    });

    return annualInterest;
  };

  const [form, setForm] = useState<OperatingCostForm>(() => {
    const expectedRevenue = getExpectedRevenue();
    const amortizationAmount = calculateAmortization();
    const interestExpenses = calculateInterestExpenses();

    // Helper: calculate total cost from % of revenue
    const calcFromPercent = (pct: string) => {
      const percentageValue = parseItalianNumber(pct.replace("%", "")) || 0;
      const totalCost = (percentageValue / 100) * expectedRevenue;
      return formatEuro(totalCost, { decimals: 2 });
    };

    // Calculate initial tax amount (24% IRES on taxable income)
    const calculateInitialTax = () => {
      // Calculate percentage-based costs
      const percentageCostsTotal =
        ((30 + // COGS 30%
          20 + // Salaries 20%
          5 + // Marketing 5%
          1 + // Rent 1%
          2 + // Admin 2%
          1) / // Other 1%
          100) *
        expectedRevenue;

      // Add fixed costs: amortization + interest from Step 9
      const totalOtherCosts =
        percentageCostsTotal + amortizationAmount + interestExpenses;

      console.log("🧮 Initial tax calculation:", {
        expectedRevenue,
        percentageCostsTotal,
        amortizationAmount,
        interestExpenses,
        totalOtherCosts,
        taxableIncome: Math.max(0, expectedRevenue - totalOtherCosts),
        taxAmount: Math.max(0, expectedRevenue - totalOtherCosts) * 0.24,
      });

      const taxableIncome = Math.max(0, expectedRevenue - totalOtherCosts);
      const taxAmount = taxableIncome * 0.24; // 24% IRES
      return formatEuro(taxAmount, { decimals: 2 });
    };

    const defaultForm: OperatingCostForm = {
      operatingCostItems: [
        {
          id: "cogs",
          name: "Costo del Venduto (COGS)",
          percentage: "30%",
          totalCost: calcFromPercent("30%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "salaries",
          name: "Stipendi e salari dipendenti",
          percentage: "20%",
          totalCost: calcFromPercent("20%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "marketing",
          name: "Spese di marketing e pubblicità",
          percentage: "5%",
          totalCost: calcFromPercent("5%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "rent",
          name: "Affitti",
          percentage: "1%",
          totalCost: calcFromPercent("1%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "admin",
          name: "Amministrazione generale",
          percentage: "2%",
          totalCost: calcFromPercent("2%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "amortization",
          name: "Ammortamenti",
          percentage: "-",
          totalCost: formatEuro(amortizationAmount, { decimals: 2 }),
          isAutoCalculated: true,
          showTooltip: false,
        },
        {
          id: "other",
          name: "Altre spese",
          percentage: "1%",
          totalCost: calcFromPercent("1%"),
          isAutoCalculated: false,
          showTooltip: false,
        },
        {
          id: "interest",
          name: "Oneri finanziari",
          percentage: "-",
          totalCost: formatEuro(interestExpenses, { decimals: 2 }),
          isAutoCalculated: true,
          showTooltip: false,
        },
        {
          id: "tax",
          name: "Imposte sul reddito",
          percentage: "24%",
          totalCost: calculateInitialTax(),
          isAutoCalculated: true,
          showTooltip: false,
        },
      ],
      supplierPayments: {
        immediateCollection: "70%",
        collection60Days: "20%",
        collection90Days: "10%",
      },
      totalOperatingCosts: formatEuro(0, { decimals: 2 }),
      netProfit: formatEuro(0, { decimals: 2 }),
      profitMargin: "0%",
    };

    // Always use default form to ensure correct structure
    // Remove this to use persisted data: if (persistedData) { ... }
    return defaultForm;
  });

  // Calculate totals
  const calculateTotals = () => {
    const expectedRevenue = getExpectedRevenue();
    const interestExpenses = calculateInterestExpenses();

    // Calculate all operating costs
    const allOperatingCosts = form.operatingCostItems.reduce((total, item) => {
      if (item.isAutoCalculated && item.id === "amortization") {
        return total + extractNumericValue(item.totalCost);
      } else if (item.isAutoCalculated && item.id === "interest") {
        return total + interestExpenses;
      } else if (item.isAutoCalculated && item.id === "tax") {
        // For tax, calculate based on taxable income
        const otherCosts = form.operatingCostItems
          .filter((otherItem) => otherItem.id !== "tax")
          .reduce((otherTotal, otherItem) => {
            if (otherItem.isAutoCalculated && otherItem.id === "amortization") {
              return otherTotal + extractNumericValue(otherItem.totalCost);
            } else if (
              otherItem.isAutoCalculated &&
              otherItem.id === "interest"
            ) {
              return otherTotal + interestExpenses;
            } else if (!otherItem.isAutoCalculated) {
              const otherPct =
                parseItalianNumber(otherItem.percentage.replace("%", "")) || 0;
              return otherTotal + (otherPct / 100) * expectedRevenue;
            }
            return otherTotal;
          }, 0);
        const taxableIncome = Math.max(0, expectedRevenue - otherCosts);
        const pct = 24; // Fixed 24% IRES
        return total + (pct / 100) * taxableIncome;
      } else {
        const pct = parseItalianNumber(item.percentage.replace("%", "")) || 0;
        return total + (pct / 100) * expectedRevenue;
      }
    }, 0);

    // Net profit and margin
    const netProfit = expectedRevenue - allOperatingCosts;
    const profitMargin =
      expectedRevenue > 0 ? (netProfit / expectedRevenue) * 100 : 0;

    // For backwards compatibility, also calculate the old way
    const operatingCostsExcludingTax = form.operatingCostItems
      .filter((item) => item.id !== "tax")
      .reduce((total, item) => {
        if (item.isAutoCalculated) {
          return total + extractNumericValue(item.totalCost);
        } else {
          const pct = parseFloat(item.percentage.replace("%", "")) || 0;
          return total + (pct / 100) * expectedRevenue;
        }
      }, 0);
    const taxableIncome = Math.max(
      0,
      expectedRevenue - operatingCostsExcludingTax
    );
    const incomeTax = extractNumericValue(
      form.operatingCostItems.find((item) => item.id === "tax")?.totalCost ||
        "0"
    );
    const totalCosts = allOperatingCosts;

    return {
      incomeTax,
      totalCosts,
      netProfit,
      profitMargin,
    };
  };

  // Update item costs when percentages change
  const handlePercentageChange = (id: string, value: string) => {
    // Allow user to type freely, only format on blur or when complete
    const expectedRevenue = getExpectedRevenue();
    let totalCost = 0;

    // Extract numeric value for calculation
    let numericValue = value.replace("%", "").trim();
    let parsedValue = parseItalianNumber(numericValue) || 0;

    if (id === "tax") {
      // For tax, calculate based on taxable income (revenue minus other costs)
      const otherCosts = form.operatingCostItems
        .filter((item) => item.id !== "tax")
        .reduce((total, item) => {
          if (item.isAutoCalculated && item.id === "amortization") {
            return total + extractNumericValue(item.totalCost);
          } else if (!item.isAutoCalculated) {
            const pct =
              parseItalianNumber(item.percentage.replace("%", "")) || 0;
            return total + (pct / 100) * expectedRevenue;
          }
          return total;
        }, 0);
      const taxableIncome = Math.max(0, expectedRevenue - otherCosts);
      totalCost = (24 / 100) * taxableIncome; // Fixed 24% IRES
    } else {
      totalCost = (parsedValue / 100) * expectedRevenue;
    }

    // Update the current item and also recalculate tax if this change affects taxable income
    setForm((prev) => {
      const updatedItems = prev.operatingCostItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            percentage: value, // Keep raw input value
            totalCost: formatEuro(totalCost, { decimals: 2 }),
          };
        }
        return item;
      });

      // If this change affects taxable income, recalculate tax immediately
      if (id !== "tax") {
        const amortizationAmount = calculateAmortization();
        const otherCosts = updatedItems
          .filter((item) => item.id !== "tax")
          .reduce((total, item) => {
            if (item.isAutoCalculated && item.id === "amortization") {
              return total + amortizationAmount;
            } else if (item.isAutoCalculated && item.id === "interest") {
              return total + calculateInterestExpenses();
            } else if (!item.isAutoCalculated) {
              const pct =
                parseItalianNumber(item.percentage.replace("%", "")) || 0;
              return total + (pct / 100) * expectedRevenue;
            }
            return total;
          }, 0);

        const taxableIncome = Math.max(0, expectedRevenue - otherCosts);
        const taxAmount = (24 / 100) * taxableIncome;

        // Update tax item
        const finalItems = updatedItems.map((item) =>
          item.id === "tax"
            ? { ...item, totalCost: formatEuro(taxAmount, { decimals: 2 }) }
            : item
        );

        return {
          ...prev,
          operatingCostItems: finalItems,
        };
      }

      return {
        ...prev,
        operatingCostItems: updatedItems,
      };
    });
  };

  // Format percentage on blur (when user finishes typing)
  const handlePercentageBlur = (id: string, value: string) => {
    let numericValue = value.replace("%", "").trim();
    let parsedValue = parseItalianNumber(numericValue);

    // Format to Italian style with % if valid number
    let formattedValue = value;
    if (numericValue && !isNaN(parsedValue) && parsedValue > 0) {
      formattedValue = `${formatItalianNumber(
        parsedValue,
        parsedValue % 1 === 0 ? 0 : 1
      )}%`;
    } else if (numericValue === "" || parsedValue === 0) {
      formattedValue = "0%";
    }

    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) =>
        item.id === id
          ? {
              ...item,
              percentage: formattedValue,
            }
          : item
      ),
    }));
  };

  const handleSupplierPaymentChange = (
    field: keyof SupplierPayments,
    value: string
  ) => {
    // Allow user to type freely, keep raw input
    setForm((prev) => ({
      ...prev,
      supplierPayments: {
        ...prev.supplierPayments,
        [field]: value,
      },
    }));
  };

  // Format supplier payment on blur
  const handleSupplierPaymentBlur = (
    field: keyof SupplierPayments,
    value: string
  ) => {
    let numericValue = value.replace("%", "").trim();
    let parsedValue = parseItalianNumber(numericValue);

    // Format to Italian style with % if valid number
    let formattedValue = value;
    if (numericValue && !isNaN(parsedValue) && parsedValue > 0) {
      formattedValue = `${formatItalianNumber(
        parsedValue,
        parsedValue % 1 === 0 ? 0 : 1
      )}%`;
    } else if (numericValue === "" || parsedValue === 0) {
      formattedValue = "0%";
    }

    setForm((prev) => ({
      ...prev,
      supplierPayments: {
        ...prev.supplierPayments,
        [field]: formattedValue,
      },
    }));
  };

  const toggleTooltip = (id: string) => {
    console.log(
      "Toggling tooltip for:",
      id,
      "Available tooltips:",
      Object.keys(TOOLTIP_MAP)
    );
    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) =>
        item.id === id
          ? { ...item, showTooltip: !item.showTooltip }
          : { ...item, showTooltip: false }
      ),
    }));
  };

  // Handle ESC key to close tooltip
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setForm((prev) => ({
          ...prev,
          operatingCostItems: prev.operatingCostItems.map((item) => ({
            ...item,
            showTooltip: false,
          }))
        }));
      }
    };

    // Only add listener if any tooltip is showing
    const anyTooltipShowing = form.operatingCostItems.some(item => item.showTooltip);
    if (anyTooltipShowing) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [form.operatingCostItems]);

  // Recalculate when revenue or items change
  useEffect(() => {
    const expectedRevenue = getExpectedRevenue();
    const amortizationAmount = calculateAmortization();
    const interestExpenses = calculateInterestExpenses();
    const totals = calculateTotals();

    setForm((prev) => {
      const updatedItems = prev.operatingCostItems.map((item) => {
        if (item.id === "amortization") {
          return {
            ...item,
            totalCost: formatEuro(amortizationAmount, { decimals: 2 }),
          };
        } else if (item.id === "interest") {
          return {
            ...item,
            totalCost: formatEuro(interestExpenses, { decimals: 2 }),
          };
        } else if (item.id === "tax") {
          // Tax calculation based on taxable income and percentage
          const otherCosts = prev.operatingCostItems
            .filter((otherItem) => otherItem.id !== "tax")
            .reduce((otherTotal, otherItem) => {
              if (
                otherItem.isAutoCalculated &&
                otherItem.id === "amortization"
              ) {
                return otherTotal + amortizationAmount;
              } else if (
                otherItem.isAutoCalculated &&
                otherItem.id === "interest"
              ) {
                return otherTotal + interestExpenses;
              } else if (!otherItem.isAutoCalculated) {
                const otherPct =
                  parseItalianNumber(otherItem.percentage.replace("%", "")) ||
                  0;
                return otherTotal + (otherPct / 100) * expectedRevenue;
              }
              return otherTotal;
            }, 0);
          const taxableIncome = Math.max(0, expectedRevenue - otherCosts);
          const taxPct = 24; // Fixed 24% IRES
          const taxAmount = (taxPct / 100) * taxableIncome;

          // Debug logging
          console.log("Tax calculation:", {
            expectedRevenue,
            otherCosts,
            taxableIncome,
            taxPct,
            taxAmount,
          });

          return {
            ...item,
            totalCost: formatEuro(taxAmount, { decimals: 2 }),
          };
        } else if (!item.isAutoCalculated) {
          const pct = parseItalianNumber(item.percentage.replace("%", "")) || 0;
          const totalCost = (pct / 100) * expectedRevenue;
          return {
            ...item,
            totalCost: formatEuro(totalCost, { decimals: 2 }),
          };
        }
        return item;
      });

      return {
        ...prev,
        operatingCostItems: updatedItems,
        totalOperatingCosts: formatEuro(totals.totalCosts, { decimals: 2 }),
        netProfit: formatEuro(totals.netProfit, { decimals: 2 }),
        profitMargin: `${totals.profitMargin.toFixed(1)}%`,
      };
    });
  }, [
    step7Data?.expectedRevenue,
    step6Data?.fixedInvestments,
    JSON.stringify(getFormData("step9")), // Stringify to detect deep changes
  ]);

  // Additional real-time listener for Step 9 changes
  useEffect(() => {
    const step9Data = getFormData("step9") as any;
    const interestExpenses = calculateInterestExpenses();
    
    // Update interest expenses item immediately when Step 9 data changes
    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) =>
        item.id === "interest"
          ? { ...item, totalCost: formatEuro(interestExpenses, { decimals: 2 }) }
          : item
      )
    }));
    
    console.log("🔄 Real-time interest update:", {
      step9Changes: !!step9Data,
      newInterestExpenses: interestExpenses,
      formattedAmount: formatEuro(interestExpenses, { decimals: 2 })
    });
  }, [
    JSON.stringify((getFormData("step9") as any)?.sources),
    JSON.stringify((getFormData("step9") as any)?.bankingSystem),
    JSON.stringify((getFormData("step9") as any)?.interestRate),
    JSON.stringify((getFormData("step9") as any)?.loanAmount)
  ]);

  // Listen for storage changes (when user navigates back from Step 9 or other updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('smartform-step9') || e.key === 'smartform-step9') {
        console.log('📋 Storage change detected for Step 9:', e.key);
        // Trigger a recalculation
        const interestExpenses = calculateInterestExpenses();
        setForm((prev) => ({
          ...prev,
          operatingCostItems: prev.operatingCostItems.map((item) =>
            item.id === "interest"
              ? { ...item, totalCost: formatEuro(interestExpenses, { decimals: 2 }) }
              : item
          )
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dedicated tax recalculation for real-time updates
  useEffect(() => {
    const expectedRevenue = getExpectedRevenue();
    const amortizationAmount = calculateAmortization();
    const interestExpenses = calculateInterestExpenses();

    // Calculate other costs (excluding tax)
    const otherCosts = form.operatingCostItems
      .filter((item) => item.id !== "tax")
      .reduce((total, item) => {
        if (item.isAutoCalculated && item.id === "amortization") {
          return total + amortizationAmount;
        } else if (item.isAutoCalculated && item.id === "interest") {
          return total + interestExpenses;
        } else if (!item.isAutoCalculated) {
          const pct = parseItalianNumber(item.percentage.replace("%", "")) || 0;
          return total + (pct / 100) * expectedRevenue;
        }
        return total;
      }, 0);

    const taxableIncome = Math.max(0, expectedRevenue - otherCosts);
    const taxAmount = (24 / 100) * taxableIncome; // 24% IRES
    const newTaxCost = formatEuro(taxAmount, { decimals: 2 });

    console.log("💸 Dedicated tax recalculation:", {
      expectedRevenue,
      amortizationAmount,
      interestExpenses,
      otherCosts,
      taxableIncome,
      taxAmount,
      newTaxCost,
    });

    // Update tax if amount has changed
    const currentTaxItem = form.operatingCostItems.find(
      (item) => item.id === "tax"
    );
    if (
      currentTaxItem &&
      currentTaxItem.totalCost !== newTaxCost &&
      taxAmount > 0
    ) {
      setForm((prev) => ({
        ...prev,
        operatingCostItems: prev.operatingCostItems.map((item) =>
          item.id === "tax" ? { ...item, totalCost: newTaxCost } : item
        ),
      }));
    }
  }, [
    form.operatingCostItems
      .filter((item) => item.id !== "tax")
      .map((item) => item.percentage)
      .join(","),
    step7Data?.expectedRevenue,
    step6Data?.fixedInvestments,
    JSON.stringify(getFormData("step9")), // Include all step 9 data
  ]);

  // Sync with context
  useEffect(() => {
    updateFormData("step8", form);
  }, [form, updateFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expectedRevenue = getExpectedRevenue();

    // Calculate accounts payable based on supplier payment deferrals
    const calculateAccountsPayable = () => {
      const collection60Pct =
        parseItalianNumber(
          form.supplierPayments.collection60Days.replace("%", "") || "0"
        ) / 100;
      const collection90Pct =
        parseItalianNumber(
          form.supplierPayments.collection90Days.replace("%", "") || "0"
        ) / 100;

      // Calculate deferrals impact on accounts payable
      const deferredPayments60 = expectedRevenue * collection60Pct * (60 / 365);
      const deferredPayments90 = expectedRevenue * collection90Pct * (90 / 365);

      return deferredPayments60 + deferredPayments90;
    };

    // Build accounting mapping
    const accountingMapping = {
      contoEconomicoAValoreAggiunto: {
        costiOperativi: {
          costoDelVenduto: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "cogs")?.totalCost ||
              "0"
          ),
          stipendiSalari: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "salaries")
              ?.totalCost || "0"
          ),
          marketingPubblicita: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "marketing")
              ?.totalCost || "0"
          ),
          affitti: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "rent")?.totalCost ||
              "0"
          ),
          amministrazioneGenerale: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "admin")?.totalCost ||
              "0"
          ),
          ammortamenti: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "amortization")
              ?.totalCost || "0"
          ),
          altreSpese: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "other")?.totalCost ||
              "0"
          ),
          oneriFinanziari: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "interest")
              ?.totalCost || "0"
          ),
          imposte: extractNumericValue(
            form.operatingCostItems.find((i) => i.id === "tax")?.totalCost ||
              "0"
          ),
        },
      },
      statoPatrimoniale: {
        debitiVsFornitori: calculateAccountsPayable(),
      },
    };

    const formData = {
      ...form,
      expectedRevenue,
      accountingMapping,
    };

    updateFormData("step8", formData);

    const isValid = validateStep(7); // 0-based index for step 8

    if (isValid) {
      console.log("Operating Costs Form Submitted:", formData);
      console.log("Accounting Mapping:", accountingMapping);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
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
                {/* Question */}
                <div>
                  <label className="text-[24px] font-medium text-accent mb-6 block">
                    Quali sono i tuoi costi operativi?
                  </label>
                  <p className="text-sm text-gray-600 mb-8">
                    Ricavi annui previsti dal Passo 7:{" "}
                    <strong>
                      {formatEuro(getExpectedRevenue(), { decimals: 2 })}
                    </strong>
                  </p>
                </div>

                {/* Operating Costs Table */}
                <div className="overflow-x-auto overflow-y-visible">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left text-[1rem] font-medium text-accent w-2/5">
                          Tipologia di costi
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-center text-[1rem] font-medium text-accent w-1/5">
                          % sui ricavi
                          <br />
                          <span className="text-sm font-normal">
                            (preimpostato ma modificabile)
                          </span>
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-center text-[1rem] font-medium text-accent w-2/5">
                          Importo totale
                          <br />
                          <span className="text-sm font-normal">
                            (calcolato automaticamente)
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.operatingCostItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-25">
                          <td className="border border-gray-200 px-4 py-3 relative overflow-visible">
                            <div className="flex items-center gap-2">
                              <span className="text-[1rem] text-accent">
                                {item.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTooltip(item.id)}
                                className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200 transition-colors"
                              >
                                i
                              </button>
                            </div>
                            {item.showTooltip && (
                              <>
                                {/* Invisible overlay to detect clicks outside */}
                                <div 
                                  className="fixed inset-0 z-40"
                                  onClick={() => {
                                    setForm((prev) => ({
                                      ...prev,
                                      operatingCostItems: prev.operatingCostItems.map((tooltipItem) => ({
                                        ...tooltipItem,
                                        showTooltip: false,
                                      }))
                                    }));
                                  }}
                                />
                                {/* Tooltip popup with smart positioning */}
                                <div className={`absolute z-50 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-md w-80 text-sm text-gray-700 ${
                                  // Check if this is one of the last items that might be cut off
                                  ['interest', 'tax', 'other'].includes(item.id)
                                    ? 'bottom-8 right-0' // Position above and to the right for last items
                                    : 'top-8 left-0' // Position below and to the left for first items
                                }`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-accent text-base">
                                      {item.name}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setForm((prev) => ({
                                          ...prev,
                                          operatingCostItems: prev.operatingCostItems.map((tooltipItem) => ({
                                            ...tooltipItem,
                                            showTooltip: false,
                                          }))
                                        }));
                                      }}
                                      className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <p className="leading-relaxed">
                                    {TOOLTIP_MAP[item.id] ||
                                      `Informazioni non disponibili per ${
                                        item.id
                                      }. Available keys: ${Object.keys(
                                        TOOLTIP_MAP
                                      ).join(", ")}`}
                                  </p>
                                  {/* Tooltip arrow - adjust position based on tooltip placement */}
                                  <div className={`absolute w-0 h-0 ${
                                    ['interest', 'tax', 'other'].includes(item.id)
                                      ? 'top-4 -right-2 border-l-4 border-t-4 border-b-4 border-t-transparent border-b-transparent border-l-white' // Arrow pointing right when tooltip is above and to the right
                                      : 'bottom-4 -left-2 border-r-4 border-t-4 border-b-4 border-t-transparent border-b-transparent border-r-white' // Arrow pointing left when tooltip is below and to the left
                                  }`}></div>
                                </div>
                              </>
                            )}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            {item.isAutoCalculated ? (
                              <span className="text-[1rem] text-gray-500 italic">
                                {item.id === "amortization"
                                  ? "Calcolato automaticamente dagli investimenti"
                                  : item.id === "interest"
                                  ? "Calcolato automaticamente dal prestito bancario (Step 9)"
                                  : item.id === "tax"
                                  ? "Calcolato automaticamente (24% IRES)"
                                  : item.percentage}
                              </span>
                            ) : (
                              <input
                                type="text"
                                value={item.percentage}
                                onChange={(e) =>
                                  handlePercentageChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                onBlur={(e) =>
                                  handlePercentageBlur(item.id, e.target.value)
                                }
                                className="w-20 px-3 py-1 text-center border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-blue-50 hover:bg-blue-100 transition-colors"
                                placeholder="es. 1,5%"
                              />
                            )}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className="text-[1rem] font-medium text-accent">
                              {item.totalCost}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                {/* Supplier Payments Section */}
                <div className="mt-12 space-y-6 border-t border-gray-200 pt-8">
                  <div>
                    <h3 className="text-[1.2rem] font-semibold text-accent mb-2">
                      Pagamenti Fornitori (Debiti vs. Fornitori)
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Indica come incassi i tuoi ricavi per calcolare l'impatto
                      sui debiti verso fornitori
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <label className="block text-[1rem] font-medium text-accent mb-2 min-h-[3rem] flex items-start">
                        Che percentuale dei tuoi ricavi viene incassata
                        immediatamente (contanti o entro 30 giorni)?
                      </label>
                      <input
                        type="text"
                        value={form.supplierPayments.immediateCollection}
                        onChange={(e) =>
                          handleSupplierPaymentChange(
                            "immediateCollection",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSupplierPaymentBlur(
                            "immediateCollection",
                            e.target.value
                          )
                        }
                        placeholder="70% o 70,5%"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-[1rem] font-medium text-accent mb-2 min-h-[3rem] flex items-start">
                        Ritardo di 60 giorni:
                      </label>
                      <input
                        type="text"
                        value={form.supplierPayments.collection60Days}
                        onChange={(e) =>
                          handleSupplierPaymentChange(
                            "collection60Days",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSupplierPaymentBlur(
                            "collection60Days",
                            e.target.value
                          )
                        }
                        placeholder="20% o 20,5%"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-[1rem] font-medium text-accent mb-2 min-h-[3rem] flex items-start">
                        Ritardo di 90 giorni:
                      </label>
                      <input
                        type="text"
                        value={form.supplierPayments.collection90Days}
                        onChange={(e) =>
                          handleSupplierPaymentChange(
                            "collection90Days",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSupplierPaymentBlur(
                            "collection90Days",
                            e.target.value
                          )
                        }
                        placeholder="10% o 10,5%"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div
                    className={`text-sm p-3 rounded-lg transition-colors ${(() => {
                      const total =
                        parseItalianNumber(
                          form.supplierPayments.immediateCollection.replace(
                            "%",
                            ""
                          ) || "0"
                        ) +
                        parseItalianNumber(
                          form.supplierPayments.collection60Days.replace(
                            "%",
                            ""
                          ) || "0"
                        ) +
                        parseItalianNumber(
                          form.supplierPayments.collection90Days.replace(
                            "%",
                            ""
                          ) || "0"
                        );
                      return total === 100
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700";
                    })()}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        Totale percentuale:{" "}
                        {formatItalianNumber(
                          parseItalianNumber(
                            form.supplierPayments.immediateCollection.replace(
                              "%",
                              ""
                            ) || "0"
                          ) +
                            parseItalianNumber(
                              form.supplierPayments.collection60Days.replace(
                                "%",
                                ""
                              ) || "0"
                            ) +
                            parseItalianNumber(
                              form.supplierPayments.collection90Days.replace(
                                "%",
                                ""
                              ) || "0"
                            ),
                          0
                        )}
                        % (dovrebbe essere 100%)
                      </p>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${(() => {
                            const total =
                              parseItalianNumber(
                                form.supplierPayments.immediateCollection.replace(
                                  "%",
                                  ""
                                ) || "0"
                              ) +
                              parseItalianNumber(
                                form.supplierPayments.collection60Days.replace(
                                  "%",
                                  ""
                                ) || "0"
                              ) +
                              parseItalianNumber(
                                form.supplierPayments.collection90Days.replace(
                                  "%",
                                  ""
                                ) || "0"
                              );
                            return total === 100
                              ? "bg-green-500"
                              : total > 100
                              ? "bg-red-500"
                              : "bg-yellow-500";
                          })()}`}
                          style={{
                            width: `${Math.min(
                              100,
                              parseItalianNumber(
                                form.supplierPayments.immediateCollection.replace(
                                  "%",
                                  ""
                                ) || "0"
                              ) +
                                parseItalianNumber(
                                  form.supplierPayments.collection60Days.replace(
                                    "%",
                                    ""
                                  ) || "0"
                                ) +
                                parseItalianNumber(
                                  form.supplierPayments.collection90Days.replace(
                                    "%",
                                    ""
                                  ) || "0"
                                )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                      <h4 className="text-[1rem] font-medium text-accent mb-2">
                        Costi Operativi Totali
                      </h4>
                      <p className="text-xl font-bold text-red-700">
                        {form.totalOperatingCosts}
                      </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                      <h4 className="text-[1rem] font-medium text-accent mb-2">
                        Profitto Netto
                      </h4>
                      <p className="text-xl font-bold text-green-700">
                        {form.netProfit}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-[1rem] font-medium text-accent mb-2">
                        Margine di Profitto
                      </h4>
                      <p className="text-xl font-bold text-blue-700">
                        {form.profitMargin}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full cursor-pointer py-3 bg-white border border-gray-400 text-accent text-[1rem] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Indietro
                  </button>
                  <button
                    type="submit"
                    className="w-full cursor-pointer py-3 bg-primary text-white text-[1rem] font-semibold rounded-lg hover:bg-primary/90 transition-colors"
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
