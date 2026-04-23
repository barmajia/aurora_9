"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth callback
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Get or create user in users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError && userError.code !== "PGRST116") {
            // PGRST116 means no rows found, which is expected for new users
            throw userError;
          }

          // If user doesn't exist in our table, create them
          if (!userData) {
            const { error: insertError } = await supabase.from("users").insert([
              {
                id: session.user.id,
                email: session.user.email,
                name:
                  session.user.user_metadata?.full_name ||
                  session.user.email?.split("@")[0] ||
                  "User",
                account_type: "customer",
                avatar_url: session.user.user_metadata?.avatar_url || null,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);

            if (insertError && !insertError.message.includes("duplicate")) {
              console.warn("User creation warning:", insertError);
            }
          }

          // Store session in auth store
          setUser({
            id: session.user.id,
            uuid: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
            avatar_url: session.user.user_metadata?.avatar_url,
            role: "customer",
            accountType: "customer",
            isVerified: false,
          });

          setSession({
            token: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at
              ? session.expires_at * 1000
              : Date.now() + 24 * 60 * 60 * 1000,
          });

          // Redirect to home or intended destination
          router.push("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=auth_failed");
      }
    };

    handleCallback();
  }, [router, setUser, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020203]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Authenticating...
        </h1>
        <p className="text-white/60">
          Please wait while we complete your authentication.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
}
