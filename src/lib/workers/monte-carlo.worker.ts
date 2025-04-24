import { BillingRecord, PaymentProbabilities, SimulationResults } from "@/types/billingTypes";

self.onmessage = (e: MessageEvent) => {
  const { billingRecords, paymentProbabilities, iterations } = e.data;
  const results = runMonteCarloSimulation(billingRecords, paymentProbabilities, iterations);
  self.postMessage(results);
};

function runMonteCarloSimulation(
  billingRecords: BillingRecord[],
  paymentProbabilities: PaymentProbabilities,
  iterations: number = 2000
): SimulationResults {
  // Validate probabilities are between 0 and 1
  if (paymentProbabilities.Approved < 0 || paymentProbabilities.Approved > 1 ||
    paymentProbabilities.Denied < 0 || paymentProbabilities.Denied > 1 ||
    paymentProbabilities.Pending < 0 || paymentProbabilities.Pending > 1) {
    throw new Error("Probabilities must be between 0 and 1");
  }

  // Calculate possible outcomes
  const outcomes: number[] = [];

  // Run multiple iterations
  for (let i = 0; i < iterations; i++) {
    let totalRevenue = 0;

    // For each billing record
    for (const record of billingRecords) {
      const probability = paymentProbabilities[record.payment_status];

      // Determine if payment is received based on probability
      const isPaymentReceived = Math.random() < probability;

      if (isPaymentReceived) {
        totalRevenue += record.amount;
      }
    }

    outcomes.push(totalRevenue);
  }

  // Sort outcomes for analysis
  outcomes.sort((a, b) => a - b);

  // Calculate statistics
  const minRevenue = outcomes[0];
  const maxRevenue = outcomes[outcomes.length - 1];
  const expectedRevenue = outcomes.reduce((sum, val) => sum + val, 0) / outcomes.length;

  // Calculate 95% confidence interval
  const lowerIndex = Math.floor(iterations * 0.025);
  const upperIndex = Math.floor(iterations * 0.975);
  const confidenceInterval = {
    lower: outcomes[lowerIndex],
    upper: outcomes[upperIndex]
  };

  // Create a distribution for visualization
  const bucketCount = 10;
  const bucketSize = (maxRevenue - minRevenue) / bucketCount;
  const distribution = Array(bucketCount).fill(0).map((_, index) => {
    const lowerBound = minRevenue + index * bucketSize;
    const upperBound = lowerBound + bucketSize;
    const count = outcomes.filter(val => val >= lowerBound && val < upperBound).length;
    return {
      amount: lowerBound + bucketSize / 2, // middle point for display
      frequency: count / iterations
    };
  });

  return {
    expectedRevenue,
    minRevenue,
    maxRevenue,
    confidenceInterval,
    distribution
  };
}

export default runMonteCarloSimulation
