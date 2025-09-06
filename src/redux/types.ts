export const user = null;


interface FinancialHighlights {
    year: number;
    revenue: number;
    net_income: number;
    capex: number;
    debt_repayment: number;
}

interface CashFlowAnalysis {
    year: number;
    operating: number;
    investing: number;
    financing: number;
    net_cash: number;
}

interface ProfitLossProjection {
    year: number;
    revenue: number;
    cogs: number;
    gross_profit: number;
    operating_expenses: number;
    ebitda: number;
    depreciation_amortization: number;
    ebit: number;
    interest: number;
    taxes: number;
    net_income: number;
}

interface BalanceSheet {
    year: number;
    assets: number;
    current_assets: number;
    non_current_assets: number;
    liabilities: number;
    current_liabilities: number;
    non_current_liabilities: number;
    equity: number;
}

interface NetFinancialPosition {
    year: number;
    net_position: number;
}

interface DebtStructure {
    year: number;
    repayment: number;
    interest_rate: number;
    outstanding_debt: number;
}

interface KeyRatios {
    year: number;
    roi: number;
    roe: number;
    debt_to_equity: number;
    gross_margin: number;
    ebitda_margin: number;
    net_margin: number;
    current_ratio: number;
    quick_ratio: number;
    asset_turnover: number;
}

interface OperatingCostBreakdown {
    year: number;
    revenue: number;
    cogs: number;
    employee_costs: number;
    marketing: number;
    rent: number;
    administration: number;
    amortization: number;
    other_expenses: number;
    interest_expenses: number;
    tax: number;
}

interface PlanData {
    financialHighlights: FinancialHighlights[];
    cashFlowAnalysis: CashFlowAnalysis[];
    profitLossProjection: ProfitLossProjection[];
    balanceSheet: BalanceSheet[];
    netFinancialPosition: NetFinancialPosition[];
    debtStructure: DebtStructure[];
    keyRatios: KeyRatios[];
    operatingCostBreakdown: OperatingCostBreakdown[];
}

interface PlanInfo {
    data?: PlanData;
    // Any other properties in your planInfo object
}


export interface IFinancial {
    financialHighlights: FinancialHighlights[];
    businessModel: string;
    cashFlowAnalysis: CashFlowAnalysis[];
}

export interface IMarketing {
    marketingSalesStrategy: string;
    profitLossProjection: ProfitLossProjection[];
    sectorStrategy: string;
}
export interface IBalanceSheet {
    balanceSheet: BalanceSheet[];
    netFinancialPosition: NetFinancialPosition[];
}

export interface IDebt {
    fundingSources: string;
    debtStructure: DebtStructure[];
}

export interface IOperationsPlan {
    operationsPlan: string;
    operatingCostBreakdown: OperatingCostBreakdown[];
    keyRatios: KeyRatios[];
}