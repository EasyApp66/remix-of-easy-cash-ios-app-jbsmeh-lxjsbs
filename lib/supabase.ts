
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://ozomtozjuvgdvxhpotdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b210b3pqdXZnZHZ4aHBvdGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY0MzksImV4cCI6MjA4MjA4MjQzOX0.WBT3fOGz7p-87cdYNz616DRzt8ccquarThCB5tm6ZVU';

console.log('Supabase: Initializing client...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase: Client initialized successfully');
