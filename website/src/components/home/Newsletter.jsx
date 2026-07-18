"use client";

import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Newsletter() {
  const { t } = useTranslation();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-primary-600 dark:bg-primary-900 relative overflow-hidden" aria-label="Newsletter Subscription">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[140%] rounded-full bg-white/5 blur-3xl transform rotate-12"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[100%] rounded-full bg-white/5 blur-3xl transform -rotate-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 font-heading tracking-tight">
          {t('home.newsletter')}
        </h2>
        <p className="mb-8 text-primary-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {t('home.newsletter_desc')}
        </p>
        
        <form 
          className="flex flex-col sm:flex-row items-center justify-center max-w-lg mx-auto gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            // Form logic would go here
          }}
        >
          <div className="relative w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white text-gray-900 rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-shadow shadow-sm font-medium"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-full transition-colors whitespace-nowrap shadow-md"
          >
            {t('profile.language') === 'Gujarati' ? 'સબ્સ્ક્રાઇબ કરો' : t('profile.language') === 'Hindi' ? 'सदस्यता लें' : 'Subscribe Now'}
          </button>
        </form>
        <p className="mt-4 text-xs text-primary-200">
          We care about your data in our <a href="/privacy" className="underline hover:text-white transition-colors">privacy policy</a>.
        </p>
      </div>
    </section>
  );
}
