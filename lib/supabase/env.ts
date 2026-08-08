const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabasePublishableKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getSupabasePublicConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return {
    url: supabaseUrl,
    anonKey: supabasePublishableKey,
  };
}
