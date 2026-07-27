import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const FlatDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
      <div className="min-h-screen bg-[#fafbfc] pb-16">
        {/* Header Banner Skeleton */}
        <div className="bg-[#00062A] text-white pt-28 pb-16 md:pt-32 md:pb-20 px-4">
          <div className="container mx-auto max-w-6xl space-y-4">
            <Skeleton height={16} width={120} borderRadius={6} baseColor="#1e293b" highlightColor="#334155" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <Skeleton height={20} width={80} borderRadius={20} baseColor="#1e293b" highlightColor="#334155" />
                  <Skeleton height={20} width={90} borderRadius={20} baseColor="#1e293b" highlightColor="#334155" />
                </div>
                <Skeleton height={36} width="60%" borderRadius={10} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton height={16} width="40%" borderRadius={6} baseColor="#1e293b" highlightColor="#334155" />
              </div>
              <Skeleton height={60} width={180} borderRadius={16} baseColor="#1e293b" highlightColor="#334155" />
            </div>
          </div>
        </div>

        {/* Main Content Layout Skeleton */}
        <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery Skeleton */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <Skeleton height={380} borderRadius={16} />
              </div>

              {/* Description Skeleton */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <Skeleton height={20} width={180} borderRadius={6} />
                <Skeleton count={3} height={14} borderRadius={4} />
              </div>

              {/* Flat Specifications Skeleton */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <Skeleton height={20} width={160} borderRadius={6} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <Skeleton key={idx} height={48} borderRadius={12} />
                  ))}
                </div>
              </div>

              {/* Map Preview Skeleton */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <Skeleton height={20} width={180} borderRadius={6} />
                <Skeleton height={240} borderRadius={12} />
              </div>
            </div>

            {/* Right Column (1 Col) */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <Skeleton height={14} width="40%" borderRadius={4} />
                <Skeleton height={22} width="80%" borderRadius={8} />
                <Skeleton height={14} width="60%" borderRadius={4} />
                <Skeleton height={38} borderRadius={12} className="mt-2" />
              </div>

              <div className="bg-[#00062A] p-6 rounded-2xl space-y-4">
                <Skeleton height={24} width="70%" borderRadius={8} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton count={2} height={14} borderRadius={4} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton height={44} borderRadius={12} baseColor="#1e293b" highlightColor="#334155" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default FlatDetailsSkeleton;
