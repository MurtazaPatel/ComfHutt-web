import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
      <Image
        src="/brand/comfhutt-logo.svg"
        alt="ComfHutt"
        width={160}
        height={32}
        className="h-8 w-auto mb-2"
        style={{ filter: "brightness(0) invert(1)" }}
        priority
      />
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
};