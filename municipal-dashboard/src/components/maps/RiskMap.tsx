// import CityMap from '@/components/maps/CityMap';

// export default function RiskMap() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">Infrastructure Risk Map</h1>
//         <p className="text-muted-foreground">
//           Live spatial overview of reported and assessed infrastructure risks
//         </p>
//       </div>

//       <CityMap />
//     </div>
//   );
// }
'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with Leaflet
const CityMap = dynamic(() => import('@/components/maps/CityMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-xl bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function RiskMap() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Infrastructure Risk Map</h1>
        <p className="text-muted-foreground">
          Live spatial overview of reported and assessed infrastructure risks
        </p>
      </div>

      <CityMap />
    </div>
  );
}
