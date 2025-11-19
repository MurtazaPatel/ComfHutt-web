import { db } from "@/lib/db";

const AdminDashboardPage = async () => {
  const userCount = await db.user.count();
  const waitlistCount = await db.waitlistEntry.count();

  return (
    <div className="bg-white/5 p-10 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-2">{userCount}</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Waitlist Entries</h3>
          <p className="text-3xl font-bold text-white mt-2">{waitlistCount}</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Conversion Rate</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {waitlistCount > 0 ? ((userCount / waitlistCount) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Actions</h2>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center text-white/50">
          <p>Export functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;