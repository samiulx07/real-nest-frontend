import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const FlatCardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
      <div className="flex flex-col sm:flex-row bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-full">
        {/* Image Block Skeleton */}
        <div className="relative w-full sm:w-[45%] h-[220px] sm:h-auto min-h-[220px] shrink-0">
          <Skeleton height="100%" className="w-full h-full" />
        </div>

        {/* Details Block Skeleton */}
        <div className="w-full sm:w-[55%] p-5 flex flex-col justify-between gap-3 text-left">
          {/* Tag, Title & Location Skeleton */}
          <div className="space-y-2">
            <Skeleton height={14} width="50%" borderRadius={6} />
            <Skeleton height={20} width="85%" borderRadius={8} />
            <Skeleton height={14} width="60%" borderRadius={6} />
          </div>

          {/* Specs Grid Skeleton */}
          <div className="grid grid-cols-3 gap-1 border-y border-gray-100 py-2.5 text-center">
            <div>
              <Skeleton height={14} width="70%" className="mx-auto" borderRadius={6} />
            </div>
            <div>
              <Skeleton height={14} width="70%" className="mx-auto" borderRadius={6} />
            </div>
            <div>
              <Skeleton height={14} width="70%" className="mx-auto" borderRadius={6} />
            </div>
          </div>

          {/* Pricing & Buttons Skeleton */}
          <div className="flex flex-col gap-2.5">
            <div>
              <Skeleton height={10} width="40%" />
              <Skeleton height={22} width="65%" borderRadius={8} />
            </div>

            <div className="flex items-center gap-2 w-full">
              <Skeleton height={36} borderRadius={12} className="flex-1" />
              <Skeleton height={36} borderRadius={12} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default FlatCardSkeleton;
