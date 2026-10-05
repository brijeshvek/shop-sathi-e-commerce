"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
} from "@/lib/firebase";

export function SocialAuthButtons({ mode = "login" }) {
  const { socialLogin } = useAuth();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState(null);

  // Handle direct click on Google / Facebook / Twitter
  const handleSocialButtonClick = async (provider) => {
    setLoadingProvider(provider);
    try {
      let authResult = null;
      if (provider === "google") {
        authResult = await signInWithGoogle();
      } else if (provider === "facebook") {
        authResult = await signInWithFacebook();
      } else if (provider === "twitter") {
        authResult = await signInWithTwitter();
      }

      if (authResult) {
        await socialLogin(authResult);
        const providerTitle = provider === "twitter" ? "Twitter (X)" : provider.charAt(0).toUpperCase() + provider.slice(1);
        toast.success(`Welcome ${authResult.name}! Signed in with ${providerTitle}`);

        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect") || "/";
        router.push(redirectPath);
      }
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        // User voluntarily closed the Google popup window
        return;
      }
      
      console.error("Firebase Login Error:", err);
      if (err?.code === "auth/configuration-not-found" || err?.code === "auth/operation-not-allowed") {
        toast.error("Please enable Google Sign-in provider in Firebase Console -> Authentication -> Sign-in method.");
      } else if (err?.code === "auth/unauthorized-domain") {
        toast.error("Domain unauthorized. Please add localhost to Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else {
        toast.error(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoadingProvider(null);
    }
  };

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
          onClick={() => handleSocialButtonClick("google")}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 disabled:opacity-60 cursor-pointer"
          title="Continue with Google"
        >
          {loadingProvider === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-1.5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="truncate">Google</span>
            </>
          )}
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleSocialButtonClick("facebook")}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-[#1877F2] active:scale-95 disabled:opacity-60 cursor-pointer"
          title="Continue with Facebook"
        >
          {loadingProvider === "facebook" ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#1877F2]" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-1.5 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="truncate">Facebook</span>
            </>
          )}
        </button>

        {/* Twitter / X Button */}
        <button
          type="button"
          onClick={() => handleSocialButtonClick("twitter")}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white active:scale-95 disabled:opacity-60 cursor-pointer"
          title="Continue with Twitter / X"
        >
          {loadingProvider === "twitter" ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-900 dark:text-white" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-1.5 flex-shrink-0 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="truncate">Twitter</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
