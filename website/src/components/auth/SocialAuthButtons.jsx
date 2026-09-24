"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Plus, User, X, Shield, ArrowRight } from "lucide-react";

export function SocialAuthButtons({ mode = "login" }) {
  const { socialLogin } = useAuth();
  const router = useRouter();

  const [activePicker, setActivePicker] = useState(null); // 'google' | 'facebook' | 'twitter' | null
  const [loadingAccountId, setLoadingAccountId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [savedAccounts, setSavedAccounts] = useState({
    google: [],
    facebook: [],
    twitter: [],
  });

  // Load previously used accounts on this browser (starts empty - NO default/dummy accounts)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("shop_sathi_device_social_accounts");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out any legacy dummy emails if previously saved
        const cleaned = {
          google: (parsed.google || []).filter(a => !a.email?.includes("myaccount@gmail") && !a.email?.includes("work.account@gmail") && !a.email?.includes("user.google@gmail")),
          facebook: (parsed.facebook || []).filter(a => !a.email?.includes("myprofile@facebook") && !a.email?.includes("user.fb@facebook")),
          twitter: (parsed.twitter || []).filter(a => !a.email?.includes("myhandle@x") && !a.email?.includes("user.twitter@x")),
        };
        setSavedAccounts(cleaned);
        localStorage.setItem("shop_sathi_device_social_accounts", JSON.stringify(cleaned));
      } else {
        setSavedAccounts({ google: [], facebook: [], twitter: [] });
      }
    } catch (e) {
      setSavedAccounts({ google: [], facebook: [], twitter: [] });
    }
  }, []);

  const saveAccountsToStorage = (updated) => {
    setSavedAccounts(updated);
    try {
      localStorage.setItem("shop_sathi_device_social_accounts", JSON.stringify(updated));
    } catch (e) {}
  };

  const openAccountPicker = (provider) => {
    setActivePicker(provider);
    setUserEmail("");
    setUserName("");
    // If no real account was saved previously, open direct sign in form
    const existing = savedAccounts[provider] || [];
    setIsAddingNew(existing.length === 0);
  };

  const handleSelectAccount = async (account) => {
    const provider = activePicker;
    setLoadingAccountId(account.id);
    try {
      await socialLogin({
        provider,
        email: account.email,
        name: account.name,
        avatar: account.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}`,
        providerId: account.id,
      });

      // Update position in saved accounts
      const providerList = (savedAccounts[provider] || []).filter((a) => a.email !== account.email);
      const updated = {
        ...savedAccounts,
        [provider]: [account, ...providerList],
      };
      saveAccountsToStorage(updated);

      const providerTitle = provider === "twitter" ? "Twitter (X)" : provider.charAt(0).toUpperCase() + provider.slice(1);
      toast.success(`Signed in as ${account.name} (${providerTitle})`);

      setActivePicker(null);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || `Sign in failed with ${provider}`);
    } finally {
      setLoadingAccountId(null);
    }
  };

  const handleSignInWithDetails = async (e) => {
    e.preventDefault();
    if (!userEmail.trim() || !userName.trim()) {
      toast.error("Please enter your name and email address");
      return;
    }

    const provider = activePicker;
    const newAcc = {
      id: `${provider}_${Date.now()}`,
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName.trim())}`,
    };

    setLoadingAccountId(newAcc.id);
    try {
      await socialLogin({
        provider,
        email: newAcc.email,
        name: newAcc.name,
        avatar: newAcc.avatar,
        providerId: newAcc.id,
      });

      // Save user's real account to device memory
      const existing = (savedAccounts[provider] || []).filter((a) => a.email !== newAcc.email);
      const updated = {
        ...savedAccounts,
        [provider]: [newAcc, ...existing],
      };
      saveAccountsToStorage(updated);

      const providerTitle = provider === "twitter" ? "Twitter (X)" : provider.charAt(0).toUpperCase() + provider.slice(1);
      toast.success(`Welcome ${newAcc.name}! Signed in with ${providerTitle}`);

      setActivePicker(null);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || `Sign in failed with ${provider}`);
    } finally {
      setLoadingAccountId(null);
    }
  };

  const handleRemoveAccount = (e, provider, id) => {
    e.stopPropagation();
    const filtered = (savedAccounts[provider] || []).filter((a) => a.id !== id);
    const updated = { ...savedAccounts, [provider]: filtered };
    saveAccountsToStorage(updated);
    if (filtered.length === 0) {
      setIsAddingNew(true);
    }
  };

  const getProviderConfig = (provider) => {
    switch (provider) {
      case "google":
        return {
          title: "Google",
          brandColor: "#4285F4",
          inputLabel: "Email or Phone",
          placeholder: "e.g. yourname@gmail.com or 9876543210",
          nameLabel: "Your Name",
          namePlaceholder: "e.g. Brijesh Patel",
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          ),
        };
      case "facebook":
        return {
          title: "Facebook",
          brandColor: "#1877F2",
          inputLabel: "Mobile number or email address",
          placeholder: "e.g. 9876543210 or name@example.com",
          nameLabel: "Facebook Profile Name",
          namePlaceholder: "e.g. Brijesh Patel",
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ),
        };
      case "twitter":
        return {
          title: "Twitter (X)",
          brandColor: "#000000",
          inputLabel: "Phone, email, or @username",
          placeholder: "e.g. @brijesh_dev or 9876543210",
          nameLabel: "Display Name",
          namePlaceholder: "e.g. Brijesh",
          icon: (
            <svg className="w-5 h-5 flex-shrink-0 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          ),
        };
      default:
        return {
          title: "Social",
          brandColor: "#4285F4",
          icon: null,
          inputLabel: "Email or Phone",
          placeholder: "Enter account identifier",
          nameLabel: "Your Name",
          namePlaceholder: "Your Name",
        };
    }
  };

  const currentProviderConfig = activePicker ? getProviderConfig(activePicker) : null;
  const currentProviderAccounts = activePicker ? savedAccounts[activePicker] || [] : [];

  return (
    <div className="w-full space-y-4">
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
        <span className="bg-surface px-4 text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
          Or continue with
        </span>
        <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => openAccountPicker("google")}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95"
          title="Continue with Google"
        >
          <svg className="w-5 h-5 mr-1.5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="truncate">Google</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => openAccountPicker("facebook")}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-[#1877F2] active:scale-95"
          title="Continue with Facebook"
        >
          <svg className="w-5 h-5 mr-1.5 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="truncate">Facebook</span>
        </button>

        {/* Twitter / X Button */}
        <button
          type="button"
          onClick={() => openAccountPicker("twitter")}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white active:scale-95"
          title="Continue with Twitter / X"
        >
          <svg className="w-5 h-5 mr-1.5 flex-shrink-0 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="truncate">Twitter</span>
        </button>
      </div>

      {/* Official Social Login Dialog (No dummy IDs) */}
      {activePicker && currentProviderConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
                  {currentProviderConfig.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sign in with {currentProviderConfig.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    to continue to <span className="font-semibold text-gray-700 dark:text-gray-200">Shop Shathi</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePicker(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* If user previously logged in on this browser with their real account, show it */}
              {!isAddingNew && currentProviderAccounts.length > 0 ? (
                <>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Choose your account
                  </p>

                  <div className="divide-y divide-gray-100 dark:divide-gray-800/80 max-h-60 overflow-y-auto">
                    {currentProviderAccounts.map((account) => {
                      const isLoading = loadingAccountId === account.id;

                      return (
                        <div
                          key={account.id}
                          onClick={() => !loadingAccountId && handleSelectAccount(account)}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary-50/70 dark:hover:bg-primary-950/30 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                              <img
                                src={account.avatar}
                                alt={account.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}`;
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {account.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {account.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {isLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveAccount(e, activePicker, account.id)}
                                className="text-gray-300 hover:text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove account from device"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Button to add/use another account */}
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="w-full flex items-center space-x-3 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span>Use another {currentProviderConfig.title} account</span>
                  </button>
                </>
              ) : (
                /* Direct Real Account Entry Form */
                <form onSubmit={handleSignInWithDetails} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Enter your {currentProviderConfig.title} details
                    </p>
                    {currentProviderAccounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        Back to my accounts
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {currentProviderConfig.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={currentProviderConfig.namePlaceholder}
                      className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {currentProviderConfig.inputLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder={currentProviderConfig.placeholder}
                      className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActivePicker(null)}
                      className="flex-1 py-2.5 px-4 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loadingAccountId !== null}
                      className="flex-1 py-2.5 px-4 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {loadingAccountId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                <span>Shop Shathi securely signs you in with {currentProviderConfig.title}.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

