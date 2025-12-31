
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { Database } from '@/app/integrations/supabase/types';

const supabaseUrl = 'https://ozomtozjuvgdvxhpotdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b210b3pqdXZnZHZ4aHBvdGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY0MzksImV4cCI6MjA4MjA4MjQzOX0.WBT3fOGz7p-87cdYNz616DRzt8ccquarThCB5tm6ZVU';

console.log('Supabase: Initializing client...');
console.log('Supabase URL:', supabaseUrl);
console.log('Platform:', Platform.OS);

// Create a storage adapter that works reliably across all platforms
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    console.log('Supabase: Using web localStorage adapter');
    return {
      getItem: async (key: string): Promise<string | null> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key);
          }
          return null;
        } catch (error) {
          console.error('Storage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
          }
        } catch (error) {
          console.error('Storage setItem error:', error);
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
          }
        } catch (error) {
          console.error('Storage removeItem error:', error);
        }
      },
    };
  }

  // For native platforms (iOS/Android), use AsyncStorage
  console.log('Supabase: Using AsyncStorage adapter for native platform');
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('AsyncStorage getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('AsyncStorage setItem error:', error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('AsyncStorage removeItem error:', error);
      }
    },
  };
};

// Initialize Supabase client with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'pkce',
    storageKey: 'supabase.auth.token',
  },
});

console.log('Supabase: Client initialized successfully');

// Export types for convenience
export type { Database } from '@/app/integrations/supabase/types';
