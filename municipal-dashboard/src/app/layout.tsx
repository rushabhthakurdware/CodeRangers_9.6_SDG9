// "use client";
// import "@/app/globals.css";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "@/lib/queryClient";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="flex h-screen bg-slate-100">
//         <QueryClientProvider client={queryClient}>
//           {children}
//         </QueryClientProvider>
//       </body>
//     </html>
//   );
// }
"use client";
import "@/app/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen bg-slate-100 m-0 p-0 overflow-hidden">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}