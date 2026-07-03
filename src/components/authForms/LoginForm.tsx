"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "@/components/logo/Logo";
import Button from "@/components/button/Button";
import { BUTTON_VARIANT_ENUM, BUTTON_SIZE_ENUM } from "@/shared/enums";
import { loginSchema, LoginInput } from "@/shared/validations/auth.validation";
import { useRootContext } from "@/contexts/RootContext";
import api from "@/services/baseServices";
import { setUser } from "@/services/tokenService";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const { setUser: setUserContext, setAccessToken } = useRootContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onLoginSubmit = async (data: LoginInput) => {
    setLoading(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const resData = response.data;

      if (resData?.success && resData?.data) {
        const { user: loggedInUser, accessToken: token } = resData.data;

        // Persist token in localStorage
        setUser({
          user: loggedInUser,
          accessToken: token,
        });

        // Set context values
        setUserContext(loggedInUser);
        setAccessToken(token);

        setApiSuccess("Logged in successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setApiError(resData?.message || "Login failed");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-9 w-full max-w-[580px] border border-[#f0f0f0] shadow-[0_10px_40px_rgba(0,6,42,0.03)] flex flex-col gap-5">
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
      <div className="flex flex-col items-center mb-5">
        <Logo width={160} height={42} className="mb-3" />
        <h2 className="text-2xl font-bold text-secondary text-center mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Login to continue to your RealNest account
        </p>
      </div>

      <form onSubmit={handleSubmit(onLoginSubmit)} className="flex flex-col gap-3.5">
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

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-secondary">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs sm:text-sm my-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-secondary">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 accent-primary"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-primary font-medium hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          isLoading={loading}
          variant={BUTTON_VARIANT_ENUM.PRIMARY_GRADIENT}
          size={BUTTON_SIZE_ENUM.DEFAULT}
          className="w-full py-3 text-sm font-semibold mt-1"
        >
          Login
        </Button>
      </form>

      {/* Switch to Signup link */}
      <div className="text-center mt-5 text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
