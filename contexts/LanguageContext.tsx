
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'de' | 'en';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
  };
}

const translations: Translations = {
  // Profile Screen
  logout: { de: 'Ausloggen', en: 'Logout' },
  login: { de: 'Einloggen', en: 'Login' },
  changeLanguage: { de: 'Sprache ändern', en: 'Change Language' },
  restorePremium: { de: 'Premium Wiederherstellen', en: 'Restore Premium' },
  buyPremium: { de: 'Premium Kaufen', en: 'Buy Premium' },
  agb: { de: 'AGB', en: 'Terms & Conditions' },
  terms: { de: 'Nutzungsbedingungen', en: 'Terms of Use' },
  privacy: { de: 'Datenschutzerklärung', en: 'Privacy Policy' },
  imprint: { de: 'Impressum', en: 'Imprint' },
  support: { de: 'Support', en: 'Support' },
  reportBug: { de: 'Bug Melden', en: 'Report Bug' },
  appVersion: { de: 'App Version', en: 'App Version' },
  guest: { de: 'Gast', en: 'Guest' },
  notLoggedIn: { de: 'Nicht angemeldet', en: 'Not logged in' },
  premium: { de: 'Premium', en: 'Premium' },
  yes: { de: 'Ja', en: 'Yes' },
  no: { de: 'Nein', en: 'No' },
  
  // Budget Screen
  accountBalance: { de: 'KONTOSTAND', en: 'ACCOUNT BALANCE' },
  total: { de: 'TOTAL', en: 'TOTAL' },
  remaining: { de: 'BLEIBT', en: 'REMAINING' },
  addNewBudget: { de: 'Neues Budget hinzufügen', en: 'Add New Budget' },
  name: { de: 'Name', en: 'Name' },
  amount: { de: 'Betrag', en: 'Amount' },
  cancel: { de: 'Abbrechen', en: 'Cancel' },
  add: { de: 'Hinzufügen', en: 'Add' },
  save: { de: 'Speichern', en: 'Save' },
  pin: { de: 'Fixieren', en: 'Pin' },
  unpin: { de: 'Fixierung aufheben', en: 'Unpin' },
  duplicate: { de: 'Duplizieren', en: 'Duplicate' },
  rename: { de: 'Namen anpassen', en: 'Rename' },
  editAmount: { de: 'Zahl anpassen', en: 'Edit Amount' },
  delete: { de: 'Löschen', en: 'Delete' },
  
  // Abo Screen
  abosCounter: { de: 'ABOS COUNTER', en: 'SUBSCRIPTIONS COUNTER' },
  addNewSubscription: { de: 'Neues Abo hinzufügen', en: 'Add New Subscription' },
  
  // Auth Screen
  email: { de: 'E-Mail', en: 'Email' },
  password: { de: 'Passwort', en: 'Password' },
  signIn: { de: 'Anmelden', en: 'Sign In' },
  signUp: { de: 'Registrieren', en: 'Sign Up' },
  forgotPassword: { de: 'Passwort vergessen?', en: 'Forgot Password?' },
  noAccount: { de: 'Noch kein Konto?', en: 'No account yet?' },
  haveAccount: { de: 'Bereits ein Konto?', en: 'Already have an account?' },
  resetPassword: { de: 'Passwort zurücksetzen', en: 'Reset Password' },
  sendResetLink: { de: 'Link senden', en: 'Send Reset Link' },
  
  // Premium Popup
  premiumTitle: { de: 'Premium Kaufen', en: 'Buy Premium' },
  premiumDescription: { de: 'Erhalten Sie unbegrenzte App-Funktionen:', en: 'Get unlimited app features:' },
  premiumFeature1: { de: '• Unbegrenzte Abo Counter', en: '• Unlimited Subscription Counter' },
  premiumFeature2: { de: '• Unbegrenzte Ausgabenliste', en: '• Unlimited Expense List' },
  premiumFeature3: { de: '• Unbegrenzte Monate', en: '• Unlimited Months' },
  oneTimePayment: { de: 'Einmalige Zahlung', en: 'One-Time Payment' },
  monthlySubscription: { de: 'Monatliches Abo', en: 'Monthly Subscription' },
  pay: { de: 'Bezahlen', en: 'Pay' },
  perMonth: { de: '/Monat', en: '/Month' },
  close: { de: 'Schließen', en: 'Close' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@easy_cash_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    // Load saved language preference
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'de' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
        console.log('Loaded language:', savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      console.log('Language set to:', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
