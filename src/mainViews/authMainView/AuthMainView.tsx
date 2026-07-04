"use client";

import React from "react";
import Image from "next/image";
import LoginForm from "@/components/authForms/LoginForm";
import SignupForm from "@/components/authForms/SignupForm";

interface AuthMainViewProps {
  type: "login" | "signup";
}

const AuthMainView: React.FC<AuthMainViewProps> = ({ type }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] px-5 pt-[120px] pb-24">
      
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
              Best Place for<br />
              Your <span className="text-primary">Dream Property.</span>
            </h1>
            <p className="text-sm lg:text-base leading-relaxed text-white/80 mb-5 lg:mb-6">
              Find your perfect home, track your booking progress, and manage your properties all in one secure portal.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-stretch justify-center w-full">
          {type === "login" ? <LoginForm /> : <SignupForm />}
        </div>

      </div>
    </div>
  );
};

export default AuthMainView;
