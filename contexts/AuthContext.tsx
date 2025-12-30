
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

const ADMIN_EMAIL = 'mirosnic.ivan@icloud.com';
const ADMIN_PASSWORD = 'Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (email: string, password: string) => Promise<{ error: unknown }>;
  signInWithApple: () => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const checkAdminAndPremiumStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_premium')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin/premium status:', error);
        return { isAdmin: false, isPremium: false };
      }

      return {
        isAdmin: data?.is_admin || false,
        isPremium: data?.is_premium || false,
      };
    } catch (error) {
      console.error('Exception checking admin/premium status:', error);
      return { isAdmin: false, isPremium: false };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          setSession(session);
          if (session?.user) {
            setUser(session.user);
            const status = await checkAdminAndPremiumStatus(session.user.id);
            setIsAdmin(status.isAdmin);
            setIsPremium(status.isPremium || status.isAdmin);
          }
        }
      } catch (error) {
        console.error('Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        const status = await checkAdminAndPremiumStatus(session.user.id);
        setIsAdmin(status.isAdmin);
        setIsPremium(status.isPremium || status.isAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      return { error: { message: 'Apple Sign In ist nur auf iOS verfügbar' } };
    }

    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return { error: { message: 'Apple Sign In ist auf diesem Gerät nicht verfügbar' } };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return { error: { message: 'Keine Anmeldeinformationen von Apple erhalten' } };
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const fullName = credential.fullName;
        const displayName = fullName 
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : null;

        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: credential.email || data.user.email,
            full_name: displayName,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });
      }

      return { error: null };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_REQUEST_CANCELED') {
        return { error: { message: 'Anmeldung abgebrochen' } };
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const adminExists = existingUsers?.users?.some(
          u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        );

        if (!adminExists) {
          return { 
            error: { 
              message: 'Admin-Konto muss zuerst erstellt werden. Bitte registrieren Sie sich mit dieser E-Mail-Adresse.' 
            } 
          };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              is_admin: true,
              is_premium: true,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });
        }

        return { error: null };
      } catch (error) {
        return { error };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
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
        return { error };
      }
      
      if (data.user) {
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            is_admin: isAdminEmail,
            is_premium: isAdminEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setIsPremium(false);
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });
      return { error };
    } catch (error) {
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
        signInWithApple,
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
