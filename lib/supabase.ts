
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { Database } from '@/app/integrations/supabase/types';

const supabaseUrl = 'https://ozomtozjuvgdvxhpotdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b210b3pqdXZnZHZ4aHBvdGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY0MzksImV4cCI6MjA4MjA4MjQzOX0.WBT3fOGz7p-87cdYNz616DRzt8ccquarThCB5tm6ZVU';

console.log('Supabase: Initializing client with typed database schema...');
console.log('Supabase URL:', supabaseUrl);
console.log('Platform:', Platform.OS);

// Create a custom storage adapter that works across all platforms
const createCustomStorage = () => {
  // For web, use localStorage directly to avoid window undefined errors
  if (Platform.OS === 'web') {
    console.log('Supabase: Using web localStorage adapter');
    return {
      getItem: async (key: string): Promise<string | null> => {
        try {
          // Check if we're in a browser environment
          if (typeof window !== 'undefined' && window.localStorage) {
            const value = window.localStorage.getItem(key);
            console.log(`Storage getItem: ${key} = ${value ? 'found' : 'null'}`);
            return value;
          }
          console.log('Storage getItem: window.localStorage not available, returning null');
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
            console.log(`Storage setItem: ${key} saved`);
          } else {
            console.log('Storage setItem: window.localStorage not available, skipping');
          }
        } catch (error) {
          console.error('Storage setItem error:', error);
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
            console.log(`Storage removeItem: ${key} removed`);
          } else {
            console.log('Storage removeItem: window.localStorage not available, skipping');
          }
        } catch (error) {
          console.error('Storage removeItem error:', error);
        }
      },
    };
  }
  
  // For native platforms, use AsyncStorage with proper error handling
  console.log('Supabase: Using AsyncStorage adapter for native platform');
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const value = await AsyncStorage.getItem(key);
        console.log(`AsyncStorage getItem: ${key} = ${value ? 'found' : 'null'}`);
        return value;
      } catch (error) {
        console.error('AsyncStorage getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(key, value);
        console.log(`AsyncStorage setItem: ${key} saved`);
      } catch (error) {
        console.error('AsyncStorage setItem error:', error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(key);
        console.log(`AsyncStorage removeItem: ${key} removed`);
      } catch (error) {
        console.error('AsyncStorage removeItem error:', error);
      }
    },
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
    // Use PKCE flow for better security
    flowType: 'pkce',
  },
});

console.log('Supabase: Client initialized successfully with full type safety');

// Export types for convenience
export type { Database } from '@/app/integrations/supabase/types';
