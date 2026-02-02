// // // // // // import { mockAssets } from '@/data/mockAssets';
// // // // // // import { calculatePriorityScore } from '@/utils/prioritization';
// // // // // // import PriorityBadge from '@/components/common/PriorityBadge';

// // // // // // export default function RepairTable() {
// // // // // //   const rankedAssets = [...mockAssets]
// // // // // //     .map(asset => ({
// // // // // //       ...asset,
// // // // // //       decisionScore: calculatePriorityScore(asset),
// // // // // //     }))
// // // // // //     .sort((a, b) => b.decisionScore - a.decisionScore);

// // // // // //   return (
// // // // // //     <div className="rounded-xl border">
// // // // // //       <table className="w-full text-sm">
// // // // // //         <thead className="bg-muted">
// // // // // //           <tr>
// // // // // //             <th className="p-3 text-left">Rank</th>
// // // // // //             <th className="p-3 text-left">Asset</th>
// // // // // //             <th className="p-3">Priority</th>
// // // // // //             <th className="p-3">Risk</th>
// // // // // //             <th className="p-3">Impact</th>
// // // // // //             <th className="p-3">ETA</th>
// // // // // //           </tr>
// // // // // //         </thead>
// // // // // //         <tbody>
// // // // // //           {rankedAssets.map((asset, index) => (
// // // // // //             <tr key={asset.id} className={index < 3 ? 'bg-red-50' : ''}>
// // // // // //               <td className="p-3 font-semibold">{index + 1}</td>
// // // // // //               <td className="p-3">{asset.name}</td>
// // // // // //               <td className="p-3 text-center">
// // // // // //                 <PriorityBadge priority={asset.priority} />
// // // // // //               </td>
// // // // // //               <td className="p-3 text-center">{asset.riskScore}</td>
// // // // // //               <td className="p-3 text-center">{asset.impact}/10</td>
// // // // // //               <td className="p-3 text-center">{asset.slaDays} days</td>
// // // // // //             </tr>
// // // // // //           ))}
// // // // // //         </tbody>
// // // // // //       </table>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // import { mockAssets } from '@/data/mockAssets';
// // // // // import { calculatePriorityScore } from '@/utils/prioritization';
// // // // // import PriorityBadge from '@/components/common/PriorityBadge';
// // // // // import { Card } from '@/components/ui/card';
// // // // // import { Badge } from '@/components/ui/badge';
// // // // // import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// // // // // export default function RepairTable() {
// // // // //   const rankedAssets = [...mockAssets]
// // // // //     .map(asset => ({
// // // // //       ...asset,
// // // // //       decisionScore: calculatePriorityScore(asset),
// // // // //     }))
// // // // //     .sort((a, b) => b.decisionScore - a.decisionScore);

// // // // //   const getRiskColor = (score: number) => {
// // // // //     if (score >= 8) return 'text-red-600 bg-red-50';
// // // // //     if (score >= 5) return 'text-orange-600 bg-orange-50';
// // // // //     return 'text-green-600 bg-green-50';
// // // // //   };

// // // // //   const getImpactColor = (impact: number) => {
// // // // //     if (impact >= 8) return 'text-red-600';
// // // // //     if (impact >= 5) return 'text-orange-600';
// // // // //     return 'text-gray-600';
// // // // //   };

// // // // //   const getRowStyle = (index: number) => {
// // // // //     if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
// // // // //     if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
// // // // //     if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
// // // // //     return 'hover:bg-gray-50/50';
// // // // //   };

