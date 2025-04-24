"use server";

import { billingRecords } from "@/data/mockData";
import { BillingRecord, PaymentStatus } from "@/types/billingTypes";

export async function fetchBillingData(): Promise<{
  records: BillingRecord[];
  summary: {
    totalAmount: number;
    claimsByStatus: Record<PaymentStatus, number>;
    amountsByStatus: Record<PaymentStatus, number>;
  };
}> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Calculate summary data
  const totalAmount = billingRecords.reduce((total, record) => total + record.amount, 0);

  // Initialize accumulators
  const initial = {
    counts: { Pending: 0, Approved: 0, Denied: 0 } as Record<PaymentStatus, number>,
    amounts: { Pending: 0, Approved: 0, Denied: 0 } as Record<PaymentStatus, number>
  };

  // Calculate both counts and amounts in a single reduce
  const summary = billingRecords.reduce((acc, record) => {
    acc.counts[record.payment_status]++;
    acc.amounts[record.payment_status] += record.amount;
    return acc;
  }, initial);

  return {
    records: billingRecords,
    summary: {
      totalAmount,
      claimsByStatus: summary.counts,
      amountsByStatus: summary.amounts
    }
  };
}
