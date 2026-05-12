import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We don't throw an error here because it crashes the Next.js build process during prerendering.
// Instead, we initialize the client. It will fail gracefully in the browser if keys are truly missing.
export const supabase = createClient(supabaseUrl, supabaseKey);