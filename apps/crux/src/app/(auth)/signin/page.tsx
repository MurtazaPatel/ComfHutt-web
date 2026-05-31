import AuthLayoutClient from "@/components/auth/AuthLayoutClient";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthLayoutClient variant="signin">
      <SignInForm />
    </AuthLayoutClient>
  );
}