export type PaymentStatus = 'Pending' | 'Approved' | 'Denied';

export interface BillingRecord {
  patient_id: string;
  patient_name: string;
  billing_code: string;
  amount: number;
  insurance_provider: string;
  payment_status: PaymentStatus;
  claim_date: string;
}

export interface PaymentProbabilities {
  Pending: number;
  Approved: number;
  Denied: number;
}

export interface SimulationResults {
  expectedRevenue: number;
  minRevenue: number;
  maxRevenue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  distribution: {
    amount: number;
    frequency: number;
  }[];
}