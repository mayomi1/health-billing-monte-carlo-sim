import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus } from "@/types/billingTypes";
import { formatCurrency } from "@/lib/formatters";
import StatusDistributionChart from "./StatusDistributionChart";
import { Activity, CheckCircle, CircleDashed, DollarSign, XCircle } from "lucide-react";

interface DashboardSummaryProps {
  totalAmount: number;
  claimsByStatus: Record<PaymentStatus, number>;
}

export default function DashboardSummary({ 
  totalAmount, 
  claimsByStatus 
}: DashboardSummaryProps) {
  
  const totalClaims = Object.values(claimsByStatus).reduce((sum, count) => sum + count, 0);
  
  const statusIcons = {
    Pending: <CircleDashed className="h-4 w-4 text-chart-1" />,
    Approved: <CheckCircle className="h-4 w-4 text-chart-2" />,
    Denied: <XCircle className="h-4 w-4 text-chart-3" />
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Billing Amount
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalClaims} claims
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Claims Overview
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {Object.entries(claimsByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center space-x-2">
              {statusIcons[status as PaymentStatus]}
              <div>
                <p className="text-sm font-medium">{count}</p>
                <p className="text-xs text-muted-foreground">{status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-7">
        <CardContent className="pt-6">
          <StatusDistributionChart 
            claimsByStatus={claimsByStatus} 
            totalAmount={totalAmount} 
          />
        </CardContent>
      </Card>
    </div>
  );
}