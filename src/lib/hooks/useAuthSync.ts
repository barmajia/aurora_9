"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";

export function useAuthSync() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name:
              session.user.user_metadata?.name ||
              session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role || "customer",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          role: session.user.user_metadata?.role || "customer",
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);
}
