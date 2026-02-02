"use client";

import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchPriorityStats,
} from "@/lib/api";
import PriorityBarChart from "@/components/charts/PriorityBarChart";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: priorityStats } = useQuery({
    queryKey: ["priority-stats"],
    queryFn: fetchPriorityStats,
  });

  if (statsLoading) {
    return <AppShell>Loading dashboard…</AppShell>;
  }

  return (
    <AppShell>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">High Risk Assets</p>
          <p className="text-2xl font-semibold mt-2">
            {stats?.highRisk}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Repairs</p>
          <p className="text-2xl font-semibold mt-2">
            {stats?.pending}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Budget Used</p>
          <p className="text-2xl font-semibold mt-2">
            {stats?.budgetUsed}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Avg Resolution Time
          </p>
          <p className="text-2xl font-semibold mt-2">
            {stats?.avgTime}
          </p>
        </Card>
      </div>

      {/* Priority Distribution */}
      <div className="mt-6 bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium mb-3">
          Repair Priority Distribution
        </h3>

        {priorityStats && (
          <PriorityBarChart data={priorityStats} />
        )}
      </div>
    </AppShell>
  );
}
