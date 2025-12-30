
# Easy Budget App - Test Scenarios

## 🧪 Comprehensive Testing Guide

### Pre-Test Setup
1. Clear app data/cache
2. Start fresh Expo dev server: `npm run dev`
3. Open app in Expo Go

---

## Test Scenario 1: First Launch Experience
**Goal**: Verify app loads correctly and welcome screen appears

### Steps:
1. Launch app in Expo Go
2. Wait for splash screen (should disappear within 1-2 seconds)
3. Verify welcome screen appears with:
   - "WILLKOMMEN BEI EASY BUDGET" text
   - Snow animation in background
   - "Mit E-Mail fortfahren" button (green)
   - "Mit Apple fortfahren" button (white)
   - Terms and privacy links at bottom

### Expected Result:
✅ App loads without errors
✅ Welcome screen displays correctly
✅ Snow animation is visible
✅ All buttons are clickable

### Failure Indicators:
❌ White screen
❌ Stuck on splash screen
❌ Missing UI elements
❌ Console errors

---

## Test Scenario 2: Admin Login
**Goal**: Verify admin authentication and privilege bypass

### Steps:
1. Tap "Mit E-Mail fortfahren"
2. Enter admin credentials:
   - Email: `mirosnic.ivan@icloud.com`
   - Password: `Gmh786cGFxqcmscQfofm#okp?QfEF5K4HM!pR3fo`
3. Tap "Anmelden"
4. Wait for navigation to budget screen

### Expected Result:
✅ Login successful
✅ Navigates to budget screen
✅ Default month "DEZEMBER" is visible
✅ Can add unlimited months (no premium modal)
✅ Can add unlimited expenses (no premium modal)

### Failure Indicators:
❌ Login error
❌ Stuck on login screen
❌ Premium modal appears for admin
❌ Database errors in console

---

## Test Scenario 3: Regular User Signup
**Goal**: Verify new user registration flow

### Steps:
1. Logout (if logged in)
2. Go to login screen
3. Tap "Noch kein Konto? Registrieren"
4. Enter test email: `test@example.com`
5. Enter password: `TestPassword123!`
6. Tap "Registrieren"
7. Check for email verification alert

### Expected Result:
✅ Account created successfully
✅ Alert shows: "Bitte bestätigen Sie Ihre E-Mail"
✅ Switched to login mode
✅ Can login after email verification

### Failure Indicators:
❌ Signup fails
❌ No email verification alert
❌ Database error
❌ Profile not created

---

## Test Scenario 4: Budget Management (Free User)
**Goal**: Test budget CRUD operations and free tier limits

### Steps:
1. Login as regular user (not admin)
2. Verify default month "DEZEMBER" exists
3. **Add Expense:**
   - Tap floating + button
   - Enter name: "MIETE"
   - Enter amount: "1000"
   - Tap "Hinzufügen"
4. **Add 5 more expenses** (total 6)
5. **Try to add 7th expense:**
   - Should show premium modal
   - Close modal
   - Verify 7th expense was rolled back
6. **Add Second Month:**
   - Tap + button next to month selector
   - Verify new month created
7. **Try to add 3rd month:**
   - Should show premium modal
   - Close modal
   - Verify 3rd month was rolled back

### Expected Result:
✅ Can add up to 6 expenses per month
✅ Can add up to 2 months
✅ Premium modal appears at limits
✅ Actions are rolled back when modal closed
✅ Data persists after app restart

### Failure Indicators:
❌ Can exceed limits without premium
❌ Premium modal doesn't appear
❌ Rollback doesn't work
❌ Data doesn't persist

---

## Test Scenario 5: Subscription Management
**Goal**: Test subscription CRUD and swipe gestures

### Steps:
1. Navigate to "ABO" tab
2. **Add Subscription:**
   - Tap floating + button
   - Enter name: "Netflix"
   - Enter amount: "15.99"
   - Tap "Hinzufügen"
3. **Swipe Gestures:**
   - Swipe subscription left → Should pin (green border)
   - Swipe subscription left again → Should unpin
   - Swipe subscription right → Should delete
4. **Add 6 subscriptions total**
5. **Try to add 7th:**
   - Should show premium modal
   - Close modal
   - Verify 7th subscription rolled back
6. **Long Press Menu:**
   - Long press on subscription
   - Verify menu appears with options:
     - Umbenennen
     - Betrag bearbeiten
     - Anheften/Lösen
     - Duplizieren
     - Löschen

