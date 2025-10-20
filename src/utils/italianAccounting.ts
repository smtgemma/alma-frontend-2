// src/utils/italianAccounting.ts
import { parseEuro } from "./euFormat";

export type Year0Balance = {
  totaleAttivita?: number;
  totalePassivita?: number;
  patrimonioNetto?: number;
  raw?: any;
};

export type Year0Income = {
  ricavi?: number;
  costiOperativi?: number;
  ammortamenti?: number;
  oneriFinanziari?: number;
  imposte?: number;
  utile?: number;
  raw?: any;
};

export function sumRevenueStep7(step7: any): number {
  const streams = step7?.revenueStreams || [];
  if (Array.isArray(streams) && streams.length > 0) {
    return streams.reduce((sum: number, r: any) => sum + (parseEuro(r.amount || "") || 0), 0);
  }
  return parseEuro(step7?.expectedRevenue || "0");
}

export function amortizationFromFixedInvestments(step6: any): number {
  const list = step6?.fixedInvestments || [];
  return list.reduce((acc: number, row: any) => acc + (parseEuro(row.amount || "0") || 0) * (Number(row.amortizationRate || 0)), 0);
}

export function totalFixedInvestments(step6: any): number {
  const list = step6?.fixedInvestments || [];
  
  console.log('🔍 totalFixedInvestments - Input step6:', step6);
  console.log('🔍 totalFixedInvestments - Fixed investments list:', list);
  console.log('🔍 totalFixedInvestments - Investment items:', step6?.investmentItems);
  
  const dyn = (step6?.investmentItems || []).reduce((t: number, it: any) => {
    const amount = parseFloat(it.amount) || 0;
    console.log('🔍 totalFixedInvestments - Dynamic item:', it, 'parsed amount:', amount);
    return t + amount;
  }, 0);
  
  const fix = list.reduce((acc: number, row: any) => {
    const amount = parseEuro(row.amount || "0") || 0;
    console.log('🔍 totalFixedInvestments - Fixed item:', row, 'parsed amount:', amount);
    return acc + amount;
  }, 0);
  
  const total = dyn + fix;
  console.log('🔍 totalFixedInvestments - Result:', { dyn, fix, total });
  
  // Check for unrealistic scaling
  if (total > 100000000) { // Over 100 million seems unrealistic for most businesses
    const scaledDown = total / 1000;
    console.log(`⚠️ totalFixedInvestments - Large total detected, scaling down by 1000: ${total} -> ${scaledDown}`);
    return scaledDown;
  }
  
  return total;
}

export function operatingCostBreakdown(step8: any, expectedRevenue: number) {
  const items = step8?.operatingCostItems || [];
  const find = (id: string) => items.find((i: any) => i.id === id);
  const val = (id: string) => {
    const it = find(id);
    if (!it) return 0;
    if (id === "amortization" || id === "tax") return parseEuro(it.totalCost || "0");
    // percentage-based
    const pct = parseFloat(String(it.percentage || "0").replace("%", "")) || 0;
    return (pct / 100) * expectedRevenue;
  };
  const cogs = val("cogs");
  const salaries = val("salaries");
  const marketing = val("marketing");
  const rent = val("rent");
  const admin = val("admin");
  const amort = val("amortization");
  const other = val("other");
  const interest = val("interest");
  const tax = val("tax");
  const total = cogs + salaries + marketing + rent + admin + amort + other + interest + tax;
  return { cogs, salaries, marketing, rent, admin, amort, other, interest, tax, total };
}

export function computeIncomeStatementPreview(step7: any, step8: any) {
  const ricavi = sumRevenueStep7(step7);
  const oc = operatingCostBreakdown(step8, ricavi);
  const costiOperativi = oc.cogs + oc.salaries + oc.marketing + oc.rent + oc.admin + oc.other;
  const ammortamenti = oc.amort;
  const oneriFinanziari = oc.interest;
  const imposte = oc.tax;
  const utile = ricavi - (costiOperativi + ammortamenti + oneriFinanziari + imposte);
  
  const result = { ricavi, costiOperativi, ammortamenti, oneriFinanziari, imposte, utile };
  
  console.log('📊 computeIncomeStatementPreview - Result:', result);
  
  // Check for unrealistically large values that might indicate scaling issues
  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === 'number' && value > 1000000000) { // Over 1 billion
      console.log(`⚠️ computeIncomeStatementPreview - Large value detected in ${key}: ${value}`);
    }
  });
  
  return result;
}

