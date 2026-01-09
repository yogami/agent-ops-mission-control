import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using Service Role Key
 * Bypasses RLS for management operations.
 */
export function getSupabaseServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase server-side environment variables.');
    }

    return createClient(supabaseUrl, supabaseKey);
}
