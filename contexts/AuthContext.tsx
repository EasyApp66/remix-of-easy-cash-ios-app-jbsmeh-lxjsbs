
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Admin credentials
const ADMIN_EMAIL = 'mirosnic.ivan@icloud.com';
const ADMIN_PASSWORD = 'Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; success?: boolean }>;
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
  const [isPremium, setIsPremium] = useState(false);

  // Check if user is admin and has premium
  const checkAdminAndPremiumStatus = useCallback(async (userId: string) => {
    try {
      console.log('AuthContext: Checking admin and premium status for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_premium')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error checking admin/premium status:', error);
        return { isAdmin: false, isPremium: false };
      }

      console.log('AuthContext: Admin/Premium status:', data);
      return {
        isAdmin: data?.is_admin || false,
        isPremium: data?.is_premium || false,
      };
    } catch (error) {
      console.error('AuthContext: Exception checking admin/premium status:', error);
      return { isAdmin: false, isPremium: false };
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext: Initializing...');
    
    let mounted = true;
    
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
        } else {
          console.log('AuthContext: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          
          if (session?.user) {
            setUser(session.user);
            
            // Check admin and premium status
            const status = await checkAdminAndPremiumStatus(session.user.id);
            
            if (!mounted) return;
            
            setIsAdmin(status.isAdmin);
            setIsPremium(status.isPremium || status.isAdmin);
            
            console.log('AuthContext: User status - Admin:', status.isAdmin, 'Premium:', status.isPremium);
          }
        }
      } catch (error) {
        console.error('AuthContext: Exception getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      console.log('AuthContext: Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        
        // Check admin and premium status
        const status = await checkAdminAndPremiumStatus(session.user.id);
        
        if (!mounted) return;
        
        setIsAdmin(status.isAdmin);
        setIsPremium(status.isPremium || status.isAdmin);
        
        console.log('AuthContext: User status - Admin:', status.isAdmin, 'Premium:', status.isPremium);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      console.log('AuthContext: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, [checkAdminAndPremiumStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('AuthContext: Signing in with email:', email);
    
    // Check for admin login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log('AuthContext: Admin login detected');
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
            console.log('AuthContext: Admin user does not exist or email not confirmed');
            return {
              error: {
                message: 'Admin-Konto muss zuerst erstellt werden. Bitte registrieren Sie sich mit dieser E-Mail-Adresse.',
                needsRegistration: true
              },
              success: false
            };
          }
          console.error('AuthContext: Admin sign in error:', error);
          return { error, success: false };
        }

        console.log('AuthContext: Admin sign in successful');
        
        // Ensure admin profile exists (non-blocking)
        if (data.user) {
          supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              is_admin: true,
              is_premium: true,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            })
            .then(({ error: profileError }) => {
              if (profileError) {
                console.error('AuthContext: Error updating admin profile:', profileError);
              }
            });
        }

        return { error: null, success: true };
      } catch (error) {
        console.error('AuthContext: Admin sign in exception:', error);
        return { error, success: false };
      }
    }

    // Regular user login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        return { error, success: false };
      }
      
      console.log('AuthContext: Sign in successful');
      return { error: null, success: true };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      return { error, success: false };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('AuthContext: Signing up with email:', email);
    
    const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: isAdminEmail ? {
            is_admin: true,
          } : undefined,
        },
      });
      
      if (error) {
        console.error('AuthContext: Sign up error:', error);
      } else {
        console.log('AuthContext: Sign up successful');
        
        // Create profile for new user (non-blocking)
        if (data.user) {
          supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              is_admin: isAdminEmail,
              is_premium: isAdminEmail,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .then(({ error: profileError }) => {
              if (profileError) {
                console.error('AuthContext: Error creating profile:', profileError);
              }
            });
        }
      }
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign up exception:', error);
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('AuthContext: Starting sign out process...');
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Supabase sign out error:', error);
        throw error;
      }
      
      console.log('AuthContext: Supabase sign out successful');
      
      // Clear local state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      
      // Clear AsyncStorage
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log('AuthContext: Clearing AsyncStorage keys:', keys);
        await AsyncStorage.multiRemove(keys);
        console.log('AuthContext: AsyncStorage cleared successfully');
      } catch (storageError) {
        console.error('AuthContext: Error clearing AsyncStorage:', storageError);
      }
      
      // Clear web localStorage if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        try {
          const supabaseKeys = Object.keys(window.localStorage).filter(key =>
            key.startsWith('sb-') || key.includes('supabase')
          );
          console.log('AuthContext: Clearing web localStorage keys:', supabaseKeys);
          supabaseKeys.forEach(key => window.localStorage.removeItem(key));
          console.log('AuthContext: Web localStorage cleared successfully');
        } catch (webStorageError) {
          console.error('AuthContext: Error clearing web localStorage:', webStorageError);
        }
      }
      
      console.log('AuthContext: Sign out completed successfully');
    } catch (error) {
      console.error('AuthContext: Sign out exception:', error);
      // Clear local state even on error
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    console.log('AuthContext: Resetting password for email:', email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });
      if (error) {
        console.error('AuthContext: Reset password error:', error);
      } else {
        console.log('AuthContext: Reset password email sent');
      }
      return { error };
    } catch (error) {
      console.error('AuthContext: Reset password exception:', error);
      return { error };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        isPremium,
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
