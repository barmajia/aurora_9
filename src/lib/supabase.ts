import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  "https://ofovfxsfazlwvcakpuer.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb3ZmeHNmYXpsd3ZjYWtwdWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjY0MDcsImV4cCI6MjA4NzcwMjQwN30.QYx8-c9IiSMpuHeikKz25MKO5o6g112AKj4Tnr4aWzI",
);
