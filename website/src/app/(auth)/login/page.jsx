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
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { ShoppingBag, ShieldCheck, Truck, Sparkles, ArrowRight, Smartphone, Mail, Lock } from "lucide-react";

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
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
      toast.success("Verification OTP resent successfully!");
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
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-950">
      {/* Amazon & Flipkart Style 2-Column Auth Card */}
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        
        {/* Left Side: Flipkart & Amazon Branding Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-heading font-extrabold text-2xl tracking-tight">
              <img src="/logo.png" alt="Shop Shathi" className="w-8 h-8 object-contain bg-white/20 rounded-lg p-1 backdrop-blur-sm" />
              <span>Shop Shathi</span>
            </Link>

            <div className="mt-8 space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight">
                {otpRequired ? "Verify OTP" : "Login to Your Account"}
              </h2>
              <p className="text-primary-100 text-sm leading-relaxed">
                Get access to your Orders, Wishlist, Personalized Recommendations, and Instant Tracking.
              </p>
            </div>
          </div>

          {/* Flipkart / Amazon Trust Badges */}
          <div className="relative z-10 mt-8 space-y-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>100% Safe & Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <Truck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Fast Doorstep Delivery Across India</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <span>Exclusive Member Deals & Discounts</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms & Social Login */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {otpRequired ? (
              /* OTP Verification Step */
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                    Enter Verification OTP
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Please enter the 6-digit OTP sent to <span className="font-semibold text-gray-900 dark:text-white">+91 {phone}</span>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                      One Time Password (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full tracking-[0.5em] text-center font-mono text-2xl font-bold py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-primary-500/25" isLoading={isVerifying}>
                    Verify & Continue
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-gray-400">
                        Resend OTP in <span className="font-semibold">{timer}s</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setOtpRequired(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:underline"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Main Sign-In Screen */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                      Sign In
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Enter your details to access your account
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    New user? Register
                  </Link>
                </div>

                {/* Switcher Tab (Mobile OTP vs Email Password) */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 border border-gray-200/60 dark:border-gray-700">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "phone"
                        ? "bg-white dark:bg-gray-900 shadow-sm text-primary-600 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    }`}
                    onClick={() => setActiveTab("phone")}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile OTP (Fast)
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "email"
                        ? "bg-white dark:bg-gray-900 shadow-sm text-primary-600 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    }`}
                    onClick={() => setActiveTab("email")}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email & Password
                  </button>
                </div>

                {/* Mobile Phone OTP Form (Flipkart Style) */}
                {activeTab === "phone" && (
                  <form className="space-y-4" onSubmit={handlePhoneSubmit(onPhoneLogin)}>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Mobile Number
                      </label>
                      <div className="relative flex rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 text-xs font-bold text-gray-500 border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-750">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          {...registerPhone("phone")}
                          className="w-full px-3.5 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      {phoneErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">{phoneErrors.phone.message}</p>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                      By continuing, you agree to Shop Shathi&apos;s{" "}
                      <Link href="/terms" className="text-primary-600 hover:underline">Terms of Use</Link> and{" "}
                      <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                    </p>

                    <Button type="submit" className="w-full py-2.5 text-sm font-semibold shadow-md shadow-primary-500/20" isLoading={isPhoneSubmitting}>
                      Request OTP
                    </Button>
                  </form>
                )}

                {/* Email Password Form */}
                {activeTab === "email" && (
                  <form className="space-y-3.5" onSubmit={handleEmailSubmit(onEmailLogin)}>
                    <div>
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        {...registerEmail("email")}
                        error={emailErrors.email}
                      />
                    </div>
                    <div>
                      <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...registerEmail("password")}
                        error={emailErrors.password}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300">
                        <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                        <span>Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="font-semibold text-primary-600 hover:underline">
                        Forgot Password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full py-2.5 text-sm font-semibold shadow-md shadow-primary-500/20" isLoading={isEmailSubmitting}>
                      Sign In
                    </Button>
                  </form>
                )}

                {/* Social Login (Google, Facebook, Twitter) */}
                <div className="mt-4">
                  <SocialAuthButtons mode="login" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
            <span>Don&apos;t have an account? </span>
            <Link href="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

