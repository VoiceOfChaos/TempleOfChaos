/* =====================================================
   TEMPLE OF CHAOS — SUPABASE CONFIG
===================================================== */

/*
   Replace these two values with the ones
   from your Supabase project.

   IMPORTANT:
   Use the PUBLIC/PUBLISHABLE key.
   NEVER put a secret/service-role key here.
*/

const SUPABASE_URL =
    "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";


/* Create the Supabase client */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
