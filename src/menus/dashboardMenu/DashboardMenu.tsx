"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRootContext } from "@/contexts/RootContext";
import {
  HiOutlineSquares2X2,
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineQuestionMarkCircle,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineXMark,
  HiOutlinePhoto,
} from "react-icons/hi2";

interface DashboardMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useRootContext();

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: HiOutlineSquares2X2,
      roles: ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"],
    },
    {
      name: "Properties",
      href: "/dashboard/properties",
      icon: HiOutlineBuildingOffice2,
      roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    },
    {
      name: "Flats & Units",
      href: "/dashboard/flats",
      icon: HiOutlineHome,
      roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    },
    {
      name: "Media Library",
      href: "/dashboard/media",
      icon: HiOutlinePhoto,
      roles: ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"],
    },
    {
      name: "My Bookings",
      href: "/dashboard/my-bookings",
      icon: HiOutlineBookmark,
      roles: ["CUSTOMER"],
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: HiOutlineDocumentText,
      roles: ["CUSTOMER"],
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: HiOutlineCreditCard,
      roles: ["CUSTOMER"],
    },
    {
      name: "Support",
      href: "/dashboard/support",
      icon: HiOutlineQuestionMarkCircle,
      roles: ["CUSTOMER"],
    },
    {
      name: "My Account",
      href: "/dashboard/my-account",
      icon: HiOutlineUser,
      roles: ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !user?.role || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#00062A]/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[270px] bg-[#00062A] text-slate-300 z-50 flex flex-col justify-between border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Brand Logo */}
        <div>
          <div className="h-18 px-6 flex items-center justify-between border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3 group no-underline">
              <Image
                src="/logo-icon-white-bg.png"
                alt="RealNest Logo"
                width={38}
                height={38}
                className="rounded-lg object-contain group-hover:scale-105 transition"
              />
              <div className="flex flex-col">
                <span className="text-white font-black tracking-tight text-base group-hover:text-[#FF4C00] transition">
                  Real<span className="text-[#FF4C00]">Nest</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#FF4C00]">
                  Control Panel
                </span>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            {filteredNavItems.map((item) => {

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF4C00] text-white shadow-lg shadow-[#FF4C00]/25"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions - Sign Out Only */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer border-none bg-transparent"
          >
            <HiOutlineArrowLeftOnRectangle className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardMenu;
