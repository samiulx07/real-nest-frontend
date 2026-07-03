import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiLinkedin, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/properties" },
  { label: "Flats", href: "/flats" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const customerCare = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "FAQs", href: "/faqs" },
  { label: "Request", href: "/request" },
];

const company = [
  { label: "About RealNest", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "News & Updates", href: "/news" },
];

const socialLinks = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function PublicFooterMenu() {
  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-5 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 no-underline mb-4">
              <Image
                src="/logo-icon-white-bg.png"
                alt="RealNest Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Real<span className="text-primary">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              We build more than buildings,<br />
              we build trust, comfort, and<br />
              better tomorrows.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-gray-300 text-base no-underline transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[15px] font-semibold text-white mb-5">Quick Links</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[15px] font-semibold text-white mb-5">Customer Care</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {customerCare.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[15px] font-semibold text-white mb-5">Company</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-[15px] font-semibold text-white mb-5">Contact Us</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary text-base mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  House 12, Road 45, Gulshan 1,<br />
                  Dhaka 1212, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary text-base shrink-0" />
                <a href="tel:+8801712345678" className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-primary">
                  +880 1712 345 678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary text-base shrink-0" />
                <a href="mailto:info@realnest.com.bd" className="text-sm text-gray-400 no-underline transition-colors duration-200 hover:text-primary">
                  info@realnest.com.bd
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 m-0">
            © {new Date().getFullYear()} RealNest. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Link href="/privacy-policy" className="text-gray-500 no-underline transition-colors duration-200 hover:text-primary">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="text-gray-500 no-underline transition-colors duration-200 hover:text-primary">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
