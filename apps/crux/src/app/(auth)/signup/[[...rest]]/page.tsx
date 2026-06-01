import AuthLayoutClient from "@/components/auth/AuthLayoutClient";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <AuthLayoutClient variant="signup">
      <SignUp
        forceRedirectUrl="/onboarding"
        fallbackRedirectUrl="/onboarding"
        signInUrl="/signin"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0 p-0 bg-transparent",
            headerTitle: "text-2xl font-bold text-crux-text-primary tracking-tight",
            headerSubtitle: "text-sm text-crux-text-secondary",
            formButtonPrimary:
              "bg-crux-green hover:bg-crux-green-mid text-white font-semibold rounded-full h-12 text-sm",
            formFieldInput:
              "rounded-full border-crux-border h-12 px-4 text-sm text-crux-text-primary",
            formFieldLabel: "text-xs font-semibold uppercase tracking-wider text-crux-text-secondary",
            footerActionText: "text-sm text-crux-text-secondary",
            footerActionLink: "text-crux-green hover:underline font-medium",
            dividerLine: "bg-crux-border",
            dividerText: "text-crux-text-muted text-xs",
            socialButtonsBlockButton:
              "rounded-full border-crux-border h-11 text-sm font-medium hover:bg-crux-bg-secondary",
            socialButtonsBlockButtonText: "text-crux-text-primary font-medium",
            socialButtonsProviderIcon: "w-5 h-5",
            formFieldAction: "text-crux-green text-xs",
            alert: "rounded-xl text-sm",
          },
        }}
      />
    </AuthLayoutClient>
  );
}