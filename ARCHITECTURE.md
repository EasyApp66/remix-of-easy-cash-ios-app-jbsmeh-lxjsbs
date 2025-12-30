
# Easy Budget App - Architecture Documentation

## 📁 Project Structure

```
easy-budget/
├── app/                          # Main application code
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── (home)/              # Home/Welcome screens
│   │   │   ├── index.tsx        # Welcome screen
│   │   │   ├── index.ios.tsx    # iOS-specific welcome
│   │   │   └── login.tsx        # Login/Signup screen
│   │   ├── budget.tsx           # Budget management screen
│   │   ├── abo.tsx              # Subscription tracking screen
│   │   ├── profile.tsx          # User profile screen
│   │   ├── profile.ios.tsx      # iOS-specific profile
│   │   └── legal/               # Legal documents
│   ├── _layout.tsx              # Root layout with providers
│   └── integrations/
│       └── supabase/            # Supabase integration
│           ├── client.ts        # Supabase client setup
│           └── types.ts         # Generated TypeScript types
├── components/                   # Reusable components
│   ├── IconSymbol.tsx           # Cross-platform icon component
│   ├── SnowAnimation.tsx        # Background animation
│   ├── FloatingTabBar.tsx       # Custom tab bar
│   └── PremiumModal.tsx         # Premium purchase modal
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state
│   ├── BudgetContext.tsx        # Budget data management
│   ├── SubscriptionContext.tsx  # Subscription data
│   ├── LanguageContext.tsx      # i18n support
│   └── LimitTrackingContext.tsx # Premium limit tracking
├── hooks/                        # Custom React hooks
│   └── usePremiumEnforcement.tsx # Premium feature enforcement
├── styles/                       # Styling
│   └── commonStyles.ts          # Shared styles and colors
└── lib/                         # Utilities
    └── supabase.ts              # Supabase client instance
```

## 🏗️ Architecture Patterns

### 1. Context-Based State Management
The app uses React Context API for global state management:

- **AuthContext**: Manages user authentication, session, admin status
- **BudgetContext**: Handles budget months and expenses with Supabase sync
- **SubscriptionContext**: Manages subscription data with Supabase sync
- **LanguageContext**: Handles i18n and language switching
- **LimitTrackingContext**: Tracks premium limit violations and rollbacks

### 2. Data Flow

```
User Action → Context → Supabase → Context Update → UI Re-render
                ↓
         Premium Check
                ↓
    Enforce Limits (if not premium/admin)
```

### 3. Premium Enforcement System

**Free Tier Limits:**
- 2 months maximum
- 6 expenses per month maximum
- 6 subscriptions maximum

**Enforcement Flow:**
1. User attempts action (add month/expense/subscription)
2. `usePremiumEnforcement` hook checks current counts
3. If limit would be exceeded:
   - Action is temporarily allowed
   - Last action is stored in `LimitTrackingContext`
   - User is redirected to premium purchase page
   - If user closes modal without purchasing, action is rolled back
4. Admins bypass all checks

### 4. Database Schema

