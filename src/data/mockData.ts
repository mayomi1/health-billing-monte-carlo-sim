import { BillingRecord } from "@/types/billingTypes";

export const providedRecord: BillingRecord[] = [
  {
    "patient_id": "P1",
    "patient_name": "John Smith",
    "billing_code": "B1001",
    "amount": 1675.5,
    "insurance_provider": "Blue Shield",
    "payment_status": "Pending",
    "claim_date": "2025-03-25"
  },
  {
    "patient_id": "P2",
    "patient_name": "Sarah Johnson",
    "billing_code": "B2002",
    "amount": 2310.09,
    "insurance_provider": "Medicare",
    "payment_status": "Approved",
    "claim_date": "2025-01-05"
  },
  {
    "patient_id": "P3",
    "patient_name": "Robert Chen",
    "billing_code": "B3003",
    "amount": 4945.57,
    "insurance_provider": "Aetna",
    "payment_status": "Pending",
    "claim_date": "2025-03-04"
  },
  {
    "patient_id": "P4",
    "patient_name": "Lisa Williams",
    "billing_code": "B4004",
    "amount": 8338.89,
    "insurance_provider": "UnitedHealth",
    "payment_status": "Denied",
    "claim_date": "2025-03-20"
  },
  {
    "patient_id": "P5",
    "patient_name": "Michael Garcia",
    "billing_code": "B5005",
    "amount": 3220.05,
    "insurance_provider": "Cigna",
    "payment_status": "Denied",
    "claim_date": "2025-02-21"
  }
];


function generateMockData(count: number): BillingRecord[] {
  const insuranceProviders = ["Blue Shield", "Medicare", "Aetna", "UnitedHealth", "Cigna", "Humana"];
  const records: BillingRecord[] = [];

  for (let i = 0; i < count; i++) {
    const amount = Math.round(Math.random() * 9000 + 1000);
    const statuses = ["Pending", "Approved", "Denied"] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    records.push({
      patient_id: `P${(i + 1).toString().padStart(4, '0')}`,
      patient_name: `Patient ${i + 1}`,
      billing_code: `B${Math.floor(Math.random() * 9000 + 1000)}`,
      amount: amount + Math.round(Math.random() * 99) / 100,
      insurance_provider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
      payment_status: status,
      claim_date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }

  return records;
}

export const billingRecords = [...providedRecord, ...generateMockData(45)];
