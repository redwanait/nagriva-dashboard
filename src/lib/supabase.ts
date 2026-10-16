import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Browser Supabase client.
 *
 * SECURITY: this client only ever uses the publishable / anon key from
 * `VITE_SUPABASE_ANON_KEY`. A `service_role` key or an `sb_secret_*` key must
 * never be used here — it would be shipped to the browser and bypass Row Level
 * Security. Authentication uses Supabase Auth with a persisted session.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const PLACEHOLDER_PATTERN =
  /(your[-_ ]?(project|anon|supabase|key)|placeholder|changeme|change[-_ ]?me|replace[-_ ]?me|example\.|xxxx)/i

function looksLikePlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value) || value.startsWith('<')
}

function looksLikeSecretKey(value: string): boolean {
  return value.startsWith('sb_secret_') || value.includes('service_role')
}

/**
 * Human-readable configuration fault, or `null` when the environment is usable.
 * A fault must surface as an explicit error screen — never a silent fallback
 * to mock data or an unauthenticated client.
 */
export const SUPABASE_CONFIG_ERROR: string | null = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart the dev server.'
  }
  if (!/^https:\/\/.+\.supabase\.(co|in)\/?$/.test(supabaseUrl)) {
    return 'VITE_SUPABASE_URL does not look like a valid Supabase project URL.'
  }
  if (looksLikeSecretKey(supabaseUrl) || looksLikeSecretKey(supabaseAnonKey)) {
    return 'The configured Supabase key looks like a secret or service-role key. Only the publishable / anon key may be used in the browser.'
  }
  if (looksLikePlaceholder(supabaseUrl) || looksLikePlaceholder(supabaseAnonKey)) {
    return 'The Supabase environment variables still contain placeholder values. Replace them with your project URL and publishable key.'
  }
  return null
})()

export const isSupabaseConfigured = SUPABASE_CONFIG_ERROR === null

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'nagriva-dashboard-auth',
      },
    })
  : null

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      SUPABASE_CONFIG_ERROR ??
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.',
    )
  }
  return supabase
}
