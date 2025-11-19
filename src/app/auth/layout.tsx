const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-black pt-20 pb-20 min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;