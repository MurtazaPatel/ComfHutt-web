import { cn } from "@/lib/utils";

export function LensChatSkeleton() {
  return (
    <div className="flex flex-col py-6 gap-6 max-w-[768px] mx-auto w-full flex-1 overflow-y-auto">
      {/* Assistant Message Skeleton */}
      <div className="flex items-start gap-4">
        <div className="w-[34px] h-[34px] rounded-full bg-gray-200 flex-shrink-0 animate-pulse" />
        <div className="flex flex-col gap-2 mt-1 w-full">
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* User Message Skeleton */}
      <div className="flex items-start gap-4 flex-row-reverse mt-4">
        <div className="w-[34px] h-[34px] rounded-full bg-gray-200 flex-shrink-0 animate-pulse" />
        <div className="flex flex-col gap-2 mt-1 w-full items-end">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Another Assistant Message Skeleton with Tool Card */}
      <div className="flex items-start gap-4 mt-4">
        <div className="w-[34px] h-[34px] rounded-full bg-gray-200 flex-shrink-0 animate-pulse" />
        <div className="flex flex-col gap-3 mt-1 w-full">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          
          {/* Tool Card Skeleton */}
          <div className="border border-[#ededed] bg-white rounded-xl p-4 mt-2 max-w-[400px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-1/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-[60px] w-full bg-gray-50 rounded mt-3 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Thinking / Shining Spark */}
      <div className="flex items-start gap-4 mt-4">
        <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 bg-crux-green-tint">
          <span className="text-[14px] text-crux-green">✦</span>
        </div>
        <div className="flex flex-col mt-1">
          <div className="relative overflow-hidden inline-block">
            <span className="text-[15px] font-medium text-crux-text-primary animate-pulse bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-transparent">
              Connecting to CRUX...
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
