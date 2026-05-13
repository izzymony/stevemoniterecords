import { createClient } from '@supabase/supabase-js';

// Fallback to a placeholder URL during build if the real one is missing.
// This prevents 'supabaseUrl is required' errors during Next.js prerendering on Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only log in development to help debugging missing keys
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    console.warn("⚠️ Supabase credentials missing in .env file. Using placeholders.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
