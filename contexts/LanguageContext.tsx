
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
  
  // Welcome Screen
  welcomeGreeting: { de: 'Hallo! Ich bin', en: 'Hello! I am' },
  welcomeTrackBudget: { de: 'Tracke dein', en: 'Track your' },
  welcomeAnd: { de: 'und deine', en: 'and your' },
  continueWithEmail: { de: 'Mit E-Mail fortfahren', en: 'Continue with Email' },
  continueWithApple: { de: 'Mit Apple fortfahren', en: 'Continue with Apple' },
  welcomeTermsText: { de: 'Indem du fortfährst, bestätigst du, dass du die', en: 'By continuing, you confirm that you have read the' },
  welcomeTermsAnd: { de: 'und die', en: 'and the' },
  
  // Budget Screen
  accountBalance: { de: 'KONTOSTAND', en: 'ACCOUNT BALANCE' },
  total: { de: 'TOTAL', en: 'TOTAL' },
  remaining: { de: 'BLEIBT', en: 'REMAINING' },
  addNewBudget: { de: 'Neues Budget hinzufügen', en: 'Add New Budget' },
  newExpense: { de: 'Neue Ausgabe', en: 'New Expense' },
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
  namePlaceholder: { de: 'Name (z.B. ESSEN)', en: 'Name (e.g. FOOD)' },
  amountPlaceholder: { de: 'Betrag', en: 'Amount' },
  adjustBalance: { de: 'Kontostand anpassen', en: 'Adjust Balance' },
  adjustLabel: { de: 'Bezeichnung anpassen', en: 'Adjust Label' },
  labelPlaceholder: { de: 'Bezeichnung', en: 'Label' },
  adjustMonthName: { de: 'Monatsnamen anpassen', en: 'Adjust Month Name' },
  errorMinimumMonth: { de: 'Du musst mindestens einen Monat haben.', en: 'You must have at least one month.' },
  errorTitle: { de: 'Fehler', en: 'Error' },
  
  // Abo Screen
  abosCounter: { de: 'ABOS ZÄHLER', en: 'SUBSCRIPTIONS COUNTER' },
  addNewSubscription: { de: 'Neues Abo hinzufügen', en: 'Add New Subscription' },
  subscriptionNamePlaceholder: { de: 'Name (z.B. Spotify)', en: 'Name (e.g. Spotify)' },
  subscriptionAmountPlaceholder: { de: 'Betrag pro Monat', en: 'Amount per month' },
  
  // Auth Screen / Login
  email: { de: 'E-Mail', en: 'Email' },
  password: { de: 'Passwort', en: 'Password' },
  signIn: { de: 'Anmelden', en: 'Sign In' },
  signUp: { de: 'Registrieren', en: 'Sign Up' },
  forgotPassword: { de: 'Passwort vergessen?', en: 'Forgot Password?' },
  noAccount: { de: 'Noch kein Konto?', en: 'No account yet?' },
  haveAccount: { de: 'Hast du bereits ein Konto?', en: 'Already have an account?' },
  resetPassword: { de: 'Passwort zurücksetzen', en: 'Reset Password' },
  sendResetLink: { de: 'Link senden', en: 'Send Reset Link' },
  createAccount: { de: 'Konto erstellen', en: 'Create Account' },
  welcomeBack: { de: 'Willkommen zurück', en: 'Welcome Back' },
  createAccountSubtitle: { de: 'Erstelle ein Konto, um deine Daten zu speichern', en: 'Create an account to save your data' },
  signInSubtitle: { de: 'Melde dich an, um fortzufahren', en: 'Sign in to continue' },
  emailPlaceholder: { de: 'deine@email.com', en: 'your@email.com' },
  passwordPlaceholder: { de: '••••••••', en: '••••••••' },
  skipTestVersion: { de: 'Überspringen (Test-Version)', en: 'Skip (Test Version)' },
  loginError: { de: 'Fehler', en: 'Error' },
  loginErrorMessage: { de: 'Bitte E-Mail und Passwort eingeben', en: 'Please enter email and password' },
  registrationError: { de: 'Registrierung fehlgeschlagen', en: 'Registration failed' },
  loginFailed: { de: 'Anmeldung fehlgeschlagen', en: 'Login failed' },
  registrationSuccess: { de: 'Erfolgreich registriert!', en: 'Successfully registered!' },
  verifyEmailMessage: { de: 'Bitte überprüfe deine E-Mail, um dein Konto zu bestätigen.', en: 'Please check your email to verify your account.' },
  emailRequired: { de: 'E-Mail erforderlich', en: 'Email required' },
  enterEmailAddress: { de: 'Bitte gib deine E-Mail-Adresse ein', en: 'Please enter your email address' },
  resetPasswordTitle: { de: 'Passwort zurücksetzen', en: 'Reset Password' },
  resetPasswordMessage: { de: 'Möchtest du einen Link zum Zurücksetzen des Passworts an diese E-Mail senden?', en: 'Do you want to send a password reset link to this email?' },
  send: { de: 'Senden', en: 'Send' },
  resetEmailError: { de: 'Fehler beim Senden der E-Mail', en: 'Error sending email' },
  resetEmailSuccess: { de: 'Überprüfe deine E-Mail für den Zurücksetzungslink', en: 'Check your email for the reset link' },
  success: { de: 'Erfolg', en: 'Success' },
  genericError: { de: 'Ein Fehler ist aufgetreten', en: 'An error occurred' },
  
  // Premium Popup
  premiumTitle: { de: 'Premium Kaufen', en: 'Buy Premium' },
  premiumDescription: { de: 'Erhalte unbegrenzte App-Funktionen:', en: 'Get unlimited app features:' },
  premiumFeature1: { de: '• Unbegrenzte Abo Counter', en: '• Unlimited Subscription Counter' },
  premiumFeature2: { de: '• Unbegrenzte Ausgabenliste', en: '• Unlimited Expense List' },
  premiumFeature3: { de: '• Unbegrenzte Monate', en: '• Unlimited Months' },
  oneTimePayment: { de: 'Einmalige Zahlung', en: 'One-Time Payment' },
  monthlySubscription: { de: 'Monatliches Abo', en: 'Monthly Subscription' },
  pay: { de: 'Bezahlen', en: 'Pay' },
  perMonth: { de: '/Monat', en: '/Month' },
  close: { de: 'Schließen', en: 'Close' },
  or: { de: 'ODER', en: 'OR' },
  premiumRequired: { de: 'Premium erforderlich', en: 'Premium Required' },
  premiumRequiredMessage: { de: 'Du hast das kostenlose Limit erreicht. Bitte upgrade auf Premium, um fortzufahren.', en: 'You have reached the free limit. Please upgrade to Premium to continue.' },
  limitReachedMessage: { de: 'Du hast die kostenlose Limite erreicht.', en: 'You have reached the free limit.' },
  
  // Legal Pages - Headers
  legalAgbTitle: { de: 'Allgemeine Geschäftsbedingungen', en: 'Terms and Conditions' },
  legalPrivacyTitle: { de: 'Datenschutzerklärung', en: 'Privacy Policy' },
  legalImprintTitle: { de: 'Impressum', en: 'Imprint' },
  legalTermsTitle: { de: 'Nutzungsbedingungen', en: 'Terms of Use' },
  
  // Legal Pages - Common
  legalBack: { de: 'Zurück', en: 'Back' },
  
  // Impressum Content
  imprintAccordingToSwissLaw: { de: 'Angaben gemäss Schweizer Recht', en: 'Information according to Swiss Law' },
  imprintContact: { de: 'Kontakt', en: 'Contact' },
  imprintContactText: { de: 'E-Mail: Über Support-Funktion in der App erreichbar', en: 'Email: Available via Support function in the app' },
  imprintDisclaimer: { de: 'Haftungsausschluss', en: 'Disclaimer' },
  imprintDisclaimerText: { 
    de: 'Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.\n\nHaftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.',
    en: 'The author assumes no liability for the correctness, accuracy, timeliness, reliability and completeness of the information.\n\nLiability claims against the author for material or immaterial damages arising from access to or use or non-use of the published information, misuse of the connection or technical faults are excluded.'
  },
  imprintLiabilityForLinks: { de: 'Haftung für Links', en: 'Liability for Links' },
  imprintLiabilityForLinksText: {
    de: 'Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.',
    en: 'References and links to third-party websites are outside our area of responsibility. Any responsibility for such websites is disclaimed. Access to and use of such websites is at the user\'s own risk.'
  },
  imprintCopyright: { de: 'Urheberrechte', en: 'Copyright' },
  imprintCopyrightText: {
    de: 'Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser App gehören ausschliesslich Ivan Mirosnic oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.',
    en: 'The copyright and all other rights to content, images, photos or other files in this app belong exclusively to Ivan Mirosnic or the specifically named rights holders. Written consent of the copyright holders must be obtained in advance for the reproduction of any elements.'
  },
  imprintApplicableLaw: { de: 'Anwendbares Recht', en: 'Applicable Law' },
  imprintApplicableLawText: {
    de: 'Auf diese App und deren Nutzung ist ausschliesslich Schweizer Recht anwendbar. Gerichtsstand ist Zürich, Schweiz.',
    en: 'Swiss law applies exclusively to this app and its use. Place of jurisdiction is Zurich, Switzerland.'
  },
  imprintPaymentInfo: { de: 'Zahlungsinformationen', en: 'Payment Information' },
  imprintPaymentInfoText: {
    de: 'Diese App bietet kostenpflichtige Premium-Funktionen an. Es stehen folgende Zahlungsoptionen zur Verfügung:\n\n- Einmalige Zahlung für lebenslangen Zugang\n- Monatliches Abonnement mit automatischer Verlängerung\n\nDie Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, Google Play Store). Es gelten deren Zahlungs- und Rückerstattungsbedingungen.',
    en: 'This app offers paid premium features. The following payment options are available:\n\n- One-time payment for lifetime access\n- Monthly subscription with automatic renewal\n\nPayment processing is handled by the respective app store providers (Apple App Store, Google Play Store). Their payment and refund terms apply.'
  },
  
  // Email alerts
  emailNotAvailable: { de: 'Email nicht verfügbar', en: 'Email not available' },
  emailNotAvailableMessage: { de: 'Bitte richte ein E-Mail-Konto auf deinem Gerät ein.', en: 'Please set up an email account on your device.' },
  error: { de: 'Fehler', en: 'Error' },
  emailCouldNotOpen: { de: 'E-Mail konnte nicht geöffnet werden.', en: 'Email could not be opened.' },
  ok: { de: 'OK', en: 'OK' },
  payment: { de: 'Zahlung', en: 'Payment' },
  paymentProcessing: { de: 'wird verarbeitet...', en: 'is being processed...' },
  oneTimePaymentText: { de: 'Einmalige Zahlung', en: 'One-Time Payment' },
  monthlySubscriptionText: { de: 'Monatliches Abo', en: 'Monthly Subscription' },
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