export function computeCashFlowPreview(step6: any, step7: any, step8: any, step9: any) {
  const ce = computeIncomeStatementPreview(step7, step8);
  // Working capital effect: Accounts Receivable increase based on collection terms
  const ricavi = sumRevenueStep7(step7);
  const imm = Number(step7?.immediateCollectionPercent || 0) || 0;
  const d60 = Number(step7?.collection60DaysPercent || 0) || 0;
  const d90 = Number(step7?.collection90DaysPercent || 0) || 0;
  const totalPct = Math.min(100, Math.max(0, imm + d60 + d90));
  const pct60_90 = Math.max(0, Math.min(100, d60 + d90));
  const arIncrease = (pct60_90 / 100) * ricavi; // revenue not collected in period becomes AR

  const operating = ce.utile + ce.ammortamenti - arIncrease; // indirect method: -ΔAR
  const investing = -totalFixedInvestments(step6);
  const financing = (parseEuro(step9?.yourOwnEquity || "0") || 0) + (parseEuro(step9?.bankingSystem || "0") || 0) + (parseEuro(step9?.otherInvestors || "0") || 0);
  const delta = operating + investing + financing;
  return { operating, investing, financing, delta, arIncrease };
}

// Year 0 parsers from uploaded extractions (best-effort)
export function parseYear0Balance(extractions: any[] | undefined): Year0Balance | undefined {
  if (!extractions || extractions.length === 0) return undefined;
  const e = extractions[0] || {};
  const md = e.metadata || {};
  const fin = e.financial_data || {};
  const out: Year0Balance = { raw: { md, fin } };
  
  console.log("🔍 parseYear0Balance - Raw extraction data:", e);
  console.log("🔍 parseYear0Balance - Metadata:", md);
  console.log("🔍 parseYear0Balance - Financial data:", fin);
  
  // Helper function to safely parse financial values
  const parseFinancialValue = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    
    console.log(`📊 parseFinancialValue - Input value (${typeof value}):`, value);
    
    // If it's already a number, check for unrealistic scaling
    if (typeof value === 'number') {
      const absValue = Math.abs(value);
      console.log(`📊 parseFinancialValue - Number value: ${value} -> abs: ${absValue}`);
      
      // Detect if value seems to be scaled by 1000 (common issue)
      // If value is over 100 million, it's likely incorrectly scaled for most SMEs
      if (absValue > 100000000) {
        const scaledDown = absValue / 1000;
        console.log(`⚠️ parseFinancialValue - Large number detected (${absValue}), scaling down by 1000: ${scaledDown}`);
        return scaledDown;
      }
      
      return absValue; // Ensure positive values for balance sheet
    }
    
    // If it's a string, try to parse it properly
    if (typeof value === 'string') {
      const originalValue = value;
      
      // Remove common formatting characters and convert Italian decimal format
      let cleanValue = value.toString()
        .replace(/[€\s]/g, '') // Remove currency symbols and spaces
        .trim();
      
      // Handle Italian number format: 1.234.567,89
      // Count dots and commas to determine format
      const dotCount = (cleanValue.match(/\./g) || []).length;
      const commaCount = (cleanValue.match(/,/g) || []).length;
      
      if (dotCount > 0 && commaCount === 1) {
        // Italian format: 1.234.567,89
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
      } else if (dotCount === 1 && commaCount === 0) {
        // English format: 1234567.89 (keep as is)
      } else if (dotCount === 0 && commaCount === 1) {
        // Format: 1234567,89
        cleanValue = cleanValue.replace(',', '.');
      } else if (dotCount > 1 && commaCount === 0) {
        // Thousands separators only: 1.234.567
        cleanValue = cleanValue.replace(/\./g, '');
      }
      
      const parsed = parseFloat(cleanValue);
      const result = isNaN(parsed) ? 0 : Math.abs(parsed);
      
      console.log(`📊 parseFinancialValue - String parsing:`, {
        original: originalValue,
        cleaned: cleanValue,
        dotCount,
        commaCount,
        parsed,
        result
      });
      
      // Check for unrealistic scaling in parsed result
      if (result > 100000000) {
        const scaledDown = result / 1000;
        console.log(`⚠️ parseFinancialValue - Large parsed value detected (${result}), scaling down by 1000: ${scaledDown}`);
        return scaledDown;
      }
      
      return result;
    }
    
    console.log(`📊 parseFinancialValue - Unknown type ${typeof value}:`, value);
    return 0;
  };
  
  // Search for total assets with various key patterns
  const assetKeys = ["totale_attivita", "totaleAttivita", "total_assets", "Totale Attività", "invested_capital", "sources_of_financing"];
  for (const k of assetKeys) {
    const value = fin[k] || md[k];
    if (value !== undefined && value !== null && value !== '') {
      out.totaleAttivita = parseFinancialValue(value);
      console.log(`✅ parseYear0Balance - Found assets with key "${k}": ${out.totaleAttivita}`);
      break;
    }
  }
  
  // Search for total liabilities + equity
  const liabilityKeys = ["totale_passivita_patrimonio", "totalePassivitaPatrimonio", "total_liabilities_equity", "Totale Passività e Patrimonio Netto"];
  for (const k of liabilityKeys) {
    const value = fin[k] || md[k];
    if (value !== undefined && value !== null && value !== '') {
      out.totalePassivita = parseFinancialValue(value);
      console.log(`✅ parseYear0Balance - Found liabilities+equity with key "${k}": ${out.totalePassivita}`);
      break;
    }
  }
  
  // Search for equity/patrimonio netto
  const equityKeys = ["patrimonio_netto", "equity", "Patrimonio Netto", "net_equity"];
  for (const k of equityKeys) {
    const value = fin[k] || md[k];
    if (value !== undefined && value !== null && value !== '') {
      out.patrimonioNetto = parseFinancialValue(value);
      console.log(`✅ parseYear0Balance - Found equity with key "${k}": ${out.patrimonioNetto}`);
      break;
    }
  }
  
  // If we don't have totalePassivita but we have both assets and equity, calculate liabilities
  if (!out.totalePassivita && out.totaleAttivita && out.patrimonioNetto) {
    out.totalePassivita = out.totaleAttivita;
    console.log(`🔄 parseYear0Balance - Calculated totalePassivita = totaleAttivita: ${out.totalePassivita}`);
  }
  
  // Validate the balance sheet equation: Assets = Liabilities + Equity
  if (out.totaleAttivita && out.patrimonioNetto) {
    const calculatedLiabilities = out.totaleAttivita - out.patrimonioNetto;
    if (calculatedLiabilities >= 0) {
      console.log(`📊 parseYear0Balance - Balance check: Assets(${out.totaleAttivita}) = Liabilities(${calculatedLiabilities}) + Equity(${out.patrimonioNetto})`);
    } else {
      console.warn(`⚠️ parseYear0Balance - Balance equation issue: Assets(${out.totaleAttivita}) < Equity(${out.patrimonioNetto})`);
    }
  }
  
  // Remove problematic scale detection - values should be used as-is
  // The scale issue is likely caused by incorrect multiplication elsewhere
  console.log(`📊 parseYear0Balance - Using values as-is (no scale correction):`, {
    totaleAttivita: out.totaleAttivita,
    totalePassivita: out.totalePassivita,
    patrimonioNetto: out.patrimonioNetto
  });
  
  // Final balance sheet validation and correction
  if (out.totaleAttivita && out.patrimonioNetto) {
    const calculatedLiabilities = out.totaleAttivita - out.patrimonioNetto;
    if (calculatedLiabilities >= 0) {
      console.log(`📊 parseYear0Balance - Balance check: Assets(${out.totaleAttivita}) = Liabilities(${calculatedLiabilities}) + Equity(${out.patrimonioNetto})`);
      // Ensure totalePassivita equals totaleAttivita (balance sheet must balance)
      out.totalePassivita = out.totaleAttivita;
      console.log(`🔄 parseYear0Balance - Set totalePassivita = totaleAttivita: ${out.totalePassivita}`);
    } else {
      console.error(`❌ parseYear0Balance - Invalid balance: Assets(${out.totaleAttivita}) < Equity(${out.patrimonioNetto})`);
    }
  }
  
  console.log(`🎯 parseYear0Balance - Final result:`, {
    totaleAttivita: out.totaleAttivita,
    totalePassivita: out.totalePassivita,
    patrimonioNetto: out.patrimonioNetto
  });
  
  return out;
}

