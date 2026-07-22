import AuthLayoutClient from "@/components/auth/AuthLayoutClient";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutClient variant="signin">
      <ForgotPasswordForm />
    </AuthLayoutClient>
  );
}
