"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-success-100 text-success-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Check your email</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We have sent a password reset link to your email address.
          </p>
          <Link href="/login" className="block w-full">
            <Button className="w-full">Back to Sign In</Button>
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send Reset Link
          </Button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 text-sm">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
