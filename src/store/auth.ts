import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/lib/i18n";

export interface User {
  id: string;
  uuid?: string;
  email: string;
  name: string;
  displayName?: string;
  avatar_url?: string;
  role: "customer" | "seller" | "factory" | "admin";
  accountType?: "customer" | "seller" | "factory" | "admin";
  storeName?: string;
  factoryName?: string;
  isVerified?: boolean;
  language?: string;
}

interface SessionData {
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

interface AuthState {
  user: User | null;
  session: SessionData | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: SessionData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
  isSessionValid: () => boolean;
  getAuthHeader: () => Record<string, string>;
}

const STORAGE_KEY = "aurora-auth-session";

// Helper to determine account type based on role and user data
const determineAccountType = (
  role: string,
  data?: { storeName?: string; factoryName?: string },
): "customer" | "seller" | "factory" | "admin" => {
  if (role === "factory" || data?.factoryName) return "factory";
  if (role === "seller" || data?.storeName) return "seller";
  if (role === "admin") return "admin";
  return "customer";
};

// Helper to get user display name
const getDisplayName = (user: Partial<User>): string => {
  if (user.storeName) return user.storeName;
  if (user.factoryName) return user.factoryName;
  return user.name || user.email || "User";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setUser: (user) => {
        if (user) {
          // Enrich user data with account type and display name
          const enrichedUser = {
            ...user,
            accountType: determineAccountType(user.role, user),
            displayName: getDisplayName(user),
            language:
              user.language ||
              (typeof window !== "undefined" ? navigator.language : "en"),
          };
          set({ user: enrichedUser });

          // Set language if different from current
          if (
            enrichedUser.language &&
            enrichedUser.language !== i18n.language
          ) {
            i18n.changeLanguage(enrichedUser.language);
          }
        } else {
          set({ user: null });
        }
      },

      setSession: (session) => {
        set({ session });
        if (session) {
          // Store session in localStorage
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                ...session,
                storedAt: Date.now(),
              }),
            );
          } catch (err) {
            console.error("Failed to store session:", err);
          }
        } else {
          // Clear session from localStorage
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (err) {
            console.error("Failed to clear session:", err);
          }
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      logout: () => {
        set({
          user: null,
          session: null,
          error: null,
        });
        // Clear all auth-related data from localStorage
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("auth-storage");
        } catch (err) {
          console.error("Failed to clear localStorage:", err);
        }
      },

      isSessionValid: () => {
        const state = get();
        if (!state.session || !state.user) return false;

        const now = Date.now();
        const isExpired = state.session.expiresAt < now;

        if (isExpired) {
          // Session expired, clear it
          state.logout();
          return false;
        }

        return true;
      },

      getAuthHeader: (): Record<string, string> => {
        const state = get();
        if (!state.session?.token) {
          return {};
        }
        return {
          Authorization: `Bearer ${state.session.token}`,
          "Content-Type": "application/json",
        };
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isHydrated: state.isHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore session from localStorage if available
          try {
            const storedSession = localStorage.getItem(STORAGE_KEY);
            if (storedSession) {
              const parsed = JSON.parse(storedSession);
              // Check if stored session is still valid
              if (parsed.expiresAt > Date.now()) {
                state.session = {
                  token: parsed.token,
                  refreshToken: parsed.refreshToken,
                  expiresAt: parsed.expiresAt,
                };
              } else {
                // Clear expired session
                localStorage.removeItem(STORAGE_KEY);
              }
            }
          } catch (err) {
            console.error("Failed to restore session:", err);
          }
          state.isHydrated = true;
        }
      },
    },
  ),
);
