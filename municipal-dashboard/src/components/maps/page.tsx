// "use client";

// import AppShell from "@/components/layout/AppShell";
// import { useQuery } from "@tanstack/react-query";
// import { fetchRiskMapData } from "@/lib/api";
// import RiskMap from "@/components/maps/RiskMap";

// export default function RiskMapPage() {
//   const { data } = useQuery({
//     queryKey: ["risk-map"],
//     queryFn: fetchRiskMapData,
//   });

//   return (
//     <AppShell>
//       <h2 className="text-xl font-semibold mb-4">
//         Infrastructure Risk Map
//       </h2>

//       <div className="h-[600px] bg-white rounded-lg overflow-hidden">
//         {data && <RiskMap data={data} />}
//       </div>
//     </AppShell>
//   );
// }
'use client';

import AppShell from '@/components/layout/AppShell';
import RiskMap from '@/components/maps/RiskMap';

export default function RiskMapPage() {
  return (
    <AppShell>
      <div className="p-6">
        <RiskMap />
      </div>
    </AppShell>
  );
}