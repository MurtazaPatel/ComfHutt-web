// @ts-nocheck
import { supabase } from "@/lib/db";

const AdminDashboardPage = async () => {
  const { count: userCount, error: userError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: leadCount, error: leadError } = await supabase
    .from("users_leads")
    .select("*", { count: "exact", head: true });

  if (userError || leadError) {
    console.error("Error fetching admin dashboard data:", userError, leadError);
    // You might want to render an error state here
    return <div>Error loading data.</div>;
  }

  return (
    <div className="bg-white/5 p-10 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-2">{userCount}</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Total Leads</h3>
          <p className="text-3xl font-bold text-white mt-2">{leadCount}</p>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-white/70 text-sm font-medium">Conversion Rate</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {leadCount > 0 ? ((userCount / leadCount) * 100).toFixed(1) : 0}%
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