### Expected Result:
✅ Can add up to 6 subscriptions
✅ Swipe left pins/unpins
✅ Swipe right deletes
✅ Long press menu works
✅ Premium modal at limit
✅ Rollback works

### Failure Indicators:
❌ Swipe gestures don't work
❌ Can exceed 6 subscriptions
❌ Menu doesn't appear
❌ Data doesn't persist

---

## Test Scenario 6: Data Persistence
**Goal**: Verify data syncs to Supabase and persists

### Steps:
1. Login as regular user
2. Add 2 months with expenses
3. Add 3 subscriptions
4. **Force close app** (swipe away)
5. **Reopen app**
6. Login again
7. Verify all data is still there

### Expected Result:
✅ All months preserved
✅ All expenses preserved
✅ All subscriptions preserved
✅ Pin states preserved
✅ Amounts correct

### Failure Indicators:
❌ Data lost after restart
❌ Incorrect amounts
❌ Missing items
❌ Pin states lost

---

## Test Scenario 7: Language Switching
**Goal**: Test internationalization

### Steps:
1. Navigate to "PROFIL" tab
2. Tap "Sprache ändern: Deutsch"
3. Verify UI switches to English
4. Tap "Change Language: English"
5. Verify UI switches back to German

### Expected Result:
✅ All text translates correctly
✅ No missing translations
✅ Language persists after restart
✅ Smooth transition

### Failure Indicators:
❌ Missing translations
❌ UI breaks
❌ Language doesn't persist

---

## Test Scenario 8: Premium Enforcement (Admin Bypass)
**Goal**: Verify admin users bypass all limits

### Steps:
1. Login as admin
2. Add 10 months (way over limit)
3. Add 20 expenses to one month
4. Navigate to ABO tab
5. Add 15 subscriptions

### Expected Result:
✅ No premium modals appear
✅ All actions succeed
✅ No rollbacks occur
✅ Console shows "Admin bypass" logs

### Failure Indicators:
❌ Premium modal appears for admin
❌ Actions are blocked
❌ Rollbacks occur

---

## Test Scenario 9: Edit Operations
**Goal**: Test editing existing items

### Steps:
1. **Edit Budget Balance:**
   - Tap on balance amount
   - Change to "5000"
   - Tap "Speichern"
   - Verify balance updated
2. **Edit Expense:**
   - Long press expense
   - Tap "Umbenennen"
   - Change name
   - Tap "Speichern"
   - Verify name updated
3. **Edit Subscription:**
   - Long press subscription
   - Tap "Betrag bearbeiten"
   - Change amount
   - Tap "Speichern"
   - Verify amount updated

### Expected Result:
✅ All edits save correctly
✅ UI updates immediately
✅ Data persists to database
✅ No errors in console

### Failure Indicators:
❌ Edits don't save
❌ UI doesn't update
❌ Database errors

---

## Test Scenario 10: Pin/Duplicate Operations
**Goal**: Test pin and duplicate functionality

### Steps:
1. **Pin Expense:**
   - Long press expense
   - Tap "Anheften"
   - Verify green border appears
   - Verify item moves to top
2. **Duplicate Expense:**
   - Long press expense
   - Tap "Duplizieren"
   - Verify copy created
3. **Pin Month:**
   - Long press month chip
   - Tap "Anheften"
   - Verify green border
4. **Duplicate Month:**
   - Long press month chip
   - Tap "Duplizieren"
   - Verify copy created with all expenses

### Expected Result:
✅ Pinned items show green border
✅ Pinned items sort to top
✅ Duplicates created correctly
✅ Duplicate has "(KOPIE)" suffix

### Failure Indicators:
❌ Pin doesn't work
❌ Duplicate fails
❌ Sorting incorrect

---

## Test Scenario 11: Delete Operations
**Goal**: Test deletion with confirmation

### Steps:
1. **Delete Expense:**
   - Tap X button on expense
   - Verify expense removed
2. **Delete Subscription:**
   - Swipe right on subscription
   - Verify subscription removed
3. **Delete Month:**
   - Tap X button on month chip
   - Verify month removed
4. **Try to delete last month:**
   - Should show error alert
   - Month should not be deleted

### Expected Result:
✅ Items delete correctly
✅ Cannot delete last month
✅ Alert shows for last month
✅ Data syncs to database