// // // // //   return (
// // // // //     <Card className="overflow-hidden">
// // // // //       {/* Header */}
// // // // //       <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
// // // // //         <div className="flex items-center justify-between">
// // // // //           <div>
// // // // //             <h2 className="text-lg font-semibold text-gray-900">
// // // // //               Repair Priority Queue
// // // // //             </h2>
// // // // //             <p className="text-sm text-gray-600 mt-1">
// // // // //               {rankedAssets.length} assets ranked by decision score
// // // // //             </p>
// // // // //           </div>
// // // // //           <Badge variant="outline" className="bg-white">
// // // // //             Top 3 Critical
// // // // //           </Badge>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Table */}
// // // // //       <div className="overflow-x-auto">
// // // // //         <table className="w-full">
// // // // //           <thead>
// // // // //             <tr className="border-b bg-gray-50/50">
// // // // //               <th className="px-6 py-4 text-left">
// // // // //                 <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
// // // // //                     #
// // // // //                   </span>
// // // // //                   Rank
// // // // //                 </div>
// // // // //               </th>
// // // // //               <th className="px-6 py-4 text-left">
// // // // //                 <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   Asset Details
// // // // //                 </span>
// // // // //               </th>
// // // // //               <th className="px-6 py-4 text-center">
// // // // //                 <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   Priority
// // // // //                 </span>
// // // // //               </th>
// // // // //               <th className="px-6 py-4 text-center">
// // // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   <AlertTriangle className="w-3.5 h-3.5" />
// // // // //                   Risk
// // // // //                 </div>
// // // // //               </th>
// // // // //               <th className="px-6 py-4 text-center">
// // // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   <TrendingUp className="w-3.5 h-3.5" />
// // // // //                   Impact
// // // // //                 </div>
// // // // //               </th>
// // // // //               <th className="px-6 py-4 text-center">
// // // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // // //                   <Clock className="w-3.5 h-3.5" />
// // // // //                   ETA
// // // // //                 </div>
// // // // //               </th>
// // // // //             </tr>
// // // // //           </thead>
// // // // //           <tbody className="divide-y divide-gray-200">
// // // // //             {rankedAssets.map((asset, index) => (
// // // // //               <tr
// // // // //                 key={asset.id}
// // // // //                 className={`transition-colors ${getRowStyle(index)}`}
// // // // //               >
// // // // //                 {/* Rank */}
// // // // //                 <td className="px-6 py-4">
// // // // //                   <div className="flex items-center gap-3">
// // // // //                     <span
// // // // //                       className={`
// // // // //                         flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
// // // // //                         ${
// // // // //                           index === 0
// // // // //                             ? 'bg-red-600 text-white'
// // // // //                             : index === 1
// // // // //                             ? 'bg-orange-500 text-white'
// // // // //                             : index === 2
// // // // //                             ? 'bg-yellow-500 text-white'
// // // // //                             : 'bg-gray-200 text-gray-700'
// // // // //                         }
// // // // //                       `}
// // // // //                     >
// // // // //                       {index + 1}
// // // // //                     </span>
// // // // //                     {index < 3 && (
// // // // //                       <Badge
// // // // //                         variant="outline"
// // // // //                         className={`
// // // // //                           text-xs font-medium
// // // // //                           ${
// // // // //                             index === 0
// // // // //                               ? 'border-red-300 text-red-700 bg-red-50'
// // // // //                               : index === 1
// // // // //                               ? 'border-orange-300 text-orange-700 bg-orange-50'
// // // // //                               : 'border-yellow-300 text-yellow-700 bg-yellow-50'
// // // // //                           }
// // // // //                         `}
// // // // //                       >
// // // // //                         Urgent
// // // // //                       </Badge>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 </td>

// // // // //                 {/* Asset Name */}
// // // // //                 <td className="px-6 py-4">
// // // // //                   <div>
// // // // //                     <p className="font-medium text-gray-900">{asset.name}</p>
// // // // //                     <p className="text-sm text-gray-500 mt-0.5">
// // // // //                       Score: {asset.decisionScore.toFixed(1)}
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 </td>

// // // // //                 {/* Priority */}
// // // // //                 <td className="px-6 py-4">
// // // // //                   <div className="flex justify-center">
// // // // //                     <PriorityBadge priority={asset.priority} />
// // // // //                   </div>
// // // // //                 </td>

// // // // //                 {/* Risk Score */}
// // // // //                 <td className="px-6 py-4">
// // // // //                   <div className="flex justify-center">
// // // // //                     <div
// // // // //                       className={`
// // // // //                         inline-flex items-center justify-center
// // // // //                         px-3 py-1.5 rounded-full font-semibold text-sm
// // // // //                         ${getRiskColor(asset.riskScore)}
// // // // //                       `}
// // // // //                     >
// // // // //                       {asset.riskScore}/10
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </td>

// // // // //                 {/* Impact */}
// // // // //                 <td className="px-6 py-4 text-center">
// // // // //                   <div className="flex items-center justify-center gap-2">
// // // // //                     <div className="flex gap-0.5">
// // // // //                       {[...Array(10)].map((_, i) => (
// // // // //                         <div
// // // // //                           key={i}
// // // // //                           className={`
// // // // //                             w-1.5 h-6 rounded-sm
// // // // //                             ${
// // // // //                               i < asset.impact
// // // // //                                 ? getImpactColor(asset.impact).replace('text-', 'bg-')
// // // // //                                 : 'bg-gray-200'
// // // // //                             }
// // // // //                           `}
// // // // //                         />
// // // // //                       ))}
// // // // //                     </div>
// // // // //                     <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
// // // // //                       {asset.impact}
// // // // //                     </span>
// // // // //                   </div>
// // // // //                 </td>

// // // // //                 {/* SLA Days */}
// // // // //                 <td className="px-6 py-4 text-center">
// // // // //                   <Badge
// // // // //                     variant="secondary"
// // // // //                     className="bg-blue-50 text-blue-700 border-blue-200"
// // // // //                   >
// // // // //                     {asset.slaDays} days
// // // // //                   </Badge>
// // // // //                 </td>
// // // // //               </tr>
// // // // //             ))}
// // // // //           </tbody>
// // // // //         </table>
// // // // //       </div>

// // // // //       {/* Footer */}
// // // // //       <div className="bg-gray-50 px-6 py-3 border-t">
// // // // //         <p className="text-xs text-gray-600">
// // // // //           Assets are automatically ranked based on risk score, business impact, and SLA requirements
// // // // //         </p>
// // // // //       </div>
// // // // //     </Card>
// // // // //   );
// // // // // }
// // // // import { mockAssets } from '@/data/mockAssets';
// // // // import { calculatePriorityScore } from '@/utils/prioritization';
// // // // import PriorityBadge from '@/components/common/PriorityBadge';
// // // // import AppShell from '@/components/layout/AppShell';
// // // // import { Card } from '@/components/ui/card';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// // // // export default function RepairTable() {
// // // //   const rankedAssets = [...mockAssets]
// // // //     .map(asset => ({
// // // //       ...asset,
// // // //       decisionScore: calculatePriorityScore(asset),
// // // //     }))
// // // //     .sort((a, b) => b.decisionScore - a.decisionScore);