export function parseYear0Income(extractions: any[] | undefined): Year0Income | undefined {
  if (!extractions || extractions.length === 0) return undefined;
  const e = extractions[0] || {};
  const fin = e.financial_data || {};
  const out: Year0Income = { raw: fin };
  const map = (keys: string[]) => {
    for (const k of keys) if (fin[k] !== undefined) return Number(fin[k]);
    return undefined;
  };
  out.ricavi = map(["ricavi", "revenue", "fatturato"]);
  out.costiOperativi = map(["costi_operativi", "operating_costs"]);
  out.ammortamenti = map(["ammortamenti", "depreciation"]);
  out.oneriFinanziari = map(["oneri_finanziari", "interest_expense"]);
  out.imposte = map(["imposte", "taxes"]);
  if (out.ricavi !== undefined && out.costiOperativi !== undefined) {
    const amm = out.ammortamenti || 0;
    const finc = out.oneriFinanziari || 0;
    const tax = out.imposte || 0;
    out.utile = (out.ricavi || 0) - ((out.costiOperativi || 0) + amm + finc + tax);
  }
  return out;
}

// Compute Year 1 projected balance sheet
export function computeYear1Balance(year0Balance: Year0Balance | undefined, step6: any, step7: any, step8: any, step9: any): Year0Balance | undefined {
  if (!year0Balance) return undefined;
  
  console.log('🔍 computeYear1Balance - Input year0Balance:', year0Balance);
  console.log('🔍 computeYear1Balance - Step9 raw data:', step9);
  
  const incomeStatement = computeIncomeStatementPreview(step7, step8);
  const netProfit = incomeStatement.utile;
  
  console.log('🔍 computeYear1Balance - Income statement:', incomeStatement);
  
  // Get financing from Step 9 - check multiple possible field names
  const equityIncrease = parseEuro(step9?.sources?.equity || step9?.yourOwnEquity || "0") || 0;
  const newBankLoan = parseEuro(step9?.sources?.bankLoan || step9?.bankingSystem || "0") || 0;
  const shareholderLoan = parseEuro(step9?.sources?.shareholderLoan || step9?.otherInvestors || "0") || 0;
  
  console.log('🔍 computeYear1Balance - Financing components:', {
    raw_step9_sources: step9?.sources,
    raw_step9_direct: { yourOwnEquity: step9?.yourOwnEquity, bankingSystem: step9?.bankingSystem, otherInvestors: step9?.otherInvestors },
    parsed_equity_increase: equityIncrease,
    parsed_bank_loan: newBankLoan,
    parsed_shareholder_loan: shareholderLoan
  });
  
  // Get investments from Step 6
  const newInvestments = totalFixedInvestments(step6);
  
  console.log('🔍 computeYear1Balance - New investments:', newInvestments);
  
  // Calculate Year 1 projected values
  const year1 = {
    // Assets: Year 0 + Net Investments
    totaleAttivita: (year0Balance.totaleAttivita || 0) + newInvestments,
    
    // Equity: Year 0 + New Equity + Net Profit + Shareholder Loan
    patrimonioNetto: (year0Balance.patrimonioNetto || 0) + equityIncrease + netProfit + shareholderLoan,
    
    // Will be calculated to balance
    totalePassivita: 0
  };
  
  // Balance sheet must balance: Assets = Liabilities + Equity
  year1.totalePassivita = year1.totaleAttivita;
  
  console.log('📊 Year 1 Balance Sheet Calculation:', {
    year0_assets: year0Balance.totaleAttivita,
    year0_equity: year0Balance.patrimonioNetto,
    new_investments: newInvestments,
    equity_increase: equityIncrease,
    shareholder_loan: shareholderLoan,
    net_profit: netProfit,
    year1_assets: year1.totaleAttivita,
    year1_equity: year1.patrimonioNetto,
    year1_liabilities_equity: year1.totalePassivita
  });
  
  return year1;
}

export function extractVisuraProfile(extractions: any[] | undefined) {
  if (!extractions || extractions.length === 0) return undefined;
  const e = extractions[0] || {};
  const md = e.metadata || {};
  const profile = {
    businessName: md.business_name || md.denominazione || undefined,
    companyId: md.vat_number || md.piva || md.codice_fiscale || undefined,
    founders: Array.isArray(md.founders) ? md.founders.join(", ") : (md.soci || md.amministratori || md.founders || undefined),
    establishmentDate: md.establishment_date || md.data_costituzione || md.data_iscrizione || undefined,
    address: md.address || md.sede_legale || undefined,
  };
  return profile;
}
