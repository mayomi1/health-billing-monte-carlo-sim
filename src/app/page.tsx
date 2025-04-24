"use client";

import { useEffect, useState } from "react";
import { BillingRecord, PaymentStatus } from "@/types/billingTypes";
import { fetchBillingData } from "@/lib/actions";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import ClaimsTable from "@/components/claims/ClaimsTable";
import MonteCarloSimulation from "@/components/forecasting/MonteCarloSimulation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, LineChart, Table } from "lucide-react";

export default function Home() {
  const [billingData, setBillingData] = useState<{
    records: BillingRecord[];
    summary: {
      totalAmount: number;
      claimsByStatus: Record<PaymentStatus, number>;
      amountsByStatus: Record<PaymentStatus, number>;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchBillingData();
        setBillingData(data);
      } catch (error) {
        console.error("Error loading billing data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-medium text-destructive">
          Error loading data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Healthcare Billing Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visualize billing data and forecast revenue using Monte Carlo simulation
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center">
            <Table className="mr-2 h-4 w-4" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Forecasting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardSummary
            totalAmount={billingData.summary.totalAmount}
            claimsByStatus={billingData.summary.claimsByStatus}
            amountsByStatus={billingData.summary.amountsByStatus}
          />
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Billing Claims</CardTitle>
              <CardDescription>
                View, search, and filter all billing claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsTable records={billingData.records} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
              <CardDescription>
                Use Monte Carlo simulation to forecast revenue outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonteCarloSimulation billingRecords={billingData.records} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
