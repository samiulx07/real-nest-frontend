"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiKey, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import Logo from "@/components/logo/Logo";
import Button from "@/components/button/Button";
import api from "@/services/baseServices";
import { toast } from "react-toastify";

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!email) {
      setApiError("Please enter your email address");
      return;
    }
    if (!otpCode || otpCode.length !== 6) {
      setApiError("Please enter the valid 6-digit OTP code");
      return;
    }
    if (newPassword.length < 6) {
      setApiError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otpCode,
        newPassword,
      });

      if (response.data?.success) {
        toast.success("Password reset successfully!");
        setApiSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setApiError(response.data?.message || "Password reset failed");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to reset password. Check your OTP and try again.");
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
      <div className="flex flex-col items-center mb-2">
        <Logo width={160} height={42} className="mb-3" />
        <h2 className="text-2xl font-bold text-secondary text-center mb-1">
          Set New Password
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Enter the 6-digit OTP code sent to your email along with your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
        {/* Email Field */}
        <div className="flex flex-col gap-1">
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

        {/* 6-Digit OTP Code Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">6-Digit OTP Code</label>
          <div className="relative">
            <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4C00] text-base" />
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.trim())}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold text-[#FF4C00] tracking-widest focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">New Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password (min. 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bg-transparent border-none text-gray-400 text-base cursor-pointer hover:text-secondary outline-none top-1/2 -translate-y-1/2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Confirm New Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl text-sm font-bold bg-[#FF4C00] text-white hover:bg-[#e04300] transition-all cursor-pointer border-none"
        >
          {loading ? "Updating Password..." : "Update & Reset Password"}
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

export default ResetPasswordForm;
