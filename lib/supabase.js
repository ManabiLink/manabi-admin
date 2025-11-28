import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Use the service role key for privileged operations.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
