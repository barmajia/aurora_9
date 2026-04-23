"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Button,
  LanguageSwitcher,
  ThemeSwitcher,
  Magnetic,
} from "@/components/ui";

// ============================================================================
// Constants & Types
// ============================================================================

interface NavItem {
  label: string;
  path: string;
}

interface HeaderUser {
  name?: string;
  avatar_url?: string;
  id?: string;
  email?: string;
}

type AppRouter = ReturnType<typeof useRouter>;

const NAVIGATION_ITEMS: NavItem[] = [
  { label: "Products", path: "/products" }, // Changed to 'Products' for better UX flow
  { label: "Community", path: "/about" },
  { label: "Templates", path: "/templates" }, // Changed 'Updates' to 'Templates'
];

// Keep this for feature flags
const HIDDEN_HEADER_ROUTES = ["/seller", "/factory"];

// ============================================================================
// Custom Hooks (Kept exactly as is, they are perfect)
// ============================================================================

function useScrollDetection() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
}

function useHeaderState() {
  const pathname = usePathname();
  const router = useRouter();
  // Optimized selectors are key here!
  const { items: cartItems } = useCartStore();
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate total cart items once per render
  const totalCartItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
    setMobileMenuOpen(false);
  }, [router]);

  const shouldHideHeader = useMemo(
    () => HIDDEN_HEADER_ROUTES.some((route) => pathname.startsWith(route)),
    [pathname],
  );

  return {
    pathname,
    user,
    cartItems,
    wishlistItems,
    mobileMenuOpen,
    setMobileMenuOpen,
    totalCartItems,
    handleLogout,
    handleProfileClick,
    shouldHideHeader,
    router,
  };
}

// ============================================================================
// Sub-Components
// ============================================================================

// --- 1. Logo ---
function HeaderLogo() {
  return (
    <Link href="/" className="group flex items-center gap-3 cursor-pointer">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-zinc-200/70 bg-gradient-to-br from-zinc-100 via-white to-zinc-200 transition-all duration-500 group-hover:scale-105 dark:border-zinc-700 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,.7),transparent_55%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,.12),transparent_55%)]" />
        <div className="relative flex h-full w-full items-center justify-center">
          <Sparkles className="h-5 w-5 text-black dark:text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold uppercase leading-none tracking-tight text-zinc-900 dark:text-white">
          Aurora
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Ecosystem
        </span>
      </div>
    </Link>
  );
}

// --- 2. Navigation ---
interface HeaderNavigationProps {
  pathname: string;
  onItemClick?: () => void;
}

function HeaderNavigation({ pathname, onItemClick }: HeaderNavigationProps) {
  return (
    <nav className="flex items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-md transition-all dark:border-zinc-700 dark:bg-zinc-900/70">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onItemClick}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
              isActive
                ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// --- 3. Search Bar ---
interface HeaderSearchBarProps {
  className?: string;
}

function HeaderSearchBar({ className }: HeaderSearchBarProps) {
  return (
    <div className={cn("group relative", className)}>
      <input
        type="text"
        placeholder="Search products, guides, templates..."
        className="h-10 w-full rounded-full border border-zinc-200/80 bg-white/80 py-2.5 pl-11 pr-4 text-sm font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-900"
      />
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-900 dark:text-zinc-500 dark:group-focus-within:text-white"
        size={18}
      />
    </div>
  );
}

// --- 4. Icons (Cart & Wishlist) ---
interface CartIconProps {
  count: number;
}
function CartIconButton({ count }: CartIconProps) {
  return (
    <Magnetic strength={0.2}>
      <Link
        href="/cart"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-zinc-600 transition-all hover:border-zinc-200 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        title="Shopping Cart"
        aria-label="Shopping Cart"
      >
        <ShoppingBag size={22} />
        {count > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 min-w-24px h-24px bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
            {count}
          </span>
        )}
      </Link>
    </Magnetic>
  );
}

interface WishlistIconProps {
  count: number;
}
function WishlistIconButton({ count }: WishlistIconProps) {
  return (
    <Magnetic strength={0.2}>
      <Link
        href="/wishlist"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-zinc-600 transition-all hover:border-zinc-200 hover:bg-zinc-100 hover:text-rose-500 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        title="Wishlist"
        aria-label="Wishlist"
      >
        <Heart size={22} />
        {count > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        )}
      </Link>
    </Magnetic>
  );
}

// --- 5. User Profile Button ---
interface UserProfileButtonProps {
  user: HeaderUser | null;
  onProfileClick: () => void;
  router: AppRouter;
}

function UserProfileButton({
  user,
  onProfileClick,
  router,
}: UserProfileButtonProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push("/login")}
          variant="ghost"
          size="sm"
          className="h-10 px-5"
        >
          Sign In
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          size="sm"
          className="h-10 px-6"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const userName = user.name?.split(" ")[0] || "User";
  const avatarUrl = user.avatar_url;

  return (
    <button
      onClick={onProfileClick}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-zinc-200 hover:bg-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
      title={`Profile - ${userName}`}
      type="button"
    >
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">
          {userName}
        </span>
        <span className="text-[10px] font-medium tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">
          Profile
        </span>
      </div>
      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            width={40}
            height={40}
            className="object-cover"
          />
        ) : (
          <User size={20} className="text-zinc-400" />
        )}
      </div>
    </button>
  );
}

