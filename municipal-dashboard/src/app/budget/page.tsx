// // "use client";

// // import AppShell from "@/components/layout/AppShell";
// // import { useQuery } from "@tanstack/react-query";
// // import { fetchBudgetScenario } from "@/lib/api";

// // export default function BudgetPage() {
// //   const { data } = useQuery({
// //     queryKey: ["budget"],
// //     queryFn: fetchBudgetScenario,
// //   });

// //   return (
// //     <AppShell>
// //       <h2 className="text-xl font-semibold mb-4">
// //         Budget Impact Simulator
// //       </h2>

// //       <div className="bg-white p-4 rounded-lg">
// //         <p>Total Budget: ₹{data?.budget.toLocaleString()}</p>
// //         <p className="mt-2 text-sm text-muted-foreground">
// //           Select repairs to see remaining risk
// //         </p>
// //       </div>
// //     </AppShell>
// //   );
// // }
// import BudgetChart from '@/components/budget/BudgetChart';
// import BudgetInsight from '@/components/budget/BudgetInsight';
// import { mockBudget } from '@/data/mockBudget';

// export default function Budget() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">Budget Impact Analysis</h1>
//         <p className="text-muted-foreground">
//           Financial overview of infrastructure repair decisions
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <BudgetChart />

//         <div className="space-y-4">
//           <div className="rounded-xl border p-4">
//             <p>Total Budget: {mockBudget.totalBudget}</p>
//             <p>Used Budget: {mockBudget.usedBudget}</p>
//             <p>
//               Remaining Budget:{' '}
//               {mockBudget.totalBudget - mockBudget.usedBudget}
//             </p>
//           </div>

//           <BudgetInsight />
//         </div>
//       </div>
//     </div>
//   );
// }
// app/budget/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBudget, fetchBudgetScenario, fetchAssets } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetChart from "@/components/budget/BudgetChart";
import BudgetInsight from "@/components/budget/BudgetInsight";
import { AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import type { Asset } from "@/lib/types";

export default function BudgetPage() {
  const [selectedBudget, setSelectedBudget] = useState<number>(500);

  // Fetch budget data
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useQuery({
    queryKey: ["budget"],
    queryFn: fetchBudget,
  });

  // Fetch budget scenario
  const { data: scenario, isLoading: scenarioLoading } = useQuery({
    queryKey: ["budget-scenario", selectedBudget],
    queryFn: () => fetchBudgetScenario(selectedBudget),
  });

  // Fetch assets for cost breakdown
  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (budgetLoading) {
    return (
      <AppShell>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (budgetError) {
    return (
      <AppShell>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Failed to load budget</h3>
            <p className="text-sm text-red-700">Please try again later</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!budget) {
    return (
      <AppShell>
        <p className="text-slate-500">No budget data available</p>
      </AppShell>
    );
  }

  const remainingBudget = budget.remainingBudget;
  const budgetUtilization = Math.round(
    (budget.usedBudget / budget.totalBudget) * 100
  );

  // Calculate P1, P2, P3 costs
  const p1Cost = assets
    ?.filter((a: Asset) => a.priority === "P1")
    .reduce((sum: number, a: Asset) => sum + a.repairCost, 0) ?? 0;

  const p2Cost = assets
    ?.filter((a: Asset) => a.priority === "P2")
    .reduce((sum: number, a: Asset) => sum + a.repairCost, 0) ?? 0;

  const p3Cost = assets
    ?.filter((a: Asset) => a.priority === "P3")
    .reduce((sum: number, a: Asset) => sum + a.repairCost, 0) ?? 0;

  const totalRepairCost = p1Cost + p2Cost + p3Cost;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Infrastructure Budget</h1>
          <p className="text-slate-600 mt-1">
            Allocate resources to maximize repair impact
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Budget */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-slate-900">
                  ₹{budget.totalBudget} L
                </p>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Used Budget */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Used Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-slate-900">
                  ₹{budget.usedBudget} L
                </p>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {budgetUtilization}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${budgetUtilization}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Remaining Budget */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Remaining Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-green-600">
                  ₹{remainingBudget} L
                </p>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Repairs Needed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Repairs Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-slate-900">
                  ₹{totalRepairCost} L
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    totalRepairCost > remainingBudget
                      ? "text-red-600 bg-red-100"
                      : "text-green-600 bg-green-100"
                  }`}
                >
                  {totalRepairCost > remainingBudget
                    ? `+₹${totalRepairCost - remainingBudget} L deficit`
                    : "Sufficient"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Distribution Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Budget Distribution by Priority</CardTitle>
              <CardDescription>
                Repair costs grouped by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetChart />
            </CardContent>
          </Card>

          {/* Executive Insight */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* P1 Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">P1 Repairs</span>
                  <span className="font-semibold text-slate-900">₹{p1Cost} L</span>
                </div>
                <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${(p1Cost / totalRepairCost) * 100 || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {totalRepairCost > 0
                    ? Math.round((p1Cost / totalRepairCost) * 100)
                    : 0}% of total repairs
                </p>
              </div>

              {/* P2 Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">P2 Repairs</span>
                  <span className="font-semibold text-slate-900">₹{p2Cost} L</span>
                </div>
                <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600"
                    style={{ width: `${(p2Cost / totalRepairCost) * 100 || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {totalRepairCost > 0
                    ? Math.round((p2Cost / totalRepairCost) * 100)
                    : 0}% of total repairs
                </p>
              </div>

              {/* P3 Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">P3 Repairs</span>
                  <span className="font-semibold text-slate-900">₹{p3Cost} L</span>
                </div>
                <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${(p3Cost / totalRepairCost) * 100 || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {totalRepairCost > 0
                    ? Math.round((p3Cost / totalRepairCost) * 100)
                    : 0}% of total repairs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Scenario */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Scenario Planner</CardTitle>
            <CardDescription>
              See which repairs can be completed with available budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Budget Slider */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Available Budget: ₹{selectedBudget} L
                </span>
              </label>
              <input
                type="range"
                min="0"
                max={budget.totalBudget}
                step="10"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>₹0 L</span>
                <span>₹{budget.totalBudget} L</span>
              </div>
            </div>

            {scenarioLoading ? (
              <p className="text-slate-500">Calculating scenario...</p>
            ) : scenario ? (
              <div className="space-y-4">
                {/* Results */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-medium">Selected</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {scenario.selected?.length || 0}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-medium">Cost</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{scenario.totalCost || 0} L
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-medium">Utilization</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round((scenario.utilizationRate || 0) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Selected Repairs */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Selected Repairs:</h4>
                  <ul className="space-y-1">
                    {scenario.repairs?.map((repair) => (
                      <li
                        key={repair.id}
                        className={`text-sm px-3 py-2 rounded ${
                          scenario.selected?.includes(repair.id)
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span className="font-medium">{repair.id}</span>
                        {" - ₹"}
                        {repair.cost}L (Priority:{" "}
                        {Math.round(repair.priority * 100)}%)
                        {scenario.selected?.includes(repair.id) && (
                          <span className="ml-2 text-xs font-semibold">✓ Selected</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                {scenario.totalCost! < selectedBudget && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Budget available:</strong> You have ₹
                      {selectedBudget - scenario.totalCost!} L remaining. Consider
                      adding more repairs or increasing next quarter's budget.
                    </p>
                  </div>
                )}

                {scenario.totalCost! > selectedBudget && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Budget deficit:</strong> ₹{scenario.totalCost! - selectedBudget}L
                      additional needed. Consider deferring lower-priority repairs.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Budget Insight Card */}
        <BudgetInsight />
      </div>
    </AppShell>
  );
}