import Link from "next/link";
import { Shield, Lock, Eye, Database, Cookie, Bell, UserCheck, HelpCircle, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Shop Shathi",
  description: "Learn how Shop Shathi collects, uses, protects, and handles your personal information and data privacy.",
};

export default function PrivacyPolicyPage() {
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

          <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-primary-200">Legal & Security</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-primary-100 text-sm mt-2 max-w-xl">
              Your privacy is extremely important to us. This policy details how Shop Shathi collects, utilizes, and safeguards your personal information.
            </p>
            <p className="text-xs text-primary-200/80 mt-4">
              Last Updated: <span className="font-semibold text-white">{lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Lock className="w-5 h-5 text-emerald-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Bank-Grade Encryption</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All payment credentials and sensitive data are encrypted with 256-bit SSL protocols.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Eye className="w-5 h-5 text-blue-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Zero Data Selling</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              We never sell or rent your personal contact information to third-party telemarketers.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <UserCheck className="w-5 h-5 text-indigo-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Full User Control</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              You can access, modify, export, or request deletion of your account data anytime.
            </p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Database className="w-5 h-5 text-primary-500" />
              <h2>1. Information We Collect</h2>
            </div>
            <p>
              When you use Shop Shathi (accessible via website and mobile applications), we collect several types of information to fulfill orders and improve your shopping experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li><strong className="text-gray-900 dark:text-white">Personal Identity:</strong> Name, email address, contact phone number, and delivery shipping addresses.</li>
              <li><strong className="text-gray-900 dark:text-white">Account Credentials:</strong> Secure hashed passwords or social OAuth identifiers (Google, Facebook, Twitter, Phone OTP).</li>
              <li><strong className="text-gray-900 dark:text-white">Order & Payment Data:</strong> Transaction ID, order history, billing address, and payment method identifiers (card numbers are processed directly through certified PCI-DSS payment gateways like Razorpay).</li>
              <li><strong className="text-gray-900 dark:text-white">Device & Usage Information:</strong> IP address, browser type, operating system, pages visited, and interaction logs.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Eye className="w-5 h-5 text-primary-500" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p>We use the collected information for specific, lawful purposes including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>Processing, fulfilling, and dispatching your product purchases and sending automated shipment tracking updates.</li>
              <li>Authenticating user sessions and providing personalized recommendations based on your preferences.</li>
              <li>Detecting, preventing, and mitigating fraudulent transactions and unauthorized account access.</li>
              <li>Customer support assistance for order returns, exchanges, refunds, and technical inquiries.</li>
              <li>Sending transactional SMS, emails, and important platform updates.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Cookie className="w-5 h-5 text-primary-500" />
              <h2>3. Cookies & Tracking Technologies</h2>
            </div>
            <p>
              We use necessary session cookies and analytics tools to keep you logged in across pages, remember items in your shopping bag, and evaluate site performance. You can manage or disable cookie preferences through your browser settings, though some interactive features may require cookies to function properly.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Lock className="w-5 h-5 text-primary-500" />
              <h2>4. Information Sharing & Third Parties</h2>
            </div>
            <p>
              Shop Shathi will never sell your personal data. We only share necessary portions of your information with trusted service partners under strict confidentiality:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li><strong className="text-gray-900 dark:text-white">Logistics & Courier Partners:</strong> Name, delivery address, and phone number for parcel dispatch and delivery verification.</li>
              <li><strong className="text-gray-900 dark:text-white">Payment Gateways:</strong> Verified payment intermediaries to process credit/debit cards, UPI, and Net Banking securely.</li>
              <li><strong className="text-gray-900 dark:text-white">Legal Obligations:</strong> When required by applicable Indian laws, judicial proceedings, or court subpoenas.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Bell className="w-5 h-5 text-primary-500" />
              <h2>5. Your Privacy Rights</h2>
            </div>
            <p>You maintain full control over your personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>Review and update profile details and delivery addresses in your Account Settings.</li>
              <li>Opt-out of marketing communications by clicking unsubscribe or updating notification preferences.</li>
              <li>Request full account deletion and removal of your personal records by contacting our support team.</li>
            </ul>
          </section>

          {/* Contact Support Card */}
          <div className="bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Questions about our Privacy Policy?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Our Data Protection Officer is available to assist you with any privacy questions or requests.
              </p>
            </div>
            <a
              href="mailto:privacy@shopsathi.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
              Contact Privacy Team
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
