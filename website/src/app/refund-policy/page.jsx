import Link from "next/link";
import { RefreshCw, CheckCircle, Clock, Truck, ShieldCheck, AlertCircle, HelpCircle, Mail, ArrowLeft, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Refund & Return Policy | Shop Shathi",
  description: "Learn about Shop Shathi's easy 7-day return policy, instant refunds, product replacement, and exchange guidelines.",
};

export default function RefundPolicyPage() {
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

          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-primary-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-sm">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-100">Customer Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Refund & Return Policy
            </h1>
            <p className="text-emerald-50 text-sm mt-2 max-w-xl">
              Shop with 100% confidence. We offer hassle-free 7-day returns, fast doorstep pickups, and instant refunds.
            </p>
            <p className="text-xs text-emerald-200/80 mt-4">
              Last Updated: <span className="font-semibold text-white">{lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <RefreshCw className="w-5 h-5 text-emerald-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">7-Day Easy Returns</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Return or exchange any eligible product within 7 days from the delivery date.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Truck className="w-5 h-5 text-blue-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Free Doorstep Pickup</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Our courier executive will collect the return package directly from your home address.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Clock className="w-5 h-5 text-purple-500 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Fast 24-48h Refunds</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Refunds are credited back to your original payment method within 24 to 48 hours of quality inspection.
            </p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h2>1. Return & Replacement Eligibility</h2>
            </div>
            <p>
              We want you to love everything you buy from Shop Shathi. If you receive an item that is defective, damaged in transit, incorrect size, or not as described, you are entitled to a full replacement or refund.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl space-y-2">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider">
                  Eligible For Return / Exchange:
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-900/80 dark:text-emerald-200/80">
                  <li>Damaged, broken, or physically defective items.</li>
                  <li>Wrong item, model, or color delivered.</li>
                  <li>Clothing/Footwear with size or fitting mismatch.</li>
                  <li>Products with missing parts or accessories.</li>
                  <li>Unopened items in original brand packaging with tags intact.</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-2xl space-y-2">
                <h3 className="font-bold text-red-800 dark:text-red-300 text-xs uppercase tracking-wider">
                  Non-Returnable Items:
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-red-900/80 dark:text-red-200/80">
                  <li>Innerwear, socks, and personal hygiene products.</li>
                  <li>Perishable groceries and consumables (once opened).</li>
                  <li>Customized or personalized gift items.</li>
                  <li>Items damaged due to misuse or tampering after delivery.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <RefreshCw className="w-5 h-5 text-emerald-500" />
              <h2>2. How to Request a Return or Replacement</h2>
            </div>
            <p>Initiating a return is simple and takes less than 1 minute:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Go to <strong className="text-gray-900 dark:text-white">My Orders</strong> in your account dashboard.</li>
              <li>Select the item you want to return and click <strong className="text-gray-900 dark:text-white">&ldquo;Request Return / Exchange&rdquo;</strong>.</li>
              <li>Choose the return reason and upload a quick photo if the item arrived damaged.</li>
              <li>Select whether you prefer a <strong className="text-gray-900 dark:text-white">Replacement / Size Exchange</strong> or a <strong className="text-gray-900 dark:text-white">Full Refund</strong>.</li>
              <li>Our logistics agent will arrive at your address within 24-48 hours to collect the item.</li>
            </ol>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h2>3. Refund Timelines & Payment Modes</h2>
            </div>
            <p>
              Once our warehouse verifies the returned item, your refund will be processed immediately according to your original payment method:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
                  <tr>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Refund Destination</th>
                    <th className="p-3">Estimated Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
                  <tr>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">UPI / Google Pay / PhonePe / Paytm</td>
                    <td className="p-3">Linked Bank Account / VPA</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Instant to 24 Hours</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">Credit Card / Debit Card</td>
                    <td className="p-3">Issuing Bank Account</td>
                    <td className="p-3">2 - 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">Net Banking</td>
                    <td className="p-3">Original Source Bank</td>
                    <td className="p-3">2 - 4 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">Cash on Delivery (COD)</td>
                    <td className="p-3">Direct Bank Transfer (NEFT/IMPS) or Store Wallet</td>
                    <td className="p-3">24 - 48 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
              <AlertCircle className="w-5 h-5 text-emerald-500" />
              <h2>4. Order Cancellation Policy</h2>
            </div>
            <p>
              You can cancel your order at any time before it has been dispatched from our fulfillment center directly from the <Link href="/profile" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">My Orders</Link> section.
            </p>
            <p>
              For prepaid orders, the full amount including any shipping fee paid will be automatically refunded to your original payment account immediately upon cancellation.
            </p>
          </section>

          {/* Contact Support Card */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Need help with a return or refund?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Our customer assistance team is available 24/7 to facilitate your return requests and track refunds.
              </p>
            </div>
            <a
              href="mailto:support@shopsathi.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
              Contact Returns Support
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
