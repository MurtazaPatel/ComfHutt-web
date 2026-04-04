import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default SignInPage;