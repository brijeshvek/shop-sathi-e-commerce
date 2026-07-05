"use client";

import { Suspense } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    
    try {
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl text-center space-y-6">
          <h2 className="text-2xl font-bold font-heading text-error-600">Invalid Link</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="block w-full">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
            Create New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
