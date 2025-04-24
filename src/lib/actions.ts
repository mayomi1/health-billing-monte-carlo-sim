"use server";

import { billingRecords } from "@/data/mockData";
import { BillingRecord, PaymentStatus } from "@/types/billingTypes";

export async function fetchBillingData(): Promise<{
  records: BillingRecord[];
  summary: {
    totalAmount: number;
    claimsByStatus: Record<PaymentStatus, number>;
  };
}> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Calculate summary data
  const totalAmount = billingRecords.reduce((total, record) => total + record.amount, 0);
  
  const claimsByStatus = billingRecords.reduce(
    (acc, record) => {
      acc[record.payment_status]++;
      return acc;
    },
    { Pending: 0, Approved: 0, Denied: 0 } as Record<PaymentStatus, number>
  );

  return {
    records: billingRecords,
    summary: {
      totalAmount,
      claimsByStatus
    }
  };
}