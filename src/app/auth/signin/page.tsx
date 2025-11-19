import { LoginForm } from "@/components/auth/LoginForm";

const SignInPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-black">
      <LoginForm />
    </div>
  );
};

export default SignInPage;