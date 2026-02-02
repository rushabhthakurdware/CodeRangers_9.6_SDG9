import { mockAssets } from '@/data/mockAssets';
import { mockBudget } from '@/data/mockBudget';

export default function BudgetInsight() {
  const p1Cost = mockAssets
    .filter(a => a.priority === 'P1')
    .reduce((sum, a) => sum + a.repairCost, 0);

  const remainingBudget = mockBudget.totalBudget - mockBudget.usedBudget;
  const percentage = Math.round((p1Cost / remainingBudget) * 100);

  return (
    <div className="rounded-xl border p-4 bg-muted">
      <h3 className="font-semibold mb-2">Executive Insight</h3>
      <p className="text-sm">
        Resolving all <strong>P1</strong> assets will consume approximately{' '}
        <strong>{percentage}%</strong> of the remaining infrastructure budget.
      </p>
    </div>
  );
}