// // // //   const getRiskColor = (score: number) => {
// // // //     if (score >= 8) return 'text-red-600 bg-red-50';
// // // //     if (score >= 5) return 'text-orange-600 bg-orange-50';
// // // //     return 'text-green-600 bg-green-50';
// // // //   };

// // // //   const getImpactColor = (impact: number) => {
// // // //     if (impact >= 8) return 'text-red-600';
// // // //     if (impact >= 5) return 'text-orange-600';
// // // //     return 'text-gray-600';
// // // //   };

// // // //   const getRowStyle = (index: number) => {
// // // //     if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
// // // //     if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
// // // //     if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
// // // //     return 'hover:bg-gray-50/50';
// // // //   };

// // // //   return (
// // // //     <AppShell>
// // // //       <Card className="overflow-hidden">
// // // //       {/* Header */}
// // // //       <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
// // // //         <div className="flex items-center justify-between">
// // // //           <div>
// // // //             <h2 className="text-lg font-semibold text-gray-900">
// // // //               Repair Priority Queue
// // // //             </h2>
// // // //             <p className="text-sm text-gray-600 mt-1">
// // // //               {rankedAssets.length} assets ranked by decision score
// // // //             </p>
// // // //           </div>
// // // //           <Badge variant="outline" className="bg-white">
// // // //             Top 3 Critical
// // // //           </Badge>
// // // //         </div>
// // // //       </div>

// // // //       {/* Table */}
// // // //       <div className="overflow-x-auto">
// // // //         <table className="w-full">
// // // //           <thead>
// // // //             <tr className="border-b bg-gray-50/50">
// // // //               <th className="px-6 py-4 text-left">
// // // //                 <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
// // // //                     #
// // // //                   </span>
// // // //                   Rank
// // // //                 </div>
// // // //               </th>
// // // //               <th className="px-6 py-4 text-left">
// // // //                 <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   Asset Details
// // // //                 </span>
// // // //               </th>
// // // //               <th className="px-6 py-4 text-center">
// // // //                 <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   Priority
// // // //                 </span>
// // // //               </th>
// // // //               <th className="px-6 py-4 text-center">
// // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   <AlertTriangle className="w-3.5 h-3.5" />
// // // //                   Risk
// // // //                 </div>
// // // //               </th>
// // // //               <th className="px-6 py-4 text-center">
// // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   <TrendingUp className="w-3.5 h-3.5" />
// // // //                   Impact
// // // //                 </div>
// // // //               </th>
// // // //               <th className="px-6 py-4 text-center">
// // // //                 <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // // //                   <Clock className="w-3.5 h-3.5" />
// // // //                   ETA
// // // //                 </div>
// // // //               </th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody className="divide-y divide-gray-200">
// // // //             {rankedAssets.map((asset, index) => (
// // // //               <tr
// // // //                 key={asset.id}
// // // //                 className={`transition-colors ${getRowStyle(index)}`}
// // // //               >
// // // //                 {/* Rank */}
// // // //                 <td className="px-6 py-4">
// // // //                   <div className="flex items-center gap-3">
// // // //                     <span
// // // //                       className={`
// // // //                         flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
// // // //                         ${
// // // //                           index === 0
// // // //                             ? 'bg-red-600 text-white'
// // // //                             : index === 1
// // // //                             ? 'bg-orange-500 text-white'
// // // //                             : index === 2
// // // //                             ? 'bg-yellow-500 text-white'
// // // //                             : 'bg-gray-200 text-gray-700'
// // // //                         }
// // // //                       `}
// // // //                     >
// // // //                       {index + 1}
// // // //                     </span>
// // // //                     {index < 3 && (
// // // //                       <Badge
// // // //                         variant="outline"
// // // //                         className={`
// // // //                           text-xs font-medium
// // // //                           ${
// // // //                             index === 0
// // // //                               ? 'border-red-300 text-red-700 bg-red-50'
// // // //                               : index === 1
// // // //                               ? 'border-orange-300 text-orange-700 bg-orange-50'
// // // //                               : 'border-yellow-300 text-yellow-700 bg-yellow-50'
// // // //                           }
// // // //                         `}
// // // //                       >
// // // //                         Urgent
// // // //                       </Badge>
// // // //                     )}
// // // //                   </div>
// // // //                 </td>

// // // //                 {/* Asset Name */}
// // // //                 <td className="px-6 py-4">
// // // //                   <div>
// // // //                     <p className="font-medium text-gray-900">{asset.name}</p>
// // // //                     <p className="text-sm text-gray-500 mt-0.5">
// // // //                       Score: {asset.decisionScore.toFixed(1)}
// // // //                     </p>
// // // //                   </div>
// // // //                 </td>

// // // //                 {/* Priority */}
// // // //                 <td className="px-6 py-4">
// // // //                   <div className="flex justify-center">
// // // //                     <PriorityBadge priority={asset.priority} />
// // // //                   </div>
// // // //                 </td>

