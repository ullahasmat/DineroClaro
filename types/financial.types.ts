export interface FinancialProfile {
  id: string;
  user_id: string;
  credit_score: number;
  credit_score_range: string;
  monthly_income: number;
  checking_balance: number;
  total_debt: number;
  financial_goal: string;
  risk_tolerance: string;
  life_stage: string;
  last_updated: Date;
}

export interface CreditCardManual {
  id: string;
  user_id: string;
  card_name: string;
  issuer: string;
  credit_limit: number;
  current_balance: number;
  interest_rate: number;
  payment_due_date: Date;
  last_updated: Date;
}
