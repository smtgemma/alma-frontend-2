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

interface FinancialAnalysis {
    year: number;
    gross_operating_cash_flow: number;
    working_capital_change: number;
    current_management_cash_flow: number;
    operating_cash_flow: number;
    debt_service_cash_flow: number;
    shareholders_cash_flow: number;
    net_cash_flow: number;
    sales_revenue: number;
    production_value: number;
    gross_operating_margin: number;
    ebit: number;
    ebt: number;
    net_income: number;
    dividends: number;
    net_tangible_assets: number;
    net_intangible_assets: number;
    financial_assets: number;
    trade_assets: number;
    inventory: number;
    deferred_liquidity: number;
    immediate_liquidity: number;
    equity: number;
    long_term_debt: number;
    short_term_debt: number;
    net_financial_position: number;
    mortgage_loans: number;
    other_financial_debts: number;
    cash_and_banks: number;
}

interface RatiosAnalysis {
    year: number;
    roi: number;
    roe: number;
    ros: number;
    ebit_margin: number;
    net_debt_to_ebitda: number;
    net_debt_to_equity: number;
    net_debt_to_revenue: number;
    current_ratio: number;
    quick_ratio: number;
    debt_to_equity: number;
    treasury_margin: number;
    structural_margin: number;
    net_working_capital: number;
    altman_z_score: number;
}

interface ProductionSalesForecast {
    year: number;
    sales_revenue: number;
    revenue_growth: number;
    units_sold: number;
    average_price: number;
    unit_production_cost: number;
    unit_margin: number;
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
    financialAnalysis: FinancialAnalysis[];
    ratiosAnalysis: RatiosAnalysis[];
    productionSalesForecast: ProductionSalesForecast[];
    managementTeam: string;
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

export interface IFinancialAnalysis {
    financialAnalysis: FinancialAnalysis[];
}

export interface IRatiosAnalysis {
    ratiosAnalysis: RatiosAnalysis[];
}

export interface IProductionSalesForecast {
    productionSalesForecast: ProductionSalesForecast[];
    managementTeam: string;
}