
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
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

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('AuthProvider: Exception getting initial session:', error);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in with email:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('AuthProvider: Sign in error:', error);
      } else {
        console.log('AuthProvider: Sign in successful');
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
      await supabase.auth.signOut();
      console.log('AuthProvider: Sign out successful');
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
