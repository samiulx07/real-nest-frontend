import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RootProvider from "@/contexts/RootProvider";
import AuthInit from "@/components/authInit/AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Nest - Real Estate Management System",
  description: "Real Nest Real Estate Management System and Property Listings",
  icons: {
    icon: "/logo-icon-white-bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <RootProvider>
          <AuthInit />
          <ToastContainer
            position="top-right"
            autoClose={2200}
            hideProgressBar={true}
            closeButton={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!rounded-xl !shadow-md !border !border-slate-100 !text-[11px] !font-bold !text-slate-800 !py-2 !px-3.5 !min-h-[40px] !w-fit max-w-xs"
          />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

