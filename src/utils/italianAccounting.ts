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
  const dyn = (step6?.investmentItems || []).reduce((t: number, it: any) => t + (parseFloat(it.amount) || 0), 0);
  const fix = list.reduce((acc: number, row: any) => acc + (parseEuro(row.amount || "0") || 0), 0);
  return dyn + fix;
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
  return { ricavi, costiOperativi, ammortamenti, oneriFinanziari, imposte, utile };
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
  const keys = ["totale_attivita", "totaleAttivita", "total_assets", "Totale Attività"];
  for (const k of keys) if (fin[k] || md[k]) { out.totaleAttivita = Number(fin[k] || md[k]) || 0; break; }
  const keys2 = ["totale_passivita_patrimonio", "totalePassivitaPatrimonio", "total_liabilities_equity", "Totale Passività e Patrimonio Netto"];
  for (const k of keys2) if (fin[k] || md[k]) { out.totalePassivita = Number(fin[k] || md[k]) || 0; break; }
  const pnKeys = ["patrimonio_netto", "equity", "Patrimonio Netto"]; 
  for (const k of pnKeys) if (fin[k] || md[k]) { out.patrimonioNetto = Number(fin[k] || md[k]) || 0; break; }
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
