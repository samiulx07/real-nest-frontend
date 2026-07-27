"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Logo from "@/components/logo/Logo";
import Button from "@/components/button/Button";
import api from "@/services/baseServices";
import { toast } from "react-toastify";

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setApiError("Please enter your email address");
      return;
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data?.success) {
        toast.success("OTP code & link sent to your email!");
        setApiSuccess(response.data.message || "OTP code sent to email.");
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1200);
      } else {
        setApiError(response.data?.message || "Failed to send reset email");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-9 w-full max-w-[580px] border border-[#f0f0f0] shadow-[0_10px_40px_rgba(0,6,42,0.03)] flex flex-col gap-5 my-auto">
      {apiError && (
        <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium text-left">
          {apiError}
        </div>
      )}
      {apiSuccess && (
        <div className="p-3.5 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl font-medium text-left">
          {apiSuccess}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col items-center mb-3">
        <Logo width={160} height={42} className="mb-3" />
        <h2 className="text-2xl font-bold text-secondary text-center mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Enter your registered email address to receive a 6-digit OTP code & reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-semibold text-secondary">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl text-sm font-bold bg-[#FF4C00] text-white hover:bg-[#e04300] transition-all cursor-pointer"
        >
          {loading ? "Sending OTP..." : "Send OTP Reset Code"}
        </Button>
      </form>

      {/* Back to login */}
      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-all"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
