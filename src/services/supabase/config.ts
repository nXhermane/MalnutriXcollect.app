import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createClient } from '@supabase/supabase-js';
import { supabaseStorage } from './storage';
import { Database } from './database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_PROJECT_REF = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_REF;
const SUPABASE_GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_SUPABASE_GOOGLE_PROVIDER_CLIENT_ID;

if (!SUPABASE_URL) throw new Error('EXPO_PUBLIC_SUPABASE_URL is not defined');
if (!SUPABASE_ANON_KEY) throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined');
if (!SUPABASE_GOOGLE_CLIENT_ID)
  throw new Error('EXPO_PUBLIC_SUPABASE_GOOGLE_PROVIDER_CLIENT_ID is not defined');

GoogleSignin.configure({
  webClientId: SUPABASE_GOOGLE_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export const SUPABASE_STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
