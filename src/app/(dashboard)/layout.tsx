"use client";

import React, { useState } from "react";
import DashboardMenu from "@/menus/dashboardMenu/DashboardMenu";
import DashboardTopBar from "@/components/dashboardTopBar/DashboardTopBar";
import { useRootContext } from "@/contexts/RootContext";
import Link from "next/link";
import { HiOutlineLockClosed, HiOutlineArrowRight } from "react-icons/hi2";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, authLoading } = useRootContext();

  // Show loading spinner during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#00062A] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4C00]/20 border-t-[#FF4C00] animate-spin" />
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  // Redirect / Guard unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-[#00062A] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] flex items-center justify-center mx-auto">
            <HiOutlineLockClosed className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Access Restricted
            </h2>
            <p className="text-xs font-medium text-slate-300 mt-2 leading-relaxed">
              You must be logged in to view the Real Nest management dashboard. Please sign in to access control options.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/20 transition active:scale-98"
            >
              <span>Sign In to Dashboard</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation Menu */}
      <DashboardMenu
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px] transition-all duration-300">
        <DashboardTopBar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
