"use client";

import React from "react";
import Image from "next/image";
import { FiShield, FiDollarSign, FiHeadphones, FiCheckCircle } from "react-icons/fi";
import LoginForm from "@/components/authForms/LoginForm";
import SignupForm from "@/components/authForms/SignupForm";

interface AuthMainViewProps {
  type: "login" | "signup";
}

const AuthMainView: React.FC<AuthMainViewProps> = ({ type }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] px-5 pt-[120px] pb-8">
      
      {/* 50-50 Split Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] max-w-[1000px] w-full mx-auto items-stretch my-auto">
        
        {/* Left Hero Image Panel */}
        <div className="relative hidden md:flex flex-col justify-end min-h-[520px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-sm">
          <div className="absolute inset-0 z-10">
            <Image
              src="/auth-image.png"
              alt="RealNest Banner"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay matching the mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00062a]/25 to-[#00062a]/85" />
          </div>

          <div className="relative p-10 lg:p-12 z-20 text-white text-left">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 lg:mb-5 tracking-tight">
              Find. Book.<br />
              <span className="text-primary">Move In.</span>
            </h1>
            <p className="text-sm lg:text-base leading-relaxed text-white/80 mb-5 lg:mb-6">
              Verified properties.<br />
              Seamless booking.<br />
              Hassle-free living.
            </p>
            <div className="w-12 h-1 bg-primary rounded" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-stretch justify-center w-full">
          {type === "login" ? <LoginForm /> : <SignupForm />}
        </div>

      </div>

      {/* Trust Badges Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-8 max-w-[1200px] w-full mx-auto pt-8 border-t border-gray-100 mt-12">
        
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl md:bg-transparent md:border-none md:rounded-none md:p-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 shrink-0 text-primary text-xl">
            <FiShield />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-bold text-secondary leading-tight">100% Verified</h4>
            <p className="text-[10px] sm:text-xs text-gray-500">Properties</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl md:bg-transparent md:border-none md:rounded-none md:p-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 shrink-0 text-primary text-xl">
            <FiDollarSign />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-bold text-secondary leading-tight">Best Price</h4>
            <p className="text-[10px] sm:text-xs text-gray-500">Guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl md:bg-transparent md:border-none md:rounded-none md:p-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 shrink-0 text-primary text-xl">
            <FiHeadphones />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-bold text-secondary leading-tight">Dedicated Support</h4>
            <p className="text-[10px] sm:text-xs text-gray-500">7 Days a Week</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl md:bg-transparent md:border-none md:rounded-none md:p-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 shrink-0 text-primary text-xl">
            <FiCheckCircle />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-bold text-secondary leading-tight">Secure & Safe</h4>
            <p className="text-[10px] sm:text-xs text-gray-500">Transactions</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthMainView;