```sql
-- User Profiles
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Budget Months
user_budgets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  month TEXT,
  total_amount NUMERIC,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Budget Expenses
user_expenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  budget_id UUID REFERENCES user_budgets(id),
  name TEXT,
  amount NUMERIC,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Subscriptions
user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  amount NUMERIC,
  billing_cycle TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Premium Purchases
premium_purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'eur',
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### 5. Row Level Security (RLS)

All tables have RLS enabled with two types of policies:

**User-Level Policies:**
- Users can only view/edit/delete their own data
- Enforced by checking `auth.uid() = user_id`

**Admin-Level Policies:**
- Admins can view/edit all data
- Enforced by checking `is_admin_user()` function

### 6. Authentication Flow

```
1. User enters email/password
2. Check if admin credentials → Create/login admin user
3. Otherwise → Regular Supabase auth
4. On success → Create/update profile with flags
5. AuthContext updates → UI re-renders
6. Navigate to budget screen
```

### 7. Data Synchronization

**Auto-Sync Strategy:**
- All context changes trigger a 1-second debounced sync to Supabase
- Prevents excessive database calls during rapid user actions
- Ensures data persistence without manual save buttons

**Sync Flow:**
```
User modifies data → Context state updates → 1s debounce → Supabase upsert
```

### 8. Platform-Specific Code

**iOS:**
- Uses native tabs (`expo-router/unstable-native-tabs`)
- Platform-specific files: `*.ios.tsx`

**Android:**
- Uses custom `FloatingTabBar` component
- Edge-to-edge display enabled
- Extra top padding for notch

**Web:**
- Falls back to standard components
- Metro bundler for web support

## 🎨 UI/UX Design Patterns

### 1. Glass Morphism
- Uses `expo-blur` for BlurView components
- Consistent dark theme with semi-transparent cards
- Border highlights for visual depth

### 2. Gesture Interactions
- **Long Press**: Opens context menu for items
- **Swipe Left**: Pin/unpin items (subscriptions)
- **Swipe Right**: Delete items (subscriptions)
- **Tap**: Select/edit items

### 3. Visual Feedback
- Pin indicator: Green border on pinned items
- Negative values: Red color for negative remaining balance
- Loading states: Activity indicators during async operations
- Modals: Overlay with blur for focus

## 🔐 Security Considerations

### 1. Authentication
- Email verification required for new accounts
- Passwords hashed by Supabase Auth
- Session tokens stored securely in AsyncStorage
- Admin credentials hardcoded (consider env vars for production)

### 2. Data Access
- RLS policies prevent unauthorized access
- All queries filtered by user_id
- Admin function checks profile table for elevated access

### 3. API Keys
- Supabase anon key is safe to expose (RLS protects data)
- No sensitive keys in client code

## 📊 Performance Optimizations

### 1. Debouncing
- 1-second debounce on all Supabase syncs
- Prevents excessive database calls

### 2. Memoization
- Sorted arrays computed once per render
- Context values memoized to prevent unnecessary re-renders

### 3. Lazy Loading
- Splash screen prevents premature rendering
- Auth state loaded before navigation

### 4. Cache Management
- `--clear` flag in npm scripts clears Metro cache
- Prevents stale code issues during development

## 🧪 Testing Strategy

### 1. Manual Testing Checklist
- [ ] Login/Signup flow
- [ ] Budget CRUD operations
- [ ] Subscription CRUD operations
- [ ] Premium enforcement
- [ ] Data persistence
- [ ] Language switching
- [ ] Admin privileges
- [ ] Gesture interactions

### 2. Database Testing
- [ ] RLS policies work correctly
- [ ] Admin function returns correct values
- [ ] Foreign key constraints enforced
- [ ] Data isolation between users

### 3. Edge Cases
- [ ] Network offline behavior
- [ ] Rapid action spam
- [ ] Concurrent edits
- [ ] Invalid input handling

## 🚀 Deployment Considerations

### 1. Environment Variables
Consider moving to env vars:
- Admin credentials
- Supabase URL and keys
- Feature flags

### 2. Build Configuration
- iOS: Bundle identifier `com.easybudget.app`
- Android: Package name `com.easybudget.app`
- Scheme: `easybudget`

### 3. App Store Requirements
- Privacy policy implemented
- Terms of service implemented
- Data usage disclosure
- In-app purchase setup (for premium)

## 📈 Future Enhancements

### Potential Features
1. **Data Export**: CSV/PDF export of budgets
2. **Recurring Expenses**: Auto-add monthly expenses
3. **Budget Templates**: Pre-made budget categories
4. **Charts & Analytics**: Visual spending insights
5. **Offline Mode**: Local-first with sync
6. **Family Sharing**: Shared budgets
7. **Notifications**: Reminders for subscriptions
8. **Dark/Light Theme Toggle**: User preference

### Technical Improvements
1. **Unit Tests**: Jest + React Testing Library
2. **E2E Tests**: Detox for mobile testing
3. **CI/CD**: Automated builds and deployments
4. **Error Tracking**: Sentry integration
5. **Analytics**: User behavior tracking
6. **Performance Monitoring**: React Native Performance
7. **Code Splitting**: Reduce initial bundle size

---

## 📚 Key Technologies

- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router (file-based)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Styling**: StyleSheet + expo-blur
- **Gestures**: react-native-gesture-handler
- **Storage**: AsyncStorage
- **i18n**: Custom implementation

## 🤝 Contributing Guidelines

1. Follow existing code structure
2. Use TypeScript for type safety
3. Add console.log statements for debugging
4. Update context providers for new features
5. Maintain RLS policies for new tables
6. Test on both iOS and Android
7. Document new features in this file

---

**Last Updated**: Launch Day
**Version**: 1.0.0
**Maintainer**: Development Team
