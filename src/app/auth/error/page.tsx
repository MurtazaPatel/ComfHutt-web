import { CardWrapper } from "@/components/auth/CardWrapper";

const AuthErrorPage = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
    >
      <div className="w-full flex justify-center items-center text-red-500 bg-red-500/15 p-4 rounded-md">
        <p>Something went wrong during authentication.</p>
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;