import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
      <h1 className={cn("text-2xl font-bold text-white tracking-tight")}>COMFHUTT</h1>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
};