import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
      <div className="relative flex flex-col pb-6 select-none h-full">
        {/* Image Container Skeleton */}
        <div className="relative h-[320px] w-full rounded-[16px] overflow-hidden shadow-sm">
          <Skeleton height="100%" className="w-full h-full" />
        </div>

        {/* Content Box Skeleton */}
        <div className="bg-white rounded-[16px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] mx-4 -mt-24 relative z-10 border border-gray-100/50 flex flex-col justify-between gap-4 flex-1">
          {/* Title & Location Skeleton */}
          <div className="text-left w-full space-y-2">
            <Skeleton height={22} width="80%" borderRadius={8} />
            <Skeleton height={14} width="55%" borderRadius={6} />
          </div>

          <div className="w-full h-[1px] bg-gray-100" />

          {/* Specs Skeleton Grid */}
          <div className="grid grid-cols-3 gap-2 w-full text-center">
            <div>
              <Skeleton height={10} width="60%" className="mx-auto mb-1" />
              <Skeleton height={16} width="80%" className="mx-auto" borderRadius={6} />
            </div>
            <div>
              <Skeleton height={10} width="60%" className="mx-auto mb-1" />
              <Skeleton height={16} width="80%" className="mx-auto" borderRadius={6} />
            </div>
            <div>
              <Skeleton height={10} width="60%" className="mx-auto mb-1" />
              <Skeleton height={16} width="80%" className="mx-auto" borderRadius={6} />
            </div>
          </div>

          {/* Button Skeleton */}
          <Skeleton height={38} borderRadius={12} className="w-full" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PropertyCardSkeleton;
