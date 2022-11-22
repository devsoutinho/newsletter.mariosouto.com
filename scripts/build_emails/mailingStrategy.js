import { createClient } from "@supabase/supabase-js";

function dbClient() {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABSE_KEY);
}

export const mailingStrategy = {
    async newsletter() {
        const { data, error } = await dbClient()
            .from("newsletter")
            .select("*");
        return data;
    }
};