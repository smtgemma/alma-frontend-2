"use client";

import { useState, useEffect, useRef } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";

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
      // Add showOptions property to existing items if not present
      const updatedItems = persistedData.operatingCostItems.map((item) => ({
        ...item,
        showOptions: false,
      }));
      return { ...persistedData, operatingCostItems: updatedItems };
    }

    // Calculate initial total investment for default values
    const initialInvestment = step6Data?.investmentItems 
      ? step6Data.investmentItems.reduce((total: number, item: any) => {
          const amount = parseFloat(item.amount) || 0;
          return total + amount;
        }, 0)
      : 100000; // Default fallback

      console.log(initialInvestment);

    // Helper function to calculate default total cost based on percentage
    const calculateDefaultTotalCost = (percentage: string): string => {
      const percentageValue = parseFloat(percentage.replace('%', '')) || 0;
      const totalCost = (percentageValue / 100) * initialInvestment;
      return `€${totalCost.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    };
    console.log(calculateDefaultTotalCost);

    return {
      operatingCosts: "",
      operatingCostItems: [
        {
          id: "1",
          name: "Marketing and advertising expenses",
          percentage: "50%",
          totalCost: calculateDefaultTotalCost("50%"),
          showOptions: false,
        },
        {
          id: "2",
          name: "Employee salaries and wages",
          percentage: "30%",
          totalCost: calculateDefaultTotalCost("30%"),
          showOptions: false,
        },
        {
          id: "3",
          name: "Rent",
          percentage: "50%",
          totalCost: calculateDefaultTotalCost("50%"),
          showOptions: false,
        },
        {
          id: "4",
          name: "General administrations",
          percentage: "30%",
          totalCost: calculateDefaultTotalCost("30%"),
          showOptions: false,
        },
        {
          id: "5",
          name: "Accounting",
          percentage: "50%",
          totalCost: calculateDefaultTotalCost("50%"),
          showOptions: false,
        },
        {
          id: "6",
          name: "Other expenses",
          percentage: "30%",
          totalCost: calculateDefaultTotalCost("30%"),
          showOptions: false,
        },
        {
          id: "7",
          name: "Income tax",
          percentage: "50%",
          totalCost: calculateDefaultTotalCost("50%"),
          showOptions: false,
        },
        {
          id: "8",
          name: "Interest expenses",
          percentage: "30%",
          totalCost: calculateDefaultTotalCost("30%"),
          showOptions: false,
        },
        {
          id: "9",
          name: "Other expenses",
          percentage: "50%",
          totalCost: calculateDefaultTotalCost("50%"),
          showOptions: false,
        },
      ],
      firstYearTotalCost: "€0",
      firstYearNetProfit: "€0",
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
      const numbers = numberMatches.map(match => parseFloat(match.replace(/,/g, '')));
      const largestNumber = Math.max(...numbers);
      if (largestNumber > 1000) { // Assume it's a revenue amount if > 1000
        return largestNumber;
      }
    }
    
    // Handle range formats like "€50,000 - €150,000"
    if (revenueString.includes('-')) {
      // Extract the higher value from the range for conservative estimation
      const parts = revenueString.split('-');
      if (parts.length === 2) {
        const higherValue = parts[1].trim();
        return extractNumericValue(higherValue);
      }
    }
    
    // Handle "Under €50,000" format
    if (revenueString.toLowerCase().includes('under')) {
      const value = revenueString.replace(/under/gi, '').trim();
      return extractNumericValue(value);
    }
    
    // Handle "Over €500,000" format
    if (revenueString.toLowerCase().includes('over')) {
      const value = revenueString.replace(/over/gi, '').trim();
      return extractNumericValue(value);
    }
    
    // Handle direct currency values like "€100,000"
    return extractNumericValue(revenueString);
  };

  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return `€${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
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

  // Calculate total initial investment from step6 data
  // This is used as the base for calculating operating cost percentages
  const calculateTotalInitialInvestment = (): number => {
    if (!step6Data?.investmentItems) return 100000; // Default fallback
    return step6Data.investmentItems.reduce((total: number, item: any) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  // Calculate total cost for an item based on percentage and Total Initial Investment
  // Formula: (percentage / 100) * Total Initial Investment from S6InvestmentPlan
  const calculateItemTotalCost = (
    percentage: string,
    totalInitialInvestment: number
  ): number => {
    const percentageValue = extractPercentageValue(percentage);
    return (percentageValue / 100) * totalInitialInvestment;
  };

  // Calculate all summary values
  const calculateSummaryValues = (
    operatingCostItems: OperatingCostItem[],
    totalInitialInvestment: number
  ) => {
    // Calculate total operating costs
    const totalOperatingCosts = operatingCostItems.reduce((total, item) => {
      const itemCost = calculateItemTotalCost(item.percentage, totalInitialInvestment);
      return total + itemCost;
    }, 0);

    // Get expected revenue from step7 for net profit calculation
    // If no revenue is set in S7, use a higher default to avoid negative profits
    const expectedRevenue = extractRevenueValue(
      step7Data?.expectedRevenue || "€500,000"
    );

    // Debug logging
    console.log("=== REVENUE DEBUG ===");
    console.log("Step7 Data:", step7Data);
    console.log("Expected Revenue from S7:", step7Data?.expectedRevenue);
    console.log("Extracted Revenue Value:", expectedRevenue);
    console.log("Total Operating Costs:", totalOperatingCosts);
    console.log("===================");

    // Calculate net profit
    const netProfit = expectedRevenue - totalOperatingCosts;

    // Calculate profit margin
    const profitMargin =
      expectedRevenue > 0 ? (netProfit / expectedRevenue) * 100 : 0;

    console.log("Net Profit:", netProfit);
    console.log("Profit Margin:", profitMargin);

    return {
      totalCost: formatCurrency(totalOperatingCosts),
      netProfit: formatCurrency(netProfit),
      profitMargin: formatPercentage(profitMargin),
    };
  };

  // Update item total cost when percentage changes
  const updateItemTotalCost = (id: string, percentage: string) => {
    const totalInitialInvestment = calculateTotalInitialInvestment();
    const totalCost = calculateItemTotalCost(percentage, totalInitialInvestment);

    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) =>
        item.id === id
          ? { ...item, percentage, totalCost: formatCurrency(totalCost) }
          : item
      ),
    }));
  };

  // Recalculate all item costs when total initial investment changes
  const recalculateAllItemCosts = () => {
    const totalInitialInvestment = calculateTotalInitialInvestment();
    
    setForm((prev) => ({
      ...prev,
      operatingCostItems: prev.operatingCostItems.map((item) => {
        const totalCost = calculateItemTotalCost(item.percentage, totalInitialInvestment);
        return { ...item, totalCost: formatCurrency(totalCost) };
      }),
    }));
  };

  // Update all summary calculations
  const updateSummaryCalculations = () => {
    const totalInitialInvestment = calculateTotalInitialInvestment();
    const summary = calculateSummaryValues(
      form.operatingCostItems,
      totalInitialInvestment
    );

    setForm((prev) => ({
      ...prev,
      firstYearTotalCost: summary.totalCost,
      firstYearNetProfit: summary.netProfit,
      netProfitMargin: summary.profitMargin,
    }));
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

  // Sync form changes with context
  useEffect(() => {
    updateFormData("step8", form);
  }, [form, updateFormData]);

  // Update calculations when step6 or step7 data changes or form items change
  useEffect(() => {
    // Recalculate all item costs when investment data changes
    recalculateAllItemCosts();
  }, [step6Data?.investmentItems]);

  // Update summary calculations when operating cost items or revenue changes
  useEffect(() => {
    updateSummaryCalculations();
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
      const formattedPercentage = value.includes('%') ? value : `${value}%`;
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
      console.log("Operating Cost Form Submitted:", form);
      nextStep();
    } else {
      console.log("Validation failed, showing errors:", errors);
      // Errors are already set by validateStep, they will be displayed automatically
    }
  };

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Step 08 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Operating Costs
            </h2>
          </div>

          {/* Form */}
          <div className="p-4 md:p-8 relative">
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
                {/* Question: What are your operating costs? */}
                <div>
                  <label className="text-[24px] font-medium text-accent">
                    What are your operating costs?
                  </label>
                  <div className="mt-12 border-b border-b-[#888888]/30 ">
                    <h1 className="question-text pb-2">
                      Input Annual Operating Expenses (Edit percentages or leave
                      as is):
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
                            Operating Cost Item
                          </th>
                          <th className="text-center py-3 px-2 mx-4 text-[1rem] font-medium text-accent w-1/4 border-b border-b-[#888888]/30">
                            % of Revenue
                            <br />
                            <span className="text-sm font-normal">
                              (pre-set but changeable)
                            </span>
                          </th>
                          <th className="text-center py-3 px-2 mx-4 text-[1rem] font-medium text-accent w-1/4 border-b border-b-[#888888]/30">
                            Total Cost
                            <br />
                            <span className="text-sm font-normal">
                              (automatically calculated)
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.operatingCostItems.map((item, index) => (
                          <tr key={item.id}>
                            <td className="py-3 px-4 w-1/2">
                              <span className="text-[1rem] font-normal text-accent">
                                {item.name}
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
                        Your first year total cost is:
                      </span>
                      <span className="text-lg font-bold  text-accent">
                        {form.firstYearTotalCost}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start py-2">
                      <span className="question-text">
                        Your first year net profit is:
                      </span>
                      <span className="text-lg font-bold  text-accent">
                        {form.firstYearNetProfit}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start py-2">
                      <span className="question-text">
                        Your net profit margin is:
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
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
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
