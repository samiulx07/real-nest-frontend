"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./publicHeaderMenu.module.css";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiGrid,
  FiBookmark,
  FiFileText,
  FiCreditCard,
  FiHelpCircle,
  FiHome,
} from "react-icons/fi";
import { useRootContext } from "@/contexts/RootContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Flats", href: "/flats" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function PublicHeaderMenu() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, authLoading } = useRootContext();

  const isAdminOrStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "STAFF";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Click outside to close desktop user dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <nav className="flex items-center justify-between px-4 h-16 max-w-[1436px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
            <Image
              src="/logo-icon-white-bg.png"
              alt="RealNest Logo"
              width={42}
              height={42}
              className="rounded-lg object-contain"
            />
            <span className="text-xl font-bold text-secondary tracking-tight">
              Real<span className="text-primary">Nest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-[14.5px] font-medium no-underline rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/5 ${
                    isActive(link.href) ? "text-primary font-bold" : "text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA + User Menu + Mobile Burger */}
          <div className="flex items-center gap-4">
            {/* User Dropdown / Skeleton / Sign In Link */}
            <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
              {authLoading ? (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 bg-white">
                  <Skeleton circle height={32} width={32} />
                  <Skeleton height={14} width={70} borderRadius={6} className="hidden lg:block" />
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer bg-white shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-sm font-semibold text-secondary max-w-[120px] truncate">
                      {user.fullName.split(" ")[0]}
                    </span>
                    <FiChevronDown className="text-gray-400 text-xs hidden lg:block" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-2 z-[1000] text-left animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-black text-secondary truncate">{user.fullName}</p>
                        <p className="text-[10px] font-medium text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                        >
                          <FiGrid className="text-primary text-sm" />
                          Dashboard Overview
                        </Link>

                        {isAdminOrStaff ? (
                          <>
                            <Link
                              href="/dashboard/properties"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiHome className="text-gray-400 text-sm" />
                              Properties Directory
                            </Link>
                            <Link
                              href="/dashboard/flats"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiBookmark className="text-gray-400 text-sm" />
                              Flats Inventory
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/dashboard/my-bookings"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiBookmark className="text-gray-400 text-sm" />
                              My Bookings
                            </Link>
                            <Link
                              href="/dashboard/billing"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiFileText className="text-gray-400 text-sm" />
                              Billing
                            </Link>
                            <Link
                              href="/dashboard/payments"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiCreditCard className="text-gray-400 text-sm" />
                              Payments
                            </Link>
                            <Link
                              href="/dashboard/support"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline"
                            >
                              <FiHelpCircle className="text-gray-400 text-sm" />
                              Support
                            </Link>
                          </>
                        )}

                        <Link
                          href="/dashboard/my-account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-secondary hover:bg-gray-50 hover:text-primary transition-colors no-underline border-t border-gray-100 mt-1 pt-2"
                        >
                          <FiUser className="text-gray-400 text-sm" />
                          My Profile & Account
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            window.location.href = "/login";
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <FiLogOut className="text-red-400 text-sm" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex text-[14.5px] font-semibold text-secondary hover:text-primary no-underline transition-colors mr-1"
                >
                  Sign In
                </Link>
              )}
            </SkeletonTheme>

            {isAdminOrStaff ? (
              <Link
                href="/projects"
                className={`hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white no-underline rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-0.5 ${styles.ctaButton}`}
              >
                View All Property
              </Link>
            ) : (
              <Link
                href="/flats"
                className={`hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white no-underline rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-0.5 ${styles.ctaButton}`}
              >
                View All Flats
              </Link>
            )}

            {/* Burger button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-secondary text-2xl bg-transparent border-none cursor-pointer transition-colors hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[999] md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ""}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 no-underline"
          >
            <Image
              src="/logo-icon-white-bg.png"
              alt="RealNest Logo"
              width={36}
              height={36}
              className="rounded-lg object-contain"
            />
            <span className="text-lg font-bold text-secondary tracking-tight">
              Real<span className="text-primary">Nest</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary text-xl bg-transparent border-none cursor-pointer hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        {/* User Mobile Info / Quick Login */}
        {authLoading ? (
          <div className="px-4 py-3 border-b border-gray-100">
            <Skeleton height={36} borderRadius={8} />
          </div>
        ) : user ? (
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-secondary truncate">
                  {user.fullName || "User Account"}
                </div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={
                  user.role === "SUPER_ADMIN" || user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/my-account"
                }
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-primary bg-primary/10 rounded-lg no-underline hover:bg-primary/20 transition-colors"
              >
                <FiGrid className="text-xs" />
                {user.role === "SUPER_ADMIN" || user.role === "ADMIN"
                  ? "Admin Panel"
                  : "Dashboard"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  window.location.href = "/login";
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-600 bg-red-50 rounded-lg border-none cursor-pointer hover:bg-red-100 transition-colors"
              >
                <FiLogOut className="text-xs" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-100">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full py-2.5 text-sm font-bold text-primary bg-primary/10 rounded-lg no-underline hover:bg-primary/20 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        <ul className="flex flex-col gap-1 list-none m-0 p-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-[15px] font-medium no-underline rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/5 ${
                  isActive(link.href) ? "text-primary bg-primary/5 font-bold" : "text-secondary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-4 mt-2">
          {isAdminOrStaff ? (
            <Link
              href="/projects"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-center w-full py-3 text-sm font-semibold text-white no-underline rounded-lg ${styles.ctaButton}`}
            >
              View All Property
            </Link>
          ) : (
            <Link
              href="/flats"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-center w-full py-3 text-sm font-semibold text-white no-underline rounded-lg ${styles.ctaButton}`}
            >
              View All Flats
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
