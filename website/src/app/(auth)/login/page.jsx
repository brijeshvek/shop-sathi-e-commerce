"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login, verifyOtp } = useAuth();
  const router = useRouter();

  const [otpRequired, setOtpRequired] = useState(false);
  const [email, setEmail] = useState("");
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
      await api.post('/auth/resend-otp', { email });
      toast.success("Verification OTP code resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
      setCanResend(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password);
      if (res.data?.otpRequired) {
        setEmail(data.email);
        setOtpRequired(true);
        setTimer(15);
        setCanResend(false);
        toast.success("Verification code sent to your email!");
      } else {
        toast.success("Welcome back!");
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || "/";
        router.push(redirectPath);
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
      await verifyOtp(email, otp);
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
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
                Enter Verification Code
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We have sent a 6-digit OTP to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
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
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{" "}
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  create a new account
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password}
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
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
