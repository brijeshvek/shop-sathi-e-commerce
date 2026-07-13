import Link from "next/link";
import { Mail, ShieldCheck, Truck, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand Info & Trust Badges */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white dark:text-black font-heading tracking-tight mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Shop Shathi
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm">
              Your ultimate online shopping destination. We deliver the best products at the best prices, straight to your doorstep with guaranteed security.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg text-center">
                <Truck className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg text-center">
                <CreditCard className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Easy Returns</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <nav aria-label="Company links">
            <h4 className="text-lg font-bold text-white dark:text-black mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
              <li><Link href="/seller-registration" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Become a Seller</Link></li>
            </ul>
          </nav>

          {/* Help */}
          <nav aria-label="Help links">
            <h4 className="text-lg font-bold text-white dark:text-black mb-6 uppercase tracking-wider text-sm">Help & Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Shipping Info</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Track Order</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Customer Support</Link></li>
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Top categories">
            <h4 className="text-lg font-bold text-white dark:text-black mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/category/electronics" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Electronics</Link></li>
              <li><Link href="/category/fashion" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Fashion</Link></li>
              <li><Link href="/category/home-kitchen" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Home & Kitchen</Link></li>
              <li><Link href="/category/health-beauty" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Health & Beauty</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all font-semibold text-white dark:text-primary-400">All Products &rarr;</Link></li>
            </ul>
          </nav>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Shop Shathi. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
