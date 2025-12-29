
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '@/app/integrations/supabase/types';

const supabaseUrl = 'https://ozomtozjuvgdvxhpotdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b210b3pqdXZnZHZ4aHBvdGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY0MzksImV4cCI6MjA4MjA4MjQzOX0.WBT3fOGz7p-87cdYNz616DRzt8ccquarThCB5tm6ZVU';

console.log('Supabase: Initializing client with typed database schema...');
console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase: Client initialized successfully with full type safety');

// Export types for convenience
export type { Database } from '@/app/integrations/supabase/types';
