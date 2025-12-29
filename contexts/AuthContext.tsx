
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Admin credentials
const ADMIN_EMAIL = 'mirosnic.ivan@icloud.com';
const ADMIN_PASSWORD = 'Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
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
  const [isPremium, setIsPremium] = useState(false);

  // Check if user is admin and has premium
  const checkAdminAndPremiumStatus = async (userId: string) => {
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
  };

  useEffect(() => {
    console.log('AuthContext: Initializing...');
    
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
        } else {
          console.log('AuthContext: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          if (session?.user) {
            setUser(session.user);
            
            // Check admin and premium status
            const status = await checkAdminAndPremiumStatus(session.user.id);
            setIsAdmin(status.isAdmin);
            setIsPremium(status.isPremium || status.isAdmin); // Admins always have premium
            
            console.log('AuthContext: User status - Admin:', status.isAdmin, 'Premium:', status.isPremium);
          }
        }
      } catch (error) {
        console.error('AuthContext: Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthContext: Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        
        // Check admin and premium status
        const status = await checkAdminAndPremiumStatus(session.user.id);
        setIsAdmin(status.isAdmin);
        setIsPremium(status.isPremium || status.isAdmin); // Admins always have premium
        
        console.log('AuthContext: User status - Admin:', status.isAdmin, 'Premium:', status.isPremium);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthContext: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Signing in with email:', email);
    
    // Check for admin login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log('AuthContext: Admin login detected, attempting Supabase auth');
      
      try {
        // Try to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.log('AuthContext: Admin user not found in Supabase, creating account');
          
          // Admin user doesn't exist, create it
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: 'https://natively.dev/email-confirmed',
              data: {
                is_admin: true,
              },
            },
          });

          if (signUpError) {
            console.error('AuthContext: Error creating admin account:', signUpError);
            return { error: signUpError };
          }

          console.log('AuthContext: Admin account created:', signUpData);

          // Create profile with admin flag
          if (signUpData.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: signUpData.user.id,
                email: signUpData.user.email,
                is_admin: true,
                is_premium: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error('AuthContext: Error creating admin profile:', profileError);
            } else {
              console.log('AuthContext: Admin profile created successfully');
            }

            console.log('AuthContext: Admin account created, please verify email if required');
          }

          return { error: null };
        }

        console.log('AuthContext: Admin sign in successful');
        
        // Ensure admin profile exists with correct flags
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              is_admin: true,
              is_premium: true,
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('AuthContext: Error updating admin profile:', profileError);
          } else {
            console.log('AuthContext: Admin profile updated successfully');
          }
        }

        return { error: null };
      } catch (error) {
        console.error('AuthContext: Admin sign in exception:', error);
        return { error };
      }
    }

    // Regular user login
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('AuthContext: Sign in error:', error);
      } else {
        console.log('AuthContext: Sign in successful');
      }
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Signing up with email:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
        },
      });
      
      if (error) {
        console.error('AuthContext: Sign up error:', error);
      } else {
        console.log('AuthContext: Sign up successful');
        
        // Create profile for new user
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              is_admin: false,
              is_premium: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('AuthContext: Error creating profile:', profileError);
          } else {
            console.log('AuthContext: User profile created successfully');
          }
        }
      }
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out');
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setIsPremium(false);
      console.log('AuthContext: Sign out successful');
    } catch (error) {
      console.error('AuthContext: Sign out exception:', error);
    }
  };

  const resetPassword = async (email: string) => {
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
  };

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