// --- 6. Mobile Menu (Left unchanged, highly effective) ---
interface MobileHeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user: HeaderUser | null;
  onLogout: () => void;
  router: AppRouter;
}

function MobileHeaderMenu({
  isOpen,
  onClose,
  user,
  onLogout,
  router,
}: MobileHeaderMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
          >
            <div className="mb-10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold uppercase tracking-tight text-black dark:text-white">
                  Aurora
                </span>
                <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Premium Ecosystem
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                title="Close menu"
                type="button"
              >
                <X size={22} className="text-black dark:text-white" />
              </button>
            </div>

            <HeaderSearchBar className="mb-8" />

            <nav className="mb-10 flex flex-col gap-3">
              {NAVIGATION_ITEMS.map((item) => {
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-xl font-semibold transition-colors",
                      isActive,
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  Preferences
                </span>
                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                </div>
              </div>
              {user ? (
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full border-rose-500 text-rose-500 hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- 7. Header Right Section (New Wrapper for Polish) ---
interface HeaderRightSectionProps {
  totalCartItems: number;
  wishlistCount: number;
  user: HeaderUser | null;
  onProfileClick: () => void;
  router: AppRouter;
}

function HeaderRightSection({
  totalCartItems,
  wishlistCount,
  user,
  onProfileClick,
  router,
}: HeaderRightSectionProps) {
  return (
    <div className="ml-auto flex items-center gap-3 lg:gap-5 xl:gap-6">
      {/* Search - Desktop Only */}
      <div className="hidden xl:block w-[320px]">
        <HeaderSearchBar />
      </div>

      {/* Icons Section (Must be before User profile for better flow) */}
      <div className="hidden items-center gap-1.5 lg:flex">
        <ThemeSwitcher />
        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
        <WishlistIconButton count={wishlistCount} />
        <CartIconButton count={totalCartItems} />
      </div>

      {/* User Menu - Desktop Only */}
      <div className="hidden lg:block">
        <UserProfileButton
          user={user}
          onProfileClick={onProfileClick}
          router={router}
        />
      </div>
    </div>
  );
}

// --- 8. Main Header Content (Cleaned up significantly) ---
interface HeaderContentProps {
  isScrolled: boolean;
  pathname: string;
  totalCartItems: number;
  wishlistCount: number;
  user: HeaderUser | null;
  onProfileClick: () => void;
  onMobileMenuOpen: () => void;
  router: AppRouter;
}

function HeaderContent({
  isScrolled,
  pathname,
  totalCartItems,
  wishlistCount,
  user,
  onProfileClick,
  onMobileMenuOpen,
  router,
}: HeaderContentProps) {
  // Dynamic classes for the sticky header effect
  const containerClasses = cn(
    "relative flex items-center justify-between rounded-2xl border px-4 py-3 lg:px-6 lg:py-4",
    "transition-all duration-500",
    isScrolled
      ? "border-zinc-200/70 bg-background/85 shadow-lg backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/75"
      : "border-zinc-200/40 bg-background/65 shadow-sm backdrop-blur-lg dark:border-zinc-800/40 dark:bg-zinc-950/55",
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 lg:px-8 xl:px-12">
      <div className={containerClasses}>
        <HeaderLogo />

        <div className="hidden flex-1 justify-center lg:flex">
          <HeaderNavigation pathname={pathname} />
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-1.5 lg:hidden">
            <WishlistIconButton count={wishlistCount} />
            <CartIconButton count={totalCartItems} />
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
            onClick={onMobileMenuOpen}
            title="Open menu"
            type="button"
          >
            <Menu size={22} />
          </button>
          <HeaderRightSection
            totalCartItems={totalCartItems}
            wishlistCount={wishlistCount}
            user={user}
            onProfileClick={onProfileClick}
            router={router}
          />
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// Main Header Component (The entry point)
// ==========================================================================

export default function Header() {
  const isScrolled = useScrollDetection();
  const {
    pathname,
    user,
    wishlistItems,
    mobileMenuOpen,
    setMobileMenuOpen,
    totalCartItems,
    handleLogout,
    handleProfileClick,
    shouldHideHeader,
    router,
  } = useHeaderState();

  // If the route should hide the header, return null.
  if (shouldHideHeader) {
    return null;
  }

  return (
    <>
      {/* Sticky header keeps spacing consistent across pages */}
      <header
        className={cn(
          "sticky left-0 right-0 top-0 z-30 transition-all duration-500",
          "py-3 lg:py-4",
        )}
      >
        <HeaderContent
          isScrolled={isScrolled}
          pathname={pathname}
          totalCartItems={totalCartItems}
          wishlistCount={wishlistItems.length}
          user={user}
          onProfileClick={handleProfileClick}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          router={router}
        />
      </header>

      {/* Mobile Menu (Overlays everything, so z-50 remains correct) */}
      <MobileHeaderMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        user={user}
        onLogout={handleLogout}
        router={router}
      />
    </>
  );
}
