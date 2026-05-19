import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      {/* Espaço para sidebar desktop / topbar mobile */}
      <div className="md:pl-60 pt-14 md:pt-0">
        <main className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
