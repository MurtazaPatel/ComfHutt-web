import AuthLayoutClient from "@/components/auth/AuthLayoutClient";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayoutClient variant="signup">
      <SignUpForm />
    </AuthLayoutClient>
  );
}