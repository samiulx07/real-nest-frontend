"use client";

import React from "react";
import { useRootContext } from "@/contexts/RootContext";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

export const DashboardMainView = () => {
  const { user } = useRootContext();

  return (
    <div className="space-y-6">
      {/* Overview Header Placeholder */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
            <HiOutlineSquares2X2 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Welcome, {user?.fullName || "User"}!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Overview dashboard workspace ready for customization.
          </p>
        </div>
      </div>

      {/* Empty Overview Container Placeholder */}
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 shadow-sm text-center space-y-3 min-h-[350px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00062A]/5 text-[#00062A] flex items-center justify-center">
          <HiOutlineSquares2X2 className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-base font-bold text-[#00062A]">Overview Canvas Ready</h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          This page is currently kept empty for your custom overview implementation.
        </p>
      </div>
    </div>
  );
};

export default DashboardMainView;