// // // //                 {/* Risk Score */}
// // // //                 <td className="px-6 py-4">
// // // //                   <div className="flex justify-center">
// // // //                     <div
// // // //                       className={`
// // // //                         inline-flex items-center justify-center
// // // //                         px-3 py-1.5 rounded-full font-semibold text-sm
// // // //                         ${getRiskColor(asset.riskScore)}
// // // //                       `}
// // // //                     >
// // // //                       {asset.riskScore}/10
// // // //                     </div>
// // // //                   </div>
// // // //                 </td>

// // // //                 {/* Impact */}
// // // //                 <td className="px-6 py-4 text-center">
// // // //                   <div className="flex items-center justify-center gap-2">
// // // //                     <div className="flex gap-0.5">
// // // //                       {[...Array(10)].map((_, i) => (
// // // //                         <div
// // // //                           key={i}
// // // //                           className={`
// // // //                             w-1.5 h-6 rounded-sm
// // // //                             ${
// // // //                               i < asset.impact
// // // //                                 ? getImpactColor(asset.impact).replace('text-', 'bg-')
// // // //                                 : 'bg-gray-200'
// // // //                             }
// // // //                           `}
// // // //                         />
// // // //                       ))}
// // // //                     </div>
// // // //                     <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
// // // //                       {asset.impact}
// // // //                     </span>
// // // //                   </div>
// // // //                 </td>

// // // //                 {/* SLA Days */}
// // // //                 <td className="px-6 py-4 text-center">
// // // //                   <Badge
// // // //                     variant="secondary"
// // // //                     className="bg-blue-50 text-blue-700 border-blue-200"
// // // //                   >
// // // //                     {asset.slaDays} days
// // // //                   </Badge>
// // // //                 </td>
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>

// // // //       {/* Footer */}
// // // //       <div className="bg-gray-50 px-6 py-3 border-t">
// // // //         <p className="text-xs text-gray-600">
// // // //           Assets are automatically ranked based on risk score, business impact, and SLA requirements
// // // //         </p>
// // // //       </div>
// // // //     </Card>
// // // //     </AppShell>
// // // //   );
// // // // }
// // // "use client";

// // // import { mockAssets } from '@/data/mockAssets';
// // // import { calculatePriorityScore } from '@/utils/prioritization';
// // // import PriorityBadge from '@/components/common/PriorityBadge';
// // // import AppShell from '@/components/layout/AppShell';
// // // import { Card } from '@/components/ui/card';
// // // import { Badge } from '@/components/ui/badge';
// // // import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// // // export default function RepairTablePage() {
// // //   const rankedAssets = [...mockAssets]
// // //     .map(asset => ({
// // //       ...asset,
// // //       decisionScore: calculatePriorityScore(asset),
// // //     }))
// // //     .sort((a, b) => b.decisionScore - a.decisionScore);

// // //   const getRiskColor = (score: number) => {
// // //     if (score >= 8) return 'text-red-600 bg-red-50';
// // //     if (score >= 5) return 'text-orange-600 bg-orange-50';
// // //     return 'text-green-600 bg-green-50';
// // //   };

// // //   const getImpactColor = (impact: number) => {
// // //     if (impact >= 8) return 'text-red-600';
// // //     if (impact >= 5) return 'text-orange-600';
// // //     return 'text-gray-600';
// // //   };

// // //   const getRowStyle = (index: number) => {
// // //     if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
// // //     if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
// // //     if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
// // //     return 'hover:bg-gray-50/50';
// // //   };

// // //   return (
// // //     <AppShell>
// // //       <Card className="overflow-hidden w-full">
// // //         {/* Header */}
// // //         <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
// // //           <div className="flex items-center justify-between">
// // //             <div>
// // //               <h2 className="text-lg font-semibold text-gray-900">
// // //                 Repair Priority Queue
// // //               </h2>
// // //               <p className="text-sm text-gray-600 mt-1">
// // //                 {rankedAssets.length} assets ranked by decision score
// // //               </p>
// // //             </div>
// // //             <Badge variant="outline" className="bg-white">
// // //               Top 3 Critical
// // //             </Badge>
// // //           </div>
// // //         </div>

// // //         {/* Table */}
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full">
// // //             <thead>
// // //               <tr className="border-b bg-gray-50/50">
// // //                 <th className="px-6 py-4 text-left">
// // //                   <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
// // //                       #
// // //                     </span>
// // //                     Rank
// // //                   </div>
// // //                 </th>
// // //                 <th className="px-6 py-4 text-left">
// // //                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     Asset Details
// // //                   </span>
// // //                 </th>
// // //                 <th className="px-6 py-4 text-center">
// // //                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     Priority
// // //                   </span>
// // //                 </th>
// // //                 <th className="px-6 py-4 text-center">
// // //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     <AlertTriangle className="w-3.5 h-3.5" />
// // //                     Risk
// // //                   </div>
// // //                 </th>
// // //                 <th className="px-6 py-4 text-center">
// // //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     <TrendingUp className="w-3.5 h-3.5" />
// // //                     Impact
// // //                   </div>
// // //                 </th>
// // //                 <th className="px-6 py-4 text-center">
// // //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// // //                     <Clock className="w-3.5 h-3.5" />
// // //                     ETA
// // //                   </div>
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-gray-200">
// // //               {rankedAssets.map((asset, index) => (
// // //                 <tr
// // //                   key={asset.id}
// // //                   className={`transition-colors ${getRowStyle(index)}`}
// // //                 >
// // //                   {/* Rank */}
// // //                   <td className="px-6 py-4">
// // //                     <div className="flex items-center gap-3">
// // //                       <span
// // //                         className={`
// // //                           flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
// // //                           ${
// // //                             index === 0
// // //                               ? 'bg-red-600 text-white'
// // //                               : index === 1
// // //                               ? 'bg-orange-500 text-white'
// // //                               : index === 2
// // //                               ? 'bg-yellow-500 text-white'
// // //                               : 'bg-gray-200 text-gray-700'
// // //                           }
// // //                         `}
// // //                       >
// // //                         {index + 1}
// // //                       </span>
// // //                       {index < 3 && (
// // //                         <Badge
// // //                           variant="outline"
// // //                           className={`
// // //                             text-xs font-medium
// // //                             ${
// // //                               index === 0
// // //                                 ? 'border-red-300 text-red-700 bg-red-50'
// // //                                 : index === 1
// // //                                 ? 'border-orange-300 text-orange-700 bg-orange-50'
// // //                                 : 'border-yellow-300 text-yellow-700 bg-yellow-50'
// // //                             }
// // //                           `}
// // //                         >
// // //                           Urgent
// // //                         </Badge>
// // //                       )}
// // //                     </div>
// // //                   </td>

