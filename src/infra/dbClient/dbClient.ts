import { createClient } from "@supabase/supabase-js";

export function dbClient() {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABSE_KEY);
}