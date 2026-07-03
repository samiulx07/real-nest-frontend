"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./publicHeaderMenu.module.css";
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { useRootContext } from "@/contexts/RootContext";

const navLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
];

export default function PublicHeaderMenu() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useRootContext();

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
    return () => { document.body.style.overflow = ""; };
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
                    isActive(link.href) ? "text-primary" : "text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA + User Menu + Mobile Burger */}
          <div className="flex items-center gap-4">
            
            {/* User Dropdown / Sign In Link */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 transition-colors cursor-pointer bg-transparent"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/8 text-primary flex items-center justify-center font-bold text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-semibold text-secondary max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <FiChevronDown className="text-gray-400 text-xs hidden lg:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2 z-[1000] text-left animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-secondary truncate">{user.fullName}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-gray-50 transition-colors no-underline"
                    >
                      <FiUser className="text-gray-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <FiLogOut className="text-red-400" />
                      Sign Out
                    </button>
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

            <Link
              href="/list-property"
              className={`hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white no-underline rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-0.5 ${styles.ctaButton}`}
            >
              List Your Property
            </Link>

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
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 no-underline" onClick={() => setMobileOpen(false)}>
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
            className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary text-xl bg-transparent border-none cursor-pointer hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        {/* Mobile User Profile Section */}
        {user ? (
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/8 text-primary flex items-center justify-center font-bold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left truncate">
                <p className="text-sm font-bold text-secondary truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 text-xs font-semibold text-secondary rounded-lg no-underline"
              >
                <FiUser /> Profile
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                  window.location.href = "/login";
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-xs font-semibold text-red-600 rounded-lg border-none cursor-pointer"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-100">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full py-2.5 bg-gray-50 border border-gray-200 text-sm font-semibold text-secondary rounded-lg no-underline"
            >
              Sign In
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
                  isActive(link.href) ? "text-primary bg-primary/5" : "text-secondary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-4 mt-2">
          <Link
            href="/list-property"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-center w-full py-3 text-sm font-semibold text-white no-underline rounded-lg ${styles.ctaButton}`}
          >
            List Your Property
          </Link>
        </div>
      </div>
    </>
  );
}
