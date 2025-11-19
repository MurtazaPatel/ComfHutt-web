import { auth, signOut } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();

  return (
    <div className="bg-white/5 p-10 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <p className="text-white font-medium">User Information</p>
          <div className="mt-2 space-y-1 text-sm text-white/70">
            <p>ID: {session?.user?.id}</p>
            <p>Name: {session?.user?.name}</p>
            <p>Email: {session?.user?.email}</p>
            <p>Role: {session?.user?.role}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
           <div>
              <h3 className="text-emerald-500 font-semibold">Waitlist Status</h3>
              <p className="text-emerald-500/70 text-sm">You are on the waitlist!</p>
           </div>
           <span className="bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded">APPROVED</span>
        </div>

        <form action={async () => {
          "use server";
          await signOut();
        }}>
          <button type="submit" className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-white/90 transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;