// // //                   {/* Asset Name */}
// // //                   <td className="px-6 py-4">
// // //                     <div>
// // //                       <p className="font-medium text-gray-900">{asset.name}</p>
// // //                       <p className="text-sm text-gray-500 mt-0.5">
// // //                         Score: {asset.decisionScore.toFixed(1)}
// // //                       </p>
// // //                     </div>
// // //                   </td>

// // //                   {/* Priority */}
// // //                   <td className="px-6 py-4">
// // //                     <div className="flex justify-center">
// // //                       <PriorityBadge priority={asset.priority} />
// // //                     </div>
// // //                   </td>

// // //                   {/* Risk Score */}
// // //                   <td className="px-6 py-4">
// // //                     <div className="flex justify-center">
// // //                       <div
// // //                         className={`
// // //                           inline-flex items-center justify-center
// // //                           px-3 py-1.5 rounded-full font-semibold text-sm
// // //                           ${getRiskColor(asset.riskScore)}
// // //                         `}
// // //                       >
// // //                         {asset.riskScore}/10
// // //                       </div>
// // //                     </div>
// // //                   </td>

// // //                   {/* Impact */}
// // //                   <td className="px-6 py-4 text-center">
// // //                     <div className="flex items-center justify-center gap-2">
// // //                       <div className="flex gap-0.5">
// // //                         {[...Array(10)].map((_, i) => (
// // //                           <div
// // //                             key={i}
// // //                             className={`
// // //                               w-1.5 h-6 rounded-sm
// // //                               ${
// // //                                 i < asset.impact
// // //                                   ? getImpactColor(asset.impact).replace('text-', 'bg-')
// // //                                   : 'bg-gray-200'
// // //                               }
// // //                             `}
// // //                           />
// // //                         ))}
// // //                       </div>
// // //                       <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
// // //                         {asset.impact}
// // //                       </span>
// // //                     </div>
// // //                   </td>

// // //                   {/* SLA Days */}
// // //                   <td className="px-6 py-4 text-center">
// // //                     <Badge
// // //                       variant="secondary"
// // //                       className="bg-blue-50 text-blue-700 border-blue-200"
// // //                     >
// // //                       {asset.slaDays} days
// // //                     </Badge>
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* Footer */}
// // //         <div className="bg-gray-50 px-6 py-3 border-t">
// // //           <p className="text-xs text-gray-600">
// // //             Assets are automatically ranked based on risk score, business impact, and SLA requirements
// // //           </p>
// // //         </div>
// // //       </Card>
// // //     </AppShell>
// // //   );
// // // }
// // "use client";

// // import { mockAssets } from '@/data/mockAssets';
// // import { calculatePriorityScore } from '@/utils/prioritization';
// // import PriorityBadge from '@/components/common/PriorityBadge';
// // import AppShell from '@/components/layout/AppShell';
// // import { Card } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// // export default function RepairTablePage() {
// //   const rankedAssets = [...mockAssets]
// //     .map(asset => ({
// //       ...asset,
// //       decisionScore: calculatePriorityScore(asset),
// //     }))
// //     .sort((a, b) => b.decisionScore - a.decisionScore);

// //   const getRiskColor = (score: number) => {
// //     if (score >= 8) return 'text-red-600 bg-red-50';
// //     if (score >= 5) return 'text-orange-600 bg-orange-50';
// //     return 'text-green-600 bg-green-50';
// //   };

// //   const getImpactColor = (impact: number) => {
// //     if (impact >= 8) return 'text-red-600';
// //     if (impact >= 5) return 'text-orange-600';
// //     return 'text-gray-600';
// //   };

// //   const getRowStyle = (index: number) => {
// //     if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
// //     if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
// //     if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
// //     return 'hover:bg-gray-50/50';
// //   };

// //   return (
// //     <AppShell>
// //       <Card className="overflow-hidden w-full">

