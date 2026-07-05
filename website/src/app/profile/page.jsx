"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileUpdate = async (data) => {
    try {
      const response = await api.put(`/users/${user._id}`, data);
      setUser(response.data.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordUpdate = async (data) => {
    try {
      await api.put("/auth/update-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Profile Information</h1>
        <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
      </div>

      <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="max-w-md space-y-6">
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...registerProfile("name")}
            error={profileErrors.name}
          />
          <Input
            label="Email Address"
            type="email"
            {...registerProfile("email")}
            error={profileErrors.email}
          />
        </div>
        <Button type="submit" isLoading={isProfileSubmitting}>
          Save Changes
        </Button>
      </form>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="max-w-md space-y-6">
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...registerPassword("currentPassword")}
            error={passwordErrors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            {...registerPassword("newPassword")}
            error={passwordErrors.newPassword}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword("confirmPassword")}
            error={passwordErrors.confirmPassword}
          />
        </div>
        <Button type="submit" variant="secondary" isLoading={isPasswordSubmitting}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
