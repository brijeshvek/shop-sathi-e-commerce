"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Camera, User } from "lucide-react";
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
  const { t, i18n } = useTranslation();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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
      // Allow name, phone, and preserve avatar if it wasn't changed via this form directly
      const payload = { ...data };
      if (user?.avatar) payload.avatar = user.avatar;

      const response = await api.put(`/users/${user._id}`, payload);
      setUser(response.data.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("image", file);

      // 1. Upload to /api/upload/avatar
      const uploadRes = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { url, publicId } = uploadRes.data.data;

      // 2. Update user profile
      const updateRes = await api.put(`/users/${user._id}`, {
        name: user.name,
        phone: user.phone,
        avatar: { url, publicId }
      });
      
      setUser(updateRes.data.data);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onPasswordUpdate = async (data) => {
    try {
      await api.put(`/users/${user._id}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const onLanguageChange = async (e) => {
    const newLang = e.target.value;
    try {
      await api.patch(`/users/${user._id}/language`, { language: newLang });
      setUser({ ...user, language: newLang });
      i18n.changeLanguage(newLang);
      toast.success("Language updated successfully!");
    } catch (error) {
      toast.error("Failed to update language preference");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
          {t('profile.title') || "Profile Information"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('profile.desc') || "Update your account's profile information and email address."}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
            
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
            aria-label="Upload profile picture"
            disabled={isUploadingAvatar}
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/jpeg,image/png,image/webp" 
            className="hidden" 
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t('profile.pic') || "Profile Picture"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('profile.pic_desc') || "JPG, PNG or WEBP. Max size 5MB."}
          </p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="max-w-md space-y-6">
        <div className="space-y-4">
          <Input
            label={t('profile.name') || "Full Name"}
            {...registerProfile("name")}
            error={profileErrors.name}
          />
          <Input
            label={t('profile.email') || "Email Address"}
            type="email"
            {...registerProfile("email")}
            error={profileErrors.email}
          />
        </div>
        <Button type="submit" isLoading={isProfileSubmitting}>
          {t('profile.save') || "Save Changes"}
        </Button>
      </form>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
          {t('profile.language_pref') || "Language Preference"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('profile.lang_pref_desc') || "Select your preferred language for the application."}
        </p>
        <div className="mt-4 max-w-xs">
          <select 
            value={user?.language || 'en'} 
            onChange={onLanguageChange}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
          {t('profile.password_title') || "Change Password"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('profile.password_desc') || "Ensure your account is using a long, random password to stay secure."}
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="max-w-md space-y-6">
        <div className="space-y-4">
          <Input
            label={t('profile.current_pass') || "Current Password"}
            type="password"
            {...registerPassword("currentPassword")}
            error={passwordErrors.currentPassword}
          />
          <Input
            label={t('profile.new_pass') || "New Password"}
            type="password"
            {...registerPassword("newPassword")}
            error={passwordErrors.newPassword}
          />
          <Input
            label={t('profile.confirm_pass') || "Confirm New Password"}
            type="password"
            {...registerPassword("confirmPassword")}
            error={passwordErrors.confirmPassword}
          />
        </div>
        <Button type="submit" variant="secondary" isLoading={isPasswordSubmitting}>
          {t('profile.update_pass') || "Update Password"}
        </Button>
      </form>
    </div>
  );
}
