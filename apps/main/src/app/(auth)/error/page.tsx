import { CardWrapper } from "@/components/auth/CardWrapper";

const AuthErrorPage = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
    >
      <div className="w-full flex justify-center items-center text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded text-sm">
        <p>Something went wrong during authentication.</p>
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;