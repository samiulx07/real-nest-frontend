"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "@/components/logo/Logo";
import Button from "@/components/button/Button";
import { BUTTON_VARIANT_ENUM, BUTTON_SIZE_ENUM } from "@/shared/enums";
import { signupSchema, SignupInput } from "@/shared/validations/auth.validation";

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignupSubmit = (data: SignupInput) => {
    setLoading(true);
    console.log("Signup form data:", data);
    setTimeout(() => {
      setLoading(false);
      alert(`Signup simulated for: ${data.email}`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-9 w-full max-w-[580px] border border-[#f0f0f0] shadow-[0_10px_40px_rgba(0,6,42,0.03)]">
      {/* Header section */}
      <div className="flex flex-col items-center mb-5">
        <Logo width={160} height={42} className="mb-3" />
        <h2 className="text-2xl font-bold text-secondary text-center mb-1">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Join RealNest and start your smart real estate journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSignupSubmit)} className="flex flex-col gap-3.5">
        {/* Full Name Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Full Name</label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm text-secondary transition-all ${
                errors.fullName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
          </div>
          {errors.fullName && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.fullName.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm text-secondary transition-all ${
                errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</span>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Phone Number</label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone")}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none text-sm text-secondary transition-all ${
                errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
          </div>
          {errors.phone && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.phone.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none text-sm text-secondary transition-all ${
                errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bg-transparent border-none text-gray-400 text-base cursor-pointer hover:text-secondary outline-none top-1/2 -translate-y-1/2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none text-sm text-secondary transition-all ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 bg-transparent border-none text-gray-400 text-base cursor-pointer hover:text-secondary outline-none top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Agree Terms Checkbox */}
        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-secondary mt-1">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 accent-primary shrink-0 mt-0.5"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-primary font-semibold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="text-xs text-red-500 font-medium pl-1">{errors.agreeTerms.message}</span>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          isLoading={loading}
          variant={BUTTON_VARIANT_ENUM.PRIMARY_GRADIENT}
          size={BUTTON_SIZE_ENUM.DEFAULT}
          className="w-full py-3 text-sm font-semibold mt-2"
        >
          Create Account
        </Button>
      </form>

      {/* Switch to Login link */}
      <div className="text-center mt-5 text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
