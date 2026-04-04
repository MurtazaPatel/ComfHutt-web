import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("comfhutt_access_token")?.value;

  if (!token) {
    redirect("/signin");
  }

  const res = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const session = res.ok ? await res.json() : null;

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-black">
      <Navbar user={session} />
      <div className="pt-20 w-full max-w-6xl px-4">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;