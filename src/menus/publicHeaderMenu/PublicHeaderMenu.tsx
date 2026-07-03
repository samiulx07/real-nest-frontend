"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./publicHeaderMenu.module.css";
import { FiMenu, FiX } from "react-icons/fi";

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

          {/* Desktop CTA + Mobile Burger */}
          <div className="flex items-center gap-3">
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
