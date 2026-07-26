"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRootContext } from "@/contexts/RootContext";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

interface DashboardTopBarProps {
  onToggleSidebar: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  onToggleSidebar,
}) => {
  const pathname = usePathname();
  const { user } = useRootContext();

  const getTitle = () => {
    if (pathname.includes("/properties/create")) return "Add New Property";
    if (pathname.includes("/properties")) return "Property Management";
    if (pathname.includes("/flats/create")) return "Add New Flat";
    if (pathname.includes("/flats")) return "Flats Inventory";
    if (pathname.includes("/my-account")) return "My Account";
    return "Dashboard Overview";
  };

  const isAdminOrStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "STAFF";

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          aria-label="Open sidebar"
        >
          <HiOutlineBars3 className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-black text-[#00062A] tracking-tight">
            {getTitle()}
          </h1>
          <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
            Real Nest Management System
          </p>
        </div>
      </div>

      {/* Right: Quick Actions & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Quick Action Buttons for Admin/Staff */}
        {isAdminOrStaff && (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/dashboard/properties/create"
              className="px-3.5 py-2 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#FF4C00]/20 transition active:scale-98"
            >
              <HiOutlinePlus className="w-4 h-4 stroke-[3]" />
              <span>Add Property</span>
            </Link>
            <Link
              href="/dashboard/flats/create"
              className="px-3.5 py-2 rounded-xl bg-[#00062A] hover:bg-[#00062A]/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#00062A]/10 transition active:scale-98"
            >
              <HiOutlinePlus className="w-4 h-4 stroke-[3]" />
              <span>Add Flat</span>
            </Link>
          </div>
        )}

        {/* Notifications Icon */}
        <button className="p-2.5 rounded-xl text-slate-500 hover:text-[#00062A] hover:bg-slate-100 transition relative cursor-pointer border-none bg-transparent">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4C00]" />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-1.5 pl-2.5 rounded-full">
          <div className="w-7 h-7 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] font-black text-xs flex items-center justify-center">
            {user?.fullName?.charAt(0).toUpperCase() || <HiOutlineUser />}
          </div>
          <span className="hidden md:inline text-xs font-bold text-[#00062A] pr-2 max-w-[120px] truncate">
            {user?.fullName || "User Profile"}
          </span>
        </div>


      </div>
    </header>
  );
};

export default DashboardTopBar;
