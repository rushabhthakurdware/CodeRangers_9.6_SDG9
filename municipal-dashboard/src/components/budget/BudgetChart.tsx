import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { mockAssets } from '@/data/mockAssets';

export default function BudgetChart() {
  const data = [
    {
      name: 'P1 Repairs',
      value: mockAssets
        .filter(a => a.priority === 'P1')
        .reduce((sum, a) => sum + a.repairCost, 0),
    },
    {
      name: 'P2 Repairs',
      value: mockAssets
        .filter(a => a.priority === 'P2')
        .reduce((sum, a) => sum + a.repairCost, 0),
    },
    {
      name: 'P3 Repairs',
      value: mockAssets
        .filter(a => a.priority === 'P3')
        .reduce((sum, a) => sum + a.repairCost, 0),
    },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