### Failure Indicators:
❌ Deletion fails
❌ Can delete last month
❌ No confirmation
❌ Data not synced

---

## Test Scenario 12: Profile Screen
**Goal**: Test profile features

### Steps:
1. Navigate to "PROFIL" tab
2. Verify user email displayed
3. Verify premium status shown
4. Test all menu items:
   - Ausloggen
   - Sprache ändern
   - Premium Kaufen (if not admin)
   - AGB
   - Nutzungsbedingungen
   - Datenschutzerklärung
   - Impressum
   - Support
   - Bug Melden
5. Verify app version shown

### Expected Result:
✅ All menu items work
✅ Legal pages load
✅ Logout works
✅ Premium status correct

### Failure Indicators:
❌ Menu items don't work
❌ Legal pages missing
❌ Logout fails

---

## Test Scenario 13: Network Error Handling
**Goal**: Test behavior with poor/no connection

### Steps:
1. Turn off WiFi/data
2. Try to login
3. Try to add expense
4. Turn connection back on
5. Verify data syncs

### Expected Result:
✅ Appropriate error messages
✅ App doesn't crash
✅ Data syncs when connection restored

### Failure Indicators:
❌ App crashes
❌ No error messages
❌ Data lost

---

## Test Scenario 14: Rapid Actions (Stress Test)
**Goal**: Test app stability under rapid user input

### Steps:
1. Rapidly tap add expense button 10 times
2. Rapidly swipe subscriptions
3. Rapidly switch between tabs
4. Rapidly add/delete items

### Expected Result:
✅ App remains responsive
✅ No crashes
✅ Debouncing prevents excessive DB calls
✅ UI updates correctly

### Failure Indicators:
❌ App crashes
❌ UI freezes
❌ Excessive DB calls
❌ Data corruption

---

## Test Scenario 15: Cross-Platform Testing
**Goal**: Verify app works on both iOS and Android

### iOS Specific:
1. Verify native tabs at bottom
2. Check SF Symbols icons
3. Test haptic feedback
4. Verify safe area handling

### Android Specific:
1. Verify FloatingTabBar
2. Check Material icons
3. Test edge-to-edge display
4. Verify notch padding

### Expected Result:
✅ Platform-specific UI renders correctly
✅ Icons display properly
✅ Navigation works on both
✅ No platform-specific crashes

### Failure Indicators:
❌ Wrong icons
❌ Layout issues
❌ Navigation broken
❌ Platform-specific crashes

---

## 🐛 Bug Reporting Template

If you find a bug, report it with this information:

```
**Bug Title**: [Short description]

**Platform**: iOS / Android / Web

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots/Logs**:
[Attach if available]

**User Type**: Admin / Regular User / Not Logged In

**App Version**: 1.0.0
```

---

## ✅ Final Checklist Before Launch

- [ ] All 15 test scenarios pass
- [ ] No console errors during normal use
- [ ] Data persists correctly
- [ ] Premium enforcement works
- [ ] Admin bypass works
- [ ] Both languages work
- [ ] iOS and Android tested
- [ ] Expo Go preview loads correctly
- [ ] Database queries successful
- [ ] RLS policies working
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive UI
- [ ] Error handling works
- [ ] Legal pages accessible

---

## 📊 Test Results Log

| Scenario | Status | Notes | Tester | Date |
|----------|--------|-------|--------|------|
| 1. First Launch | ⏳ | | | |
| 2. Admin Login | ⏳ | | | |
| 3. User Signup | ⏳ | | | |
| 4. Budget Management | ⏳ | | | |
| 5. Subscriptions | ⏳ | | | |
| 6. Data Persistence | ⏳ | | | |
| 7. Language Switch | ⏳ | | | |
| 8. Admin Bypass | ⏳ | | | |
| 9. Edit Operations | ⏳ | | | |
| 10. Pin/Duplicate | ⏳ | | | |
| 11. Delete Operations | ⏳ | | | |
| 12. Profile Screen | ⏳ | | | |
| 13. Network Errors | ⏳ | | | |
| 14. Rapid Actions | ⏳ | | | |
| 15. Cross-Platform | ⏳ | | | |

Legend: ⏳ Pending | ✅ Pass | ❌ Fail | ⚠️ Warning

---

**Happy Testing! 🚀**
