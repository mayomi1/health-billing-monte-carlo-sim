"use client";

import { useState, useEffect } from "react";
import { BillingRecord, PaymentProbabilities, SimulationResults } from "@/types/billingTypes";
import { runMonteCarloSimulation } from "@/lib/simulations";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useDebounce } from "@/hooks/use-debounce";
import { RefreshCw } from "lucide-react";

interface MonteCarloSimulationProps {
  billingRecords: BillingRecord[];
}

export default function MonteCarloSimulation({ billingRecords }: MonteCarloSimulationProps) {
  const [paymentProbabilities, setPaymentProbabilities] = useState<PaymentProbabilities>({
    Pending: 0.7,  // 70% chance that pending claims will be paid
    Approved: 1.0, // 100% chance that approved claims will be paid
    Denied: 0.1    // 10% chance that denied claims will be paid (appeals)
  });

  const debouncedProbabilities = useDebounce(paymentProbabilities, 300);

  const iterations = 2000;
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Run simulation when probabilities change
  useEffect(() => {
    runSimulation();
  }, [debouncedProbabilities]);

  const runSimulation = () => {
    setIsRunning(true);

    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const simulationResults = runMonteCarloSimulation(
        billingRecords,
        debouncedProbabilities,
        iterations
      );

      setResults(simulationResults);
      setIsRunning(false);
    }, 0);
  };

  const handleProbabilityChange = (status: keyof PaymentProbabilities, value: number[]) => {
    setPaymentProbabilities(prev => ({
      ...prev,
      [status]: value[0]
    }));
  };

  const formatChartData = (results: SimulationResults | null) => {
    if (!results) return [];

    return results.distribution.map(point => ({
      amount: formatCurrency(point.amount).replace('$', ''),
      frequency: point.frequency,
      formattedAmount: formatCurrency(point.amount)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Probability Sliders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Probabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Pending Claims
                  </label>
                  <span className="text-sm">
                    {formatPercentage(paymentProbabilities.Pending)}
                  </span>
                </div>
                <Slider
                  value={[paymentProbabilities.Pending]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => handleProbabilityChange("Pending", value)}
                  className="bg-chart-1/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Chance that pending claims will be paid
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Approved Claims
                  </label>
                  <span className="text-sm">
                    {formatPercentage(paymentProbabilities.Approved)}
                  </span>
                </div>
                <Slider
                  value={[paymentProbabilities.Approved]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => handleProbabilityChange("Approved", value)}
                  className="bg-chart-2/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Chance that approved claims will be paid
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Denied Claims
                  </label>
                  <span className="text-sm">
                    {formatPercentage(paymentProbabilities.Denied)}
                  </span>
                </div>
                <Slider
                  value={[paymentProbabilities.Denied]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => handleProbabilityChange("Denied", value)}
                  className="bg-chart-3/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Chance that denied claims will be paid (appeals)
                </p>
              </div>
            </div>

            <Button
              onClick={runSimulation}
              className="w-full"
              disabled={isRunning}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
              Run Simulation ({iterations} iterations)
            </Button>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expected Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.expectedRevenue)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Revenue Range</p>
                    <p className="text-lg font-medium">
                      {formatCurrency(results.minRevenue)} - {formatCurrency(results.maxRevenue)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">95% Confidence Interval</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(results.confidenceInterval.lower)} - {formatCurrency(results.confidenceInterval.upper)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    95% chance that actual revenue will fall within this range
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  Adjust the probabilities and run the simulation to see results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Chart */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={formatChartData(results)}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="amount"
                    tickFormatter={(value) => `$${value}k`}
                    label={{
                      value: 'Revenue Amount',
                      position: 'insideBottom',
                      offset: -8
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    label={{
                      value: 'Probability',
                      angle: -90,
                      position: 'insideLeft'
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${(Number(value) * 100).toFixed(2)}%`,
                      'Probability'
                    ]}
                    labelFormatter={(label) => `Revenue: $${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="frequency"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-5 text-center">
              This chart shows the probability distribution of possible revenue outcomes based on {iterations} simulation runs.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
