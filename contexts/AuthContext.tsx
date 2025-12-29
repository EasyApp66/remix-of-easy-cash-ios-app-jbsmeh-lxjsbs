
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
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

  const signInWithApple = async () => {
    console.log('AuthContext: Starting Apple Sign In');
    
    // Check if Apple Authentication is available
    if (Platform.OS !== 'ios') {
      console.log('AuthContext: Apple Sign In is only available on iOS');
      return { error: { message: 'Apple Sign In ist nur auf iOS verfügbar' } };
    }

    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        console.log('AuthContext: Apple Authentication is not available on this device');
        return { error: { message: 'Apple Sign In ist auf diesem Gerät nicht verfügbar' } };
      }

      console.log('AuthContext: Requesting Apple credentials');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('AuthContext: Apple credentials received');

      if (!credential.identityToken) {
        console.error('AuthContext: No identity token received from Apple');
        return { error: { message: 'Keine Anmeldeinformationen von Apple erhalten' } };
      }

      // Sign in with Supabase using the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        console.error('AuthContext: Error signing in with Apple:', error);
        return { error };
      }

      console.log('AuthContext: Successfully signed in with Apple');

      // Create or update user profile
      if (data.user) {
        const fullName = credential.fullName;
        const displayName = fullName 
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : null;

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: credential.email || data.user.email,
            full_name: displayName,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('AuthContext: Error creating/updating profile:', profileError);
        } else {
          console.log('AuthContext: Profile created/updated successfully');
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error('AuthContext: Apple Sign In exception:', error);
      
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return { error: { message: 'Anmeldung abgebrochen' } };
      }
      
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Signing in with email:', email);
    
    // Check for admin login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log('AuthContext: Admin login detected');
      
      try {
        // First, check if admin user exists in auth.users
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const adminExists = existingUsers?.users?.some(
          u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        );

        if (!adminExists) {
          console.log('AuthContext: Admin user does not exist, needs to be created manually');
          return { 
            error: { 
              message: 'Admin-Konto muss zuerst erstellt werden. Bitte registrieren Sie sich mit dieser E-Mail-Adresse.' 
            } 
          };
        }

        // Try to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('AuthContext: Admin sign in error:', error);
          return { error };
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
            }, {
              onConflict: 'id'
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
    
    // Check if this is the admin email
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
        
        // Create profile for new user
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              is_admin: isAdminEmail,
              is_premium: isAdminEmail,
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
