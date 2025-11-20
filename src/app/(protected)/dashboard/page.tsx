import { auth } from "@/auth";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

const DashboardPage = async () => {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Investor";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Hello, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl">
          Welcome to your command center. Explore the future of fractional real estate and autonomous property intelligence.
        </p>
      </div>

      <DashboardGrid />
      
      <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
        <h3 className="text-lg font-semibold text-white mb-2">Waitlist Status</h3>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-emerald-400 font-medium">Approved & Active</p>
        </div>
        <p className="text-white/50 text-sm mt-2">
          You have early access to our AI validator beta. Full trading features unlock in Q3 2025.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;