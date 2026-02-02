// "use client";

// import AppShell from "@/components/layout/AppShell";
// import { useQuery } from "@tanstack/react-query";
// import { fetchRepairs } from "@/lib/api";
// import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
// import PriorityBadge from "@/components/common/PriorityBadge";
// import 'leaflet/dist/leaflet.css';



// export default function RepairsPage() {
//   const { data } = useQuery({
//     queryKey: ["repairs"],
//     queryFn: fetchRepairs,
//   });

//   return (
//     <AppShell>
//       <h2 className="text-xl font-semibold mb-4">Repair Priority Queue</h2>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Asset</TableCell>
//             <TableCell>Priority</TableCell>
//             <TableCell>Cost</TableCell>
//             <TableCell>Reason</TableCell>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.map((r) => (
//             <TableRow key={r.id}>
//               <TableCell>{r.id}</TableCell>
//               <TableCell>{r.asset}</TableCell>
//               <TableCell>
//                 <PriorityBadge level={r.priority} />
//               </TableCell>
//               <TableCell>₹{r.cost.toLocaleString()}</TableCell>
//               <TableCell className="text-sm text-muted-foreground">
//                 {r.explanation}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </AppShell>
//   );
// }
import RepairTable from '@/app/repairs/RepairTable';

export default function Repairs() {
  return (
    <div className="space-y-6">
      <RepairTable />
    </div>
  );
}
