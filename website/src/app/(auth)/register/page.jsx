"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { ShieldCheck, Truck, Sparkles, UserCheck, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-950">
      {/* Amazon & Flipkart Style 2-Column Auth Card */}
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row min-h-[620px]">
        
        {/* Left Side: Flipkart & Amazon Branding Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-heading font-extrabold text-2xl tracking-tight">
              <img src="/logo.png" alt="Shop Shathi" className="w-8 h-8 object-contain bg-white/20 rounded-lg p-1 backdrop-blur-sm" />
              <span>Shop Shathi</span>
            </Link>

            <div className="mt-8 space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight">
                Looks like you&apos;re new here!
              </h2>
              <p className="text-primary-100 text-sm leading-relaxed">
                Sign up with your mobile number or social account to get started and unlock special welcome offers.
              </p>
            </div>
          </div>

          {/* Flipkart / Amazon Perks */}
          <div className="relative z-10 mt-8 space-y-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <UserCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Fast 1-Click Social Registration</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>Verified Account & Data Privacy</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-100 font-medium">
              <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <span>₹100 Off on Your First Order</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form & Social Signup */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                  Create Account
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Sign up with email, phone, or your social accounts
                </p>
              </div>
              <Link
                href="/login"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Existing user? Sign In
              </Link>
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Rahul Sharma"
                  {...register("name")}
                  error={errors.name}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  {...register("phone")}
                  error={errors.phone}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                error={errors.email}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min 8 chars"
                  {...register("password")}
                  error={errors.password}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword}
                />
              </div>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight pt-1">
                By clicking Create Account, you agree to Shop Shathi&apos;s{" "}
                <Link href="/terms" className="text-primary-600 hover:underline">Terms of Use</Link> and{" "}
                <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              </p>

              <Button type="submit" className="w-full py-2.5 text-sm font-semibold shadow-md shadow-primary-500/20" isLoading={isSubmitting}>
                Create Account & Continue
              </Button>
            </form>

            {/* Social Logins: Google, Facebook, Twitter */}
            <div className="mt-4">
              <SocialAuthButtons mode="register" />
            </div>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
            <span>Already have an account? </span>
            <Link href="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Log in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

