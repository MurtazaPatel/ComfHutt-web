import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// We don't throw error here because it breaks the build process on Vercel
// during static generation if the environment variables are not provided.
// Instead, we use placeholders so that the client can still be exported
// and used in try-catch blocks without crashing the build.
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: {
      persistSession: false,
    },
  }
);


