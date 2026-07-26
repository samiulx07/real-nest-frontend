"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineBookmark, HiOutlineBuildingOffice2, HiOutlineClock } from "react-icons/hi2";

export const MyBookingsMainView = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#00062A] text-white p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
            <HiOutlineBookmark className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Flat Bookings & Reservations
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track your reserved property units, booking status, and handover progress.
          </p>
        </div>

        <Link
          href="/flats"
          className="px-4 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#FF4C00]/20 transition shrink-0"
        >
          <HiOutlineBuildingOffice2 className="w-4 h-4" />
          <span>Browse Available Flats</span>
        </Link>
      </div>

      {/* Bookings Card Container */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/10 text-[#FF4C00] flex items-center justify-center mx-auto">
          <HiOutlineClock className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-[#00062A]">No Active Reservations</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          You haven't submitted any flat booking requests yet. Browse our project listings to reserve your dream home.
        </p>
        <div className="pt-2">
          <Link
            href="/flats"
            className="inline-flex px-5 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#00062A]/90 transition"
          >
            Explore Property Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsMainView;
