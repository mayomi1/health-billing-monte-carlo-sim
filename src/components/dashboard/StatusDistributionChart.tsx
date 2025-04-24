"use client";

import { PaymentStatus } from "@/types/billingTypes";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface StatusDistributionChartProps {
  claimsByStatus: Record<PaymentStatus, number>;
  amountsByStatus: Record<PaymentStatus, number>;
  totalAmount: number;
  className?: string;
}

const StatusColors: Record<PaymentStatus, string> = {
  Pending: "hsl(var(--chart-1))",
  Approved: "hsl(var(--chart-2))",
  Denied: "hsl(var(--chart-3))"
};

export default function StatusDistributionChart({
  claimsByStatus,
  amountsByStatus,
  className
}: StatusDistributionChartProps) {
  const chartData = Object.entries(claimsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
    amount: amountsByStatus[status as PaymentStatus]
  }));

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Claims by Status</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of claims across payment statuses
        </p>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
              label={({ name, percent }) => `${name}: ${formatPercentage(percent)}`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={StatusColors[entry.name as PaymentStatus]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [
                  `${value} claims (${formatCurrency(entry.amount)})`,
                  name
                ];
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col space-y-2">
        {Object.entries(claimsByStatus).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: StatusColors[status as PaymentStatus] }}
              />
              <span className="text-sm">{status}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{count} claims</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({formatCurrency(amountsByStatus[status as PaymentStatus])})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
