"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export default function LoginPage() {
  const { login, loginWithPhone, verifyPhoneOtp } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("phone"); // 'phone' or 'email'
  const [otpRequired, setOtpRequired] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (otpRequired && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpRequired, timer]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(15);
    try {
      await api.post('/auth/login-phone', { phone });
      toast.success("Verification OTP code resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
      setCanResend(true);
    }
  };

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm({
    resolver: zodResolver(emailLoginSchema),
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isSubmitting: isPhoneSubmitting },
  } = useForm({
    resolver: zodResolver(phoneLoginSchema),
  });

  const onEmailLogin = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || "/";
      router.push(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onPhoneLogin = async (data) => {
    try {
      const res = await loginWithPhone(data.phone);
      if (res?.data?.otpRequired) {
        setPhone(data.phone);
        setOtpRequired(true);
        setTimer(15);
        setCanResend(false);
        toast.success("Verification code sent to your phone!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyPhoneOtp(phone, otp);
      toast.success("Welcome back!");
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || "/";
      router.push(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-xl">
        {otpRequired ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 font-heading">
                Enter Verification Code
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We have sent a 6-digit OTP to <span className="font-semibold text-gray-900">{phone}</span>.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-4">

                <Input
                  label="OTP Code"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isVerifying}>
                Verify & Sign In
              </Button>

              <div className="flex flex-col items-center justify-center space-y-3 mt-4 text-sm text-center">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-semibold text-primary-600 hover:text-primary-500 underline focus:outline-none"
                    >
                      Resend OTP Code
                    </button>
                  ) : (
                    <span className="text-gray-400 font-medium">
                      Resend code in {timer}s
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setOtpRequired(false)}
                  className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 font-heading">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  create a new account
                </Link>
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "phone"
                  ? "bg-white dark:bg-gray-200 shadow text-gray-900 dark:text-white dark:hover:text-blue-300"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-black"
                  }`}
                onClick={() => setActiveTab("phone")}
              >
                Phone Number
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "email"
                  ? "bg-white dark:bg-gray-200 shadow text-gray-900 dark:text-white dark:hover:text-blue-300"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-black"
                  }`}
                onClick={() => setActiveTab("email")}
              >
                Email & Password
              </button>
            </div>

            {/* Phone Login Form */}
            {activeTab === "phone" && (
              <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit(onPhoneLogin)}>
                <div className="space-y-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="1234567890"
                    {...registerPhone("phone")}
                    error={phoneErrors.phone}
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isPhoneSubmitting}>
                  Send OTP
                </Button>
              </form>
            )}

            {/* Email Login Form */}
            {activeTab === "email" && (
              <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit(onEmailLogin)}>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    {...registerEmail("email")}
                    error={emailErrors.email}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...registerEmail("password")}
                    error={emailErrors.password}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isEmailSubmitting}>
                  Sign In
                </Button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
