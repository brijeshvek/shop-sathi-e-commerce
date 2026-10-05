import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Check if Firebase is configured with real keys
export const isFirebaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

// Safe Firebase App and Auth getter
export const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

/**
 * Sign in using real Google OAuth Popup
 */
export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const idToken = await user.getIdToken();
  return {
    provider: "google",
    name: user.displayName || user.email?.split("@")[0] || "Google User",
    email: user.email || "",
    avatar: user.photoURL || "",
    phone: user.phoneNumber || "",
    providerId: user.uid,
    idToken,
  };
}

/**
 * Sign in using real Facebook OAuth Popup
 */
export async function signInWithFacebook() {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, facebookProvider);
  const user = result.user;
  const idToken = await user.getIdToken();
  return {
    provider: "facebook",
    name: user.displayName || "Facebook User",
    email: user.email || "",
    avatar: user.photoURL || "",
    phone: user.phoneNumber || "",
    providerId: user.uid,
    idToken,
  };
}

/**
 * Sign in using real Twitter (X) OAuth Popup
 */
export async function signInWithTwitter() {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, twitterProvider);
  const user = result.user;
  const idToken = await user.getIdToken();
  return {
    provider: "twitter",
    name: user.displayName || "Twitter User",
    email: user.email || "",
    avatar: user.photoURL || "",
    phone: user.phoneNumber || "",
    providerId: user.uid,
    idToken,
  };
}

/**
 * Initialize invisible ReCAPTCHA for Firebase Phone Auth
 */
export function setupFirebaseRecaptcha(elementOrId) {
  if (typeof window === "undefined") return null;
  const auth = getFirebaseAuth();
  
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementOrId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      // Response expired
    },
  });

  return window.recaptchaVerifier;
}

/**
 * Send Phone OTP via Firebase
 */
export async function sendFirebasePhoneOtp(phoneNumber, appVerifier) {
  const auth = getFirebaseAuth();
  const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/\D/g, "").slice(-10)}`;
  return await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
}
