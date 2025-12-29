
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Admin credentials
const ADMIN_EMAIL = 'mirosnic.ivan@icloud.com';
const ADMIN_PASSWORD = 'Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo';
const ADMIN_STORAGE_KEY = '@admin_logged_in';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Check if admin is logged in from storage
    const checkAdminStatus = async () => {
      try {
        const adminLoggedIn = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
        if (adminLoggedIn === 'true') {
          console.log('AuthProvider: Admin session found in storage');
          setIsAdmin(true);
          const mockAdminUser = {
            id: 'admin-user',
            email: ADMIN_EMAIL,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User;
          setUser(mockAdminUser);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    const initAuth = async () => {
      await checkAdminStatus();
      
      // Get initial session
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          if (session?.user) {
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        setIsAdmin(false); // Regular user login
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in with email:', email);
    
    // Check for admin login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log('AuthProvider: Admin login detected');
      try {
        await AsyncStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        setIsAdmin(true);
        // Create a mock user for admin
        const mockAdminUser = {
          id: 'admin-user',
          email: ADMIN_EMAIL,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        setUser(mockAdminUser);
        setLoading(false);
        console.log('AuthProvider: Admin login successful, user set');
        return { error: null };
      } catch (error) {
        console.error('AuthProvider: Error saving admin status:', error);
        return { error };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('AuthProvider: Sign in error:', error);
      } else {
        console.log('AuthProvider: Sign in successful');
        setIsAdmin(false);
      }
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Signing up with email:', email);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
        },
      });
      if (error) {
        console.error('AuthProvider: Sign up error:', error);
      } else {
        console.log('AuthProvider: Sign up successful');
      }
      return { error };
    } catch (error) {
      console.error('AuthProvider: Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    try {
      if (isAdmin) {
        // Admin logout
        await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
        setIsAdmin(false);
        setUser(null);
        setSession(null);
        console.log('AuthProvider: Admin sign out successful');
      } else {
        // Normal user logout
        await supabase.auth.signOut();
        console.log('AuthProvider: Sign out successful');
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('AuthProvider: Resetting password for email:', email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });
      if (error) {
        console.error('AuthProvider: Reset password error:', error);
      } else {
        console.log('AuthProvider: Reset password email sent');
      }
      return { error };
    } catch (error) {
      console.error('AuthProvider: Reset password exception:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
