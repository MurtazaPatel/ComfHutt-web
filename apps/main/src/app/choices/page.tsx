import React from "react";
import ChoicesCard from "@/components/ChoicesCard";

export const metadata = {
  title: "Your Choice | ComfHutt",
  description: "Tell us your goals and join the future of real estate investing.",
};

export default function ChoicePage() {
  return (
    <main className="min-h-screen bg-[#F5F7F8] flex flex-col">
      
      <div className="flex-1 flex items-center justify-center p-4 pt-24 md:pt-32 pb-20 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-60" />
         </div>

        <div className="relative z-10 w-full flex justify-center">
          <ChoicesCard />
        </div>
      </div>
    </main>
  );
}