import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofovfxsfazlwvcakpuer.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb3ZmeHNmYXpsd3ZjYWtwdWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjY0MDcsImV4cCI6MjA4NzcwMjQwN30.QYx8-c9IiSMpuHeikKz25MKO5o6g112AKj4Tnr4aWzI";

// Optimized Supabase client with better connection pooling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  },
  db: {
    schema: "public",
  },
});

// Cached version of supabase for read-heavy operations
export const getCachedSupabase = cache(() => supabase);