// //         {/* Table */}
// //         <div className="overflow-x-auto">
// //         <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h2 className="text-lg font-semibold text-gray-900">
// //                 Repair Priority Queue
// //               </h2>
// //               <p className="text-sm text-gray-600 mt-1">
// //                 {rankedAssets.length} assets ranked by decision score
// //               </p>
// //             </div>
// //             <Badge variant="outline" className="bg-white">
// //               Top 3 Critical
// //             </Badge>
// //           </div>
// //         </div>
// //           <table className="w-full">
// //             <thead>
// //               <tr className="border-b bg-gray-50/50">
// //                 <th className="px-6 py-4 text-left">
// //                   <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
// //                       #
// //                     </span>
// //                     Rank
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-4 text-left">
// //                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     Asset Details
// //                   </span>
// //                 </th>
// //                 <th className="px-6 py-4 text-center">
// //                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     Priority
// //                   </span>
// //                 </th>
// //                 <th className="px-6 py-4 text-center">
// //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     <AlertTriangle className="w-3.5 h-3.5" />
// //                     Risk
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-4 text-center">
// //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     <TrendingUp className="w-3.5 h-3.5" />
// //                     Impact
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-4 text-center">
// //                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                     <Clock className="w-3.5 h-3.5" />
// //                     ETA
// //                   </div>
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {rankedAssets.map((asset, index) => (
// //                 <tr
// //                   key={asset.id}
// //                   className={`transition-colors ${getRowStyle(index)}`}
// //                 >
// //                   {/* Rank */}
// //                   <td className="px-6 py-4">
// //                     <div className="flex items-center gap-3">
// //                       <span
// //                         className={`
// //                           flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
// //                           ${
// //                             index === 0
// //                               ? 'bg-red-600 text-white'
// //                               : index === 1
// //                               ? 'bg-orange-500 text-white'
// //                               : index === 2
// //                               ? 'bg-yellow-500 text-white'
// //                               : 'bg-gray-200 text-gray-700'
// //                           }
// //                         `}
// //                       >
// //                         {index + 1}
// //                       </span>
// //                       {index < 3 && (
// //                         <Badge
// //                           variant="outline"
// //                           className={`
// //                             text-xs font-medium
// //                             ${
// //                               index === 0
// //                                 ? 'border-red-300 text-red-700 bg-red-50'
// //                                 : index === 1
// //                                 ? 'border-orange-300 text-orange-700 bg-orange-50'
// //                                 : 'border-yellow-300 text-yellow-700 bg-yellow-50'
// //                             }
// //                           `}
// //                         >
// //                           Urgent
// //                         </Badge>
// //                       )}
// //                     </div>
// //                   </td>

// //                   {/* Asset Name */}
// //                   <td className="px-6 py-4">
// //                     <div>
// //                       <p className="font-medium text-gray-900">{asset.name}</p>
// //                       <p className="text-sm text-gray-500 mt-0.5">
// //                         Score: {asset.decisionScore.toFixed(1)}
// //                       </p>
// //                     </div>
// //                   </td>

// //                   {/* Priority */}
// //                   <td className="px-6 py-4">
// //                     <div className="flex justify-center">
// //                       <PriorityBadge priority={asset.priority} />
// //                     </div>
// //                   </td>

// //                   {/* Risk Score */}
// //                   <td className="px-6 py-4">
// //                     <div className="flex justify-center">
// //                       <div
// //                         className={`
// //                           inline-flex items-center justify-center
// //                           px-3 py-1.5 rounded-full font-semibold text-sm
// //                           ${getRiskColor(asset.riskScore)}
// //                         `}
// //                       >
// //                         {asset.riskScore}/10
// //                       </div>
// //                     </div>
// //                   </td>

// //                   {/* Impact */}
// //                   <td className="px-6 py-4 text-center">
// //                     <div className="flex items-center justify-center gap-2">
// //                       <div className="flex gap-0.5">
// //                         {[...Array(10)].map((_, i) => (
// //                           <div
// //                             key={i}
// //                             className={`
// //                               w-1.5 h-6 rounded-sm
// //                               ${
// //                                 i < asset.impact
// //                                   ? getImpactColor(asset.impact).replace('text-', 'bg-')
// //                                   : 'bg-gray-200'
// //                               }
// //                             `}
// //                           />
// //                         ))}
// //                       </div>
// //                       <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
// //                         {asset.impact}
// //                       </span>
// //                     </div>
// //                   </td>

// //                   {/* SLA Days */}
// //                   <td className="px-6 py-4 text-center">
// //                     <Badge
// //                       variant="secondary"
// //                       className="bg-blue-50 text-blue-700 border-blue-200"
// //                     >
// //                       {asset.slaDays} days
// //                     </Badge>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Footer */}
// //         <div className="bg-gray-50 px-6 py-3 border-t">
// //           <p className="text-xs text-gray-600">
// //             Assets are automatically ranked based on risk score, business impact, and SLA requirements
// //           </p>
// //         </div>
// //       </Card>
// //     </AppShell>
// //   );
// // }
// "use client";

// import { mockAssets } from '@/data/mockAssets';
// import { calculatePriorityScore } from '@/utils/prioritization';
// import PriorityBadge from '@/components/common/PriorityBadge';
// import AppShell from '@/components/layout/AppShell';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// export default function RepairTablePage() {
//   const rankedAssets = [...mockAssets]
//     .map(asset => ({
//       ...asset,
//       decisionScore: calculatePriorityScore(asset),
//     }))
//     .sort((a, b) => b.decisionScore - a.decisionScore);

//   const getRiskColor = (score: number) => {
//     if (score >= 8) return 'text-red-600 bg-red-50';
//     if (score >= 5) return 'text-orange-600 bg-orange-50';
//     return 'text-green-600 bg-green-50';
//   };

//   const getImpactColor = (impact: number) => {
//     if (impact >= 8) return 'text-red-600';
//     if (impact >= 5) return 'text-orange-600';
//     return 'text-gray-600';
//   };

//   const getRowStyle = (index: number) => {
//     if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
//     if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
//     if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
//     return 'hover:bg-gray-50/50';
//   };

//   return (
//     <AppShell>
//       {/* Page Title - directly below topbar */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-slate-900">Repair Prioritization Queue</h1>
//         <p className="text-slate-600 mt-1">
//           Ranked repair actions based on risk, impact, and SLA constraints
//         </p>
//       </div>

//       {/* Table Card */}
//       <Card className="overflow-hidden w-full">
//         {/* Card Header */}
//         <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">
//                 {rankedAssets.length} assets ranked by decision score
//               </p>
//             </div>
//             <Badge variant="outline" className="bg-white">
//               Top 3 Critical
//             </Badge>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-gray-50/50">
//                 <th className="px-6 py-4 text-left">
//                   <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
//                       #
//                     </span>
//                     Rank
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left">
//                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Asset Details
//                   </span>
//                 </th>
//                 <th className="px-6 py-4 text-center">
//                   <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Priority
//                   </span>
//                 </th>
//                 <th className="px-6 py-4 text-center">
//                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <AlertTriangle className="w-3.5 h-3.5" />
//                     Risk
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-center">
//                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <TrendingUp className="w-3.5 h-3.5" />
//                     Impact
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-center">
//                   <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <Clock className="w-3.5 h-3.5" />
//                     ETA
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rankedAssets.map((asset, index) => (
//                 <tr
//                   key={asset.id}
//                   className={`transition-colors ${getRowStyle(index)}`}
//                 >
//                   {/* Rank */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <span
//                         className={`
//                           flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
//                           ${
//                             index === 0
//                               ? 'bg-red-600 text-white'
//                               : index === 1
//                               ? 'bg-orange-500 text-white'
//                               : index === 2
//                               ? 'bg-yellow-500 text-white'
//                               : 'bg-gray-200 text-gray-700'
//                           }
//                         `}
//                       >
//                         {index + 1}
//                       </span>
//                       {index < 3 && (
//                         <Badge
//                           variant="outline"
//                           className={`
//                             text-xs font-medium
//                             ${
//                               index === 0
//                                 ? 'border-red-300 text-red-700 bg-red-50'
//                                 : index === 1
//                                 ? 'border-orange-300 text-orange-700 bg-orange-50'
//                                 : 'border-yellow-300 text-yellow-700 bg-yellow-50'
//                             }
//                           `}
//                         >
//                           Urgent
//                         </Badge>
//                       )}
//                     </div>
//                   </td>

//                   {/* Asset Name */}
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="font-medium text-gray-900">{asset.name}</p>
//                       <p className="text-sm text-gray-500 mt-0.5">
//                         Score: {asset.decisionScore.toFixed(1)}
//                       </p>
//                     </div>
//                   </td>

//                   {/* Priority */}
//                   <td className="px-6 py-4">
//                     <div className="flex justify-center">
//                       <PriorityBadge priority={asset.priority} />
//                     </div>
//                   </td>

//                   {/* Risk Score */}
//                   <td className="px-6 py-4">
//                     <div className="flex justify-center">
//                       <div
//                         className={`
//                           inline-flex items-center justify-center
//                           px-3 py-1.5 rounded-full font-semibold text-sm
//                           ${getRiskColor(asset.riskScore)}
//                         `}
//                       >
//                         {asset.riskScore}/10
//                       </div>
//                     </div>
//                   </td>

//                   {/* Impact */}
//                   <td className="px-6 py-4 text-center">
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="flex gap-0.5">
//                         {[...Array(10)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`
//                               w-1.5 h-6 rounded-sm
//                               ${
//                                 i < asset.impact
//                                   ? getImpactColor(asset.impact).replace('text-', 'bg-')
//                                   : 'bg-gray-200'
//                               }
//                             `}
//                           />
//                         ))}
//                       </div>
//                       <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
//                         {asset.impact}
//                       </span>
//                     </div>
//                   </td>

//                   {/* SLA Days */}
//                   <td className="px-6 py-4 text-center">
//                     <Badge
//                       variant="secondary"
//                       className="bg-blue-50 text-blue-700 border-blue-200"
//                     >
//                       {asset.slaDays} days
//                     </Badge>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-3 border-t">
//           <p className="text-xs text-gray-600">
//             Assets are automatically ranked based on risk score, business impact, and SLA requirements
//           </p>
//         </div>
//       </Card>
//     </AppShell>
//   );
// }

"use client";

import { useState } from 'react';
import { mockAssets } from '@/data/mockAssets';
import { calculatePriorityScore } from '@/utils/prioritization';
import PriorityBadge from '@/components/common/PriorityBadge';
import AppShell from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, AlertTriangle, Check, X } from 'lucide-react';

type NotificationType = 'addressed' | 'dismissed' | null;

interface Notification {
  id: number;
  assetName: string;
  type: NotificationType;
}

export default function RepairTablePage() {
  const [displayedAssets, setDisplayedAssets] = useState(mockAssets);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  const rankedAssets = [...displayedAssets]
    .map(asset => ({
      ...asset,
      decisionScore: calculatePriorityScore(asset),
    }))
    .sort((a, b) => b.decisionScore - a.decisionScore);

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 5) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 8) return 'text-red-600';
    if (impact >= 5) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRowStyle = (index: number) => {
    if (index === 0) return 'bg-red-50/50 border-l-4 border-l-red-500';
    if (index === 1) return 'bg-orange-50/30 border-l-4 border-l-orange-400';
    if (index === 2) return 'bg-yellow-50/30 border-l-4 border-l-yellow-400';
    return 'hover:bg-gray-50/50';
  };

  const showNotification = (assetName: string, type: NotificationType) => {
    setFadeOut(false);
    setNotification({ id: Date.now(), assetName, type });

    // Auto-hide notification after 4 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setNotification(null), 300);
    }, 4000);

    return () => clearTimeout(timer);
  };

  const handleAddressed = (assetId: number, assetName: string) => {
    // Remove from display
    setDisplayedAssets(assets => assets.filter(a => a.id !== assetId));
    // Show notification
    showNotification(assetName, 'addressed');
  };

  const handleDismissed = (assetId: number, assetName: string) => {
    // Remove from display
    setDisplayedAssets(assets => assets.filter(a => a.id !== assetId));
    // Show notification
    showNotification(assetName, 'dismissed');
  };

  return (
    <AppShell>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Repair Prioritization Queue</h1>
        <p className="text-slate-600 mt-1">
          Ranked repair actions based on risk, impact, and SLA constraints
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 transform transition-all duration-300 z-50 ${
            fadeOut ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
              notification.type === 'addressed'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
          >
            {notification.type === 'addressed' ? (
              <>
                <Check className="w-5 h-5" />
                <span>✓ Problem addressed: {notification.assetName}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>✕ Problem dismissed: {notification.assetName}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Table Card */}
      <Card className="overflow-hidden w-full">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {rankedAssets.length} assets ranked by decision score
              </p>
            </div>
            <Badge variant="outline" className="bg-white">
              Top 3 Critical
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs">
                      #
                    </span>
                    Rank
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Asset Details
                  </span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Priority
                  </span>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Risk
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Impact
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    ETA
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rankedAssets.length > 0 ? (
                rankedAssets.map((asset, index) => (
                  <tr
                    key={asset.id}
                    className={`transition-colors ${getRowStyle(index)}`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                            flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                            ${
                              index === 0
                                ? 'bg-red-600 text-white'
                                : index === 1
                                ? 'bg-orange-500 text-white'
                                : index === 2
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }
                          `}
                        >
                          {index + 1}
                        </span>
                        {index < 3 && (
                          <Badge
                            variant="outline"
                            className={`
                              text-xs font-medium
                              ${
                                index === 0
                                  ? 'border-red-300 text-red-700 bg-red-50'
                                  : index === 1
                                  ? 'border-orange-300 text-orange-700 bg-orange-50'
                                  : 'border-yellow-300 text-yellow-700 bg-yellow-50'
                              }
                            `}
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Asset Name */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Score: {asset.decisionScore.toFixed(1)}
                        </p>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <PriorityBadge level={asset.priority} />
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div
                          className={`
                            inline-flex items-center justify-center
                            px-3 py-1.5 rounded-full font-semibold text-sm
                            ${getRiskColor(asset.riskScore)}
                          `}
                        >
                          {asset.riskScore}/10
                        </div>
                      </div>
                    </td>

                    {/* Impact */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`
                                w-1.5 h-6 rounded-sm
                                ${
                                  i < asset.impact
                                    ? getImpactColor(asset.impact).replace('text-', 'bg-')
                                    : 'bg-gray-200'
                                }
                              `}
                            />
                          ))}
                        </div>
                        <span className={`font-semibold text-sm ${getImpactColor(asset.impact)}`}>
                          {asset.impact}
                        </span>
                      </div>
                    </td>

                    {/* SLA Days */}
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {asset.slaDays} days
                      </Badge>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Addressed Button */}
                        <button
                          onClick={() => handleAddressed(asset.id, asset.name)}
                          className="group relative p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 transform hover:scale-110"
                          title="Problem addressed"
                        >
                          <Check className="w-5 h-5 text-green-600" />
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Problem Addressed
                          </div>
                        </button>

                        {/* Dismissed Button */}
                        <button
                          onClick={() => handleDismissed(asset.id, asset.name)}
                          className="group relative p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
                          title="Problem dismissed"
                        >
                          <X className="w-5 h-5 text-blue-600" />
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Problem Dismissed
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-600 font-medium">No repair items</p>
                      <p className="text-sm text-gray-500">All issues have been addressed or dismissed</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-xs text-gray-600">
            Assets are automatically ranked based on risk score, business impact, and SLA requirements.
            Use the action buttons to mark items as addressed or dismissed.
          </p>
        </div>
      </Card>
    </AppShell>
  );
}