
# Easy Budget - Authentication Guide

This document provides a comprehensive overview of the authentication system implemented in the Easy Budget app.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Architecture](#authentication-architecture)
3. [Supabase Client Setup](#supabase-client-setup)
4. [User Registration (Sign Up)](#user-registration-sign-up)
5. [User Login (Sign In)](#user-login-sign-in)
6. [Admin Authentication](#admin-authentication)
7. [Session Management](#session-management)
8. [Password Reset](#password-reset)
9. [User Logout](#user-logout)
10. [Row Level Security (RLS)](#row-level-security-rls)
11. [Premium & Admin Status](#premium--admin-status)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Easy Budget app uses **Supabase Authentication** with the following features:

- **Email/Password Authentication**: Standard email and password login
- **Admin Access**: Special admin account with elevated privileges
- **Session Persistence**: Sessions stored in AsyncStorage for React Native
- **Email Verification**: Users must verify their email before full access
- **Row Level Security**: Database-level security policies
- **Premium Features**: Premium status tracked in user profiles

---

## Authentication Architecture

### Key Components

1. **AuthContext** (`contexts/AuthContext.tsx`)
   - Manages authentication state globally
   - Provides sign in, sign up, sign out, and password reset functions
   - Tracks user session, admin status, and premium status

2. **Supabase Client** (`lib/supabase.ts`)
   - Configured with AsyncStorage for session persistence
   - Auto-refreshes tokens
   - Detects session changes automatically

3. **Login Screen** (`app/(tabs)/(home)/login.tsx`)
   - User interface for authentication
   - Handles both sign in and sign up flows
   - Provides password reset functionality

### Authentication Flow Diagram

```
User Opens App
    ↓
AuthContext Initializes
    ↓
Check for Existing Session (AsyncStorage)
    ↓
    ├─→ Session Found → Load User Data → Check Admin/Premium Status
    │                                          ↓
    │                                    Navigate to Budget Screen
    ↓
No Session → Show Welcome/Login Screen
    ↓
User Enters Credentials
    ↓
    ├─→ Sign Up → Create Account → Send Verification Email → Show Alert
    │                                                              ↓
    │                                                    User Verifies Email
    │                                                              ↓
    ├─→ Sign In → Verify Credentials → Create Session → Navigate to Budget
    │
    └─→ Admin Login → Special Handling → Auto-create if needed → Full Access
```

---

## Supabase Client Setup

### Configuration (`lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ozomtozjuvgdvxhpotdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,           // Persist sessions in AsyncStorage
    autoRefreshToken: true,           // Automatically refresh expired tokens
    persistSession: true,             // Keep user logged in across app restarts
    detectSessionInUrl: false,        // Disable URL-based session detection (mobile)
  },
});
```

### Key Settings Explained

- **storage: AsyncStorage**: Stores authentication tokens locally on the device
- **autoRefreshToken: true**: Automatically refreshes access tokens before they expire
- **persistSession: true**: Maintains user session even after app is closed
- **detectSessionInUrl: false**: Disabled for mobile (used for web OAuth redirects)

---

## User Registration (Sign Up)

### Process Flow

1. User enters email and password
2. App calls `signUp()` function
3. Supabase creates user account
4. Verification email sent to user
5. User profile created in `profiles` table
6. Alert shown to verify email

### Code Implementation

```typescript
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://natively.dev/email-confirmed',
    },
  });
  
  if (!error && data.user) {
    // Create user profile
    await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      is_admin: false,
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return { error };
};
```

### Important Notes

- **Email Verification Required**: By default, users must verify their email before they can sign in
- **emailRedirectTo**: Specifies where users are redirected after email verification
- **Profile Creation**: A profile record is automatically created for each new user
- **Default Status**: New users are NOT admin and NOT premium by default

### User Experience

1. User fills out registration form
2. Clicks "Sign Up" button
3. Receives alert: "Registration successful! Please check your email to verify your account."
4. User checks email and clicks verification link
5. User can now sign in with their credentials

---

## User Login (Sign In)

### Process Flow

1. User enters email and password
2. App calls `signIn()` function
3. Supabase verifies credentials
4. If valid, creates session
5. Session stored in AsyncStorage
6. User redirected to Budget screen

### Code Implementation

```typescript
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (!error) {
    // Session automatically stored by Supabase client
    // AuthContext will detect the session change
    router.replace('/(tabs)/budget');
  }
  
  return { error };
};
```

### Session Creation

When sign in is successful:
1. Supabase returns a session object containing:
   - `access_token`: JWT token for API requests
   - `refresh_token`: Token to get new access tokens
   - `user`: User object with id, email, etc.
2. Session is automatically stored in AsyncStorage
3. `onAuthStateChange` listener in AuthContext is triggered
4. User state is updated throughout the app

### Error Handling

Common errors:
- **"Invalid login credentials"**: Wrong email or password
- **"Email not confirmed"**: User hasn't verified their email yet
- **"User not found"**: Account doesn't exist

---

## Admin Authentication

### Admin Credentials

```typescript
const ADMIN_EMAIL = 'mirosnic.ivan@icloud.com';
const ADMIN_PASSWORD = 'Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo';
```

### Special Admin Handling

The admin login has special logic:

1. **Auto-Creation**: If admin account doesn't exist, it's automatically created
2. **Profile Setup**: Admin profile is created with `is_admin: true` and `is_premium: true`
3. **Bypass Limits**: Admin users bypass all premium feature limits
4. **Full Access**: Admin can view and modify all data (via RLS policies)

### Admin Sign In Flow

```typescript
if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
  // Try to sign in
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // Admin doesn't exist, create account
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://natively.dev/email-confirmed',
        data: { is_admin: true },
      },
    });
    
    // Create admin profile
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      is_admin: true,
      is_premium: true,
    });
  }
}
```

### Admin Privileges

- **No Premium Limits**: Can create unlimited budgets and subscriptions
- **View All Data**: RLS policies allow viewing all users' data
- **Modify All Data**: Can update/delete any user's data
- **Automatic Premium**: Always has premium features enabled

---

## Session Management

### How Sessions Work

1. **Initial Load**: When app starts, AuthContext checks for existing session
2. **Session Retrieval**: `supabase.auth.getSession()` loads session from AsyncStorage
3. **State Update**: If session exists, user is automatically logged in
4. **Token Refresh**: Access tokens are automatically refreshed before expiry

### Session Lifecycle

```typescript
useEffect(() => {
  // Get initial session
  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    
    if (session?.user) {
      // Check admin and premium status
      const status = await checkAdminAndPremiumStatus(session.user.id);
      setIsAdmin(status.isAdmin);
      setIsPremium(status.isPremium || status.isAdmin);
    }
    
    setLoading(false);
  };
  
  initAuth();
  
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setSession(session);
      // Update user state...
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

### Session Events

The `onAuthStateChange` listener detects:
- **SIGNED_IN**: User successfully logged in
- **SIGNED_OUT**: User logged out
- **TOKEN_REFRESHED**: Access token was refreshed
- **USER_UPDATED**: User profile was updated

### Session Persistence

- Sessions are stored in AsyncStorage
- Persist across app restarts
- Automatically restored on app launch
- Tokens refresh automatically (default: 1 hour expiry)

---

## Password Reset

### Process Flow

1. User clicks "Forgot Password?"
2. Enters email address
3. App calls `resetPassword()` function
4. Supabase sends password reset email
5. User clicks link in email
6. User enters new password
7. Password is updated

### Code Implementation

```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://natively.dev/reset-password',
  });
  
  return { error };
};
```

### User Experience

1. User clicks "Forgot Password?" on login screen
2. Alert prompts for confirmation
3. User confirms, reset email is sent
4. User receives email with reset link
5. User clicks link and is redirected to reset page
6. User enters new password
7. User can now sign in with new password

---

## User Logout

### Process Flow

1. User clicks "Logout" button
2. App calls `signOut()` function
3. Supabase invalidates session
4. Session removed from AsyncStorage
5. User state cleared
6. User redirected to welcome screen

### Code Implementation

```typescript
const signOut = async () => {
  await supabase.auth.signOut();
  setIsAdmin(false);
  setIsPremium(false);
};
```

### What Happens on Logout

- Access token is invalidated on server
- Refresh token is invalidated
- Session removed from AsyncStorage
- All user state cleared from app
- User redirected to login/welcome screen

---

## Row Level Security (RLS)

### What is RLS?

Row Level Security is a PostgreSQL feature that restricts which rows users can access in database tables. It provides database-level security independent of application code.

### RLS Policies in Easy Budget

#### Profiles Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (is_admin_user());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
USING (is_admin_user());
```

#### User Budgets Table

```sql
-- Users can view their own budgets
CREATE POLICY "Users can view their own budgets" 
ON user_budgets FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own budgets
CREATE POLICY "Users can insert their own budgets" 
ON user_budgets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own budgets
CREATE POLICY "Users can update their own budgets" 
ON user_budgets FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own budgets
CREATE POLICY "Users can delete their own budgets" 
ON user_budgets FOR DELETE 
USING (auth.uid() = user_id);

-- Admin policies (view, insert, update, delete all)
-- Similar structure for admins using is_admin_user()
```

#### Similar Policies for:
- `user_expenses`
- `user_subscriptions`
- `premium_purchases`

### How RLS Works

1. **User makes request**: App sends query to Supabase
2. **Authentication check**: Supabase verifies JWT token
3. **Policy evaluation**: Database checks RLS policies
4. **Filter results**: Only rows matching policies are returned
5. **Response**: Filtered data sent back to app

### Benefits of RLS

- **Security**: Users can't access other users' data, even if app has bugs
- **Simplicity**: No need to add `WHERE user_id = auth.uid()` to every query
- **Admin Access**: Special policies allow admins to access all data
- **Database-Level**: Security enforced at database, not just app level

---

## Premium & Admin Status

### Status Tracking

User status is tracked in the `profiles` table:

```typescript
interface Profile {
  id: string;                    // User ID (matches auth.users.id)
  email: string;                 // User email
  is_admin: boolean;             // Admin flag
  is_premium: boolean;           // Premium flag
  premium_expires_at: string;    // Premium expiration date
  created_at: string;            // Account creation date
  updated_at: string;            // Last update date
}
```

### Checking Status

```typescript
const checkAdminAndPremiumStatus = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin, is_premium')
    .eq('id', userId)
    .single();
  
  return {
    isAdmin: data?.is_admin || false,
    isPremium: data?.is_premium || false,
  };
};
```

### Status in AuthContext

```typescript
const [isAdmin, setIsAdmin] = useState(false);
const [isPremium, setIsPremium] = useState(false);

