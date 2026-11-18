import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://flqqzwybapmhihaqplfk.supabase.co';

const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  'sb_publishable_AzvAiwdqHBUO1B2QEcZIRw_1rChHfkf';

export const supabase = createClient(supabaseUrl, supabaseKey);

