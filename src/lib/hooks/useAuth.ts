import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useTranslation } from "react-i18next";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  role?: "customer" | "seller" | "factory";
  storeName?: string;
  factoryName?: string;
}

export const useAuth = () => {
  const { t, i18n } = useTranslation();
  const authStore = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("Invalid credentials"));
      }

      const data = await response.json();
      const { user, token, refreshToken, expiresAt } = data;

      // Store user with UUID and account type
      authStore.setUser({
        id: user.id,
        uuid: user.id, // Assuming the API returns UUID as 'id'
        email: user.email,
        name: user.name,
        avatar_url: user.avatar,
        role: user.role,
        accountType: user.role,
        storeName: user.storeName,
        factoryName: user.factoryName,
        isVerified: user.isVerified,
        language: i18n.language,
      });

      // Store session
      authStore.setSession({
        token,
        refreshToken,
        expiresAt: expiresAt || Date.now() + 24 * 60 * 60 * 1000,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("Invalid credentials");
      authStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authStore.setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("Signup successful"));
      }

      const data = await response.json();
      const { user, token, refreshToken, expiresAt } = data;

      // Store user with UUID and account type
      authStore.setUser({
        id: user.id,
        uuid: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar,
        role: user.role,
        accountType: user.role,
        storeName: user.storeName,
        factoryName: user.factoryName,
        isVerified: user.isVerified,
        language: i18n.language,
      });

      // Store session
      authStore.setSession({
        token,
        refreshToken,
        expiresAt: expiresAt || Date.now() + 24 * 60 * 60 * 1000,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("Signup successful");
      authStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authStore.setLoading(false);
    }
  };

  const logout = () => {
    authStore.logout();
  };

  const updateLanguage = (language: string) => {
    if (authStore.user) {
      authStore.setUser({
        ...authStore.user,
        language,
      });
    }
    i18n.changeLanguage(language);
  };

  const isSessionValid = () => {
    return authStore.isSessionValid();
  };

  const getAuthHeaders = () => {
    return authStore.getAuthHeader();
  };

  return {
    // State
    user: isMounted ? authStore.user : null,
    session: isMounted ? authStore.session : null,
    isLoading: authStore.isLoading,
    error: authStore.error,
    isHydrated: isMounted ? authStore.isHydrated : false,
    isMounted,

    // Actions
    login,
    signup,
    logout,
    updateLanguage,
    isSessionValid,
    getAuthHeaders,

    // Computed
    isAuthenticated:
      isMounted && !!authStore.user && authStore.isSessionValid(),
    userDisplayName: authStore.user?.displayName,
    accountType: authStore.user?.accountType,
    userLanguage: authStore.user?.language || i18n.language,
  };
};