// Status is checked on:
// 1. Initial app load
// 2. After sign in
// 3. When auth state changes

// Admins always have premium
setIsPremium(status.isPremium || status.isAdmin);
```

### Using Status in App

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAdmin, isPremium } = useAuth();
  
  if (isAdmin) {
    // Show admin features
  }
  
  if (isPremium) {
    // Show premium features
  } else {
    // Show premium upsell
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Email not confirmed"

**Problem**: User tries to sign in but hasn't verified email

**Solution**:
- Check email inbox (and spam folder)
- Resend verification email using `supabase.auth.resend()`
- Or disable email confirmation in Supabase dashboard (not recommended for production)

#### 2. Session not persisting

**Problem**: User logged out after closing app

**Solution**:
- Verify AsyncStorage is properly configured
- Check that `persistSession: true` in Supabase client
- Ensure AsyncStorage permissions are granted

#### 3. RLS policy blocking queries

**Problem**: Queries return empty results or permission errors

**Solution**:
- Check that user is authenticated (`auth.uid()` is not null)
- Verify RLS policies are correctly configured
- Check that `user_id` matches `auth.uid()` in queries
- For testing, temporarily disable RLS (not for production)

#### 4. Admin account not working

**Problem**: Admin login fails or doesn't have privileges

**Solution**:
- Verify admin credentials are correct
- Check `is_admin` flag in profiles table
- Ensure `is_admin_user()` function exists in database
- Check RLS policies include admin exceptions

#### 5. Token expired errors

**Problem**: "JWT expired" or similar errors

**Solution**:
- Ensure `autoRefreshToken: true` in Supabase client
- Check network connectivity
- Manually refresh token: `await supabase.auth.refreshSession()`

#### 6. Premium status not updating

**Problem**: Premium features not accessible after purchase

**Solution**:
- Check `is_premium` flag in profiles table
- Verify premium purchase was recorded
- Refresh user status: call `checkAdminAndPremiumStatus()`
- Check `premium_expires_at` date

### Debugging Tips

1. **Enable Console Logs**: Check console for authentication events
2. **Check Supabase Dashboard**: View auth logs and user data
3. **Test RLS Policies**: Use Supabase SQL editor with different user contexts
4. **Verify Network**: Ensure device can reach Supabase servers
5. **Clear Cache**: Clear AsyncStorage and restart app

### Useful Console Logs

The app includes extensive logging:

```typescript
console.log('AuthContext: Initializing...');
console.log('AuthContext: Initial session:', session ? 'Found' : 'None');
console.log('AuthContext: Auth state changed:', _event);
console.log('AuthContext: Signing in with email:', email);
console.log('AuthContext: Admin login detected');
console.log('AuthContext: User status - Admin:', isAdmin, 'Premium:', isPremium);
```

---

## Summary

### Key Takeaways

1. **Supabase Auth**: Handles all authentication with email/password
2. **AsyncStorage**: Persists sessions across app restarts
3. **Email Verification**: Required for new users (can be disabled)
4. **Admin Access**: Special account with elevated privileges
5. **RLS Policies**: Database-level security for all tables
6. **Premium Status**: Tracked in profiles table
7. **Auto-Refresh**: Tokens automatically refreshed
8. **Session Management**: Automatic session detection and updates

### Authentication Checklist

- ✅ Supabase client configured with AsyncStorage
- ✅ Email verification enabled
- ✅ Password reset functionality
- ✅ Admin account with special privileges
- ✅ RLS policies on all tables
- ✅ Premium status tracking
- ✅ Session persistence
- ✅ Auto token refresh
- ✅ Comprehensive error handling
- ✅ User profile creation on signup

### Next Steps

1. **Test Authentication**: Try signing up, signing in, and resetting password
2. **Verify RLS**: Ensure users can only access their own data
3. **Test Admin**: Verify admin account has full access
4. **Check Premium**: Test premium feature limits
5. **Monitor Logs**: Watch console for any authentication errors

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Native Authentication Best Practices](https://reactnative.dev/docs/security)

---

**Last Updated**: January 2025  
**App Version**: 1.0.0  
**Supabase Project**: ozomtozjuvgdvxhpotdv
