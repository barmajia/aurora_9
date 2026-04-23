import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import ToastContainer from "@/components/ToastContainer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Providers from "@/components/Providers";
import SearchCenter from "@/components/SearchCenter";
import { CookieConsent } from "@/components/ui/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s | Aurora",
    default: "Aurora - Premium E-commerce",
  },
  description:
    "Discover premium products with a stunning shopping experience. Quality products, fair prices, excellent service.",
  keywords: [
    "e-commerce",
    "online shopping",
    "premium products",
    "electronics",
    "fashion",
  ],
  authors: [{ name: "Aurora" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aurora.com",
    siteName: "Aurora",
    title: "Aurora - Premium E-commerce",
    description:
      "Discover premium products with a stunning shopping experience",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora - Premium e-commerce",
    description:
      "Discover premium products with a stunning shopping experience",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <Providers>
            <CartProvider>
              <Header />
              <main id="main-content" className="app-shell max-w mx-auto">
                {children}
              </main>
              <Footer />
              <ToastContainer />
              <CookieConsent />
              <SearchCenter />
            </CartProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
