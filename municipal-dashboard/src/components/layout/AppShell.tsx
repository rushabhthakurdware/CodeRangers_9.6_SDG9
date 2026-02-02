// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// export default function AppShell({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <Sidebar />
//       <div className="flex flex-col flex-1">
//         <Topbar />
//         <main className="p-6 overflow-auto">{children}</main>
//       </div>
//     </>
//   );
// }
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto bg-gray-50 w-full">{children}</main>
      </div>
    </div>
  );
}