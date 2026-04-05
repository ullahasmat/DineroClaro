import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const isValidUrl = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

export const supabase: SupabaseClient | null =
  isValidUrl ? createClient(supabaseUrl, supabaseAnonKey) : null;
