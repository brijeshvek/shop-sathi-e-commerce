import Link from "next/link";
import { FileText, ShieldAlert, Scale, ShoppingBag, UserCheck, AlertTriangle, HelpCircle, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Shop Shathi",
  description: "Read the Terms and Conditions of using the Shop Shathi e-commerce platform, marketplace, and related services.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "September 24, 2026";

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back link & Header banner */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-gradient-to-r from-indigo-700 via-primary-700 to-blue-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Terms of Service
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-xl">
              Please read these terms carefully before accessing or using Shop Shathi. By using our website and services, you agree to be bound by these terms.
            </p>
            <p className="text-xs text-indigo-200/80 mt-4">
              Effective Date: <span className="font-semibold text-white">{lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <UserCheck className="w-5 h-5 text-indigo-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Account Responsibility</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Users are responsible for maintaining the confidentiality of their login credentials and account access.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <ShoppingBag className="w-5 h-5 text-emerald-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Fair Marketplace</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All product listings, specifications, and prices are verified for transparency and compliance.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Scale className="w-5 h-5 text-purple-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Governing Law</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              These terms are governed by and construed in accordance with the laws of India.
            </p>
          </div>
        </div>

        {/* Terms Content Sections */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Scale className="w-5 h-5 text-primary-500" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p>
              By accessing, browsing, registering on, or purchasing items through Shop Shathi (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service, along with our Privacy Policy and Refund Policy.
            </p>
            <p>
              If you do not agree with any part of these terms, you must immediately discontinue using our services and website.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <UserCheck className="w-5 h-5 text-primary-500" />
              <h2>2. User Accounts & Security</h2>
            </div>
            <p>To access certain features of the platform, you may be required to create an account:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>You agree to provide accurate, current, and complete information during registration and checkout.</li>
              <li>You are solely responsible for safeguarding your account password or mobile OTP verification codes.</li>
              <li>Shop Shathi reserves the right to suspend or terminate accounts that violate our community policies, engage in fraudulent transactions, or abuse promotional discounts.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
              <h2>3. Product Listings, Pricing & Orders</h2>
            </div>
            <p>
              We strive to display accurate pricing, descriptions, specifications, and stock availability for all products.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li><strong className="text-gray-900 dark:text-white">Pricing Errors:</strong> In the rare event an item is listed at an incorrect price due to typographical error, Shop Shathi reserves the right to cancel the order and provide a full refund.</li>
              <li><strong className="text-gray-900 dark:text-white">Order Acceptance:</strong> Receipt of an electronic order confirmation does not signify our final acceptance of your order. We reserve the right to limit order quantities or cancel orders suspected of reseller fraud.</li>
              <li><strong className="text-gray-900 dark:text-white">Applicable Taxes:</strong> Applicable GST and shipping charges will be clearly displayed during checkout prior to final payment.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <ShieldAlert className="w-5 h-5 text-primary-500" />
              <h2>4. Prohibited Activities</h2>
            </div>
            <p>You agree not to use the platform for any of the following unauthorized purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>Engaging in fraudulent purchases, chargeback abuse, or fake order bookings.</li>
              <li>Attempting to bypass security systems, inject malware, scrape data, or perform unauthorized reverse engineering.</li>
              <li>Impersonating another person or creating fake seller/customer identities.</li>
              <li>Posting unlawful, defamatory, or abusive content in product reviews or customer feedback.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <AlertTriangle className="w-5 h-5 text-primary-500" />
              <h2>5. Limitation of Liability</h2>
            </div>
            <p>
              Shop Shathi and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the platform, including delivery delays caused by natural disasters, strikes, or third-party courier bottlenecks.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <FileText className="w-5 h-5 text-primary-500" />
              <h2>6. Changes to Terms</h2>
            </div>
            <p>
              We reserve the right to modify or replace these Terms of Service at any time. Material changes will be posted on this page with an updated Effective Date. Your continued use of the website following any changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact Support Card */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Need clarification on our Terms?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Contact our legal and customer support team for any queries regarding these conditions.
              </p>
            </div>
            <a
              href="mailto:legal@shopsathi.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
              Contact Legal Team
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
