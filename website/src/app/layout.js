import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/context/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Shop Shathi | Everything you need, delivered.",
  description:
    "Shop Shathi is your favorite online store for electronics, fashion, home & kitchen, health & beauty, and more. Best prices, fast delivery.",
  keywords: [
    "online shopping",
    "e-commerce",
    "electronics",
    "fashion",
    "home kitchen",
    "Shop Shathi",
  ],
  openGraph: {
    title: "Shop Shathi | Everything you need, delivered.",
    description:
      "Your favorite online store for everything — electronics, fashion, home & kitchen, and more.",
    siteName: "Shop Shathi",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization JSON-LD for rich search results
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shop Shathi",
  url: "https://sathi-shop.netlify.app",
  logo: "https://sathi-shop.netlify.app/icon.png",
  description:
    "Your favorite online store for everything you need, delivered right to your doorstep.",
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Preconnect to critical third-party origins */}
        <link
          rel="preconnect"
          href="https://shop-sathi-e-commerce-api.onrender.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>

        <Providers>
          <Navbar />
          <Toaster position="bottom-right" />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
