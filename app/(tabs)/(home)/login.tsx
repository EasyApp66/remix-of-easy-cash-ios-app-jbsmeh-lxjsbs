
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedButton from '@/components/AnimatedButton';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(t('loginError'), t('loginErrorMessage'));
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          console.error('Sign up error:', error);
          Alert.alert(t('error'), error.message || t('registrationError'));
        } else {
          Alert.alert(
            t('registrationSuccess'),
            t('verifyEmailMessage'),
            [
              {
                text: t('ok'),
                onPress: () => {
                  setIsSignUp(false);
                  setPassword('');
                },
              },
            ]
          );
        }
      } else {
        // Sign in (handles both admin and regular users)
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          
          // Check if this is an admin account that needs registration
          if (error.needsRegistration) {
            Alert.alert(
              'Admin-Konto erstellen',
              'Das Admin-Konto existiert noch nicht. Möchten Sie es jetzt erstellen?',
              [
                {
                  text: 'Abbrechen',
                  style: 'cancel',
                },
                {
                  text: 'Registrieren',
                  onPress: () => {
                    setIsSignUp(true);
                  },
                },
              ]
            );
          } else {
            // Show user-friendly error message
            let errorMessage = error.message || t('loginFailed');
            
            // Translate common error messages to German
            if (errorMessage.includes('Invalid login credentials')) {
              errorMessage = 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.';
            } else if (errorMessage.includes('Email not confirmed')) {
              errorMessage = 'E-Mail noch nicht bestätigt. Bitte überprüfen Sie Ihr E-Mail-Postfach.';
            }
            
            Alert.alert('Fehler', errorMessage);
          }
        } else {
          // Login successful - navigate to budget screen
          console.log('Login successful, navigating to budget screen');
          // Use replace to prevent going back to login screen
          router.replace('/(tabs)/budget');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(t('error'), error.message || t('genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(t('emailRequired'), t('enterEmailAddress'));
      return;
    }

    Alert.alert(
      t('resetPasswordTitle'),
      t('resetPasswordMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('send'),
          onPress: async () => {
            setLoading(true);
            const { error } = await resetPassword(email);
            setLoading(false);
            if (error) {
              Alert.alert(t('error'), error.message || t('resetEmailError'));
            } else {
              Alert.alert(t('success'), t('resetEmailSuccess'));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInUp.duration(400).delay(100)}>
            <AnimatedButton
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={24}
                color={colors.text}
              />
            </AnimatedButton>
          </Animated.View>

          {/* Header */}
          <Animated.View 
            style={styles.header}
            entering={FadeInDown.duration(500).delay(200)}
          >
            <Text style={styles.title}>
              {isSignUp ? t('createAccount') : t('welcomeBack')}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? t('createAccountSubtitle') : t('signInSubtitle')}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            style={styles.form}
            entering={FadeIn.duration(600).delay(300)}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('emailPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('password')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('passwordPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isSignUp ? 'password-new' : 'password'}
                editable={!loading}
              />
            </View>

            {!isSignUp && (
              <AnimatedButton
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>
                  {t('forgotPassword')}
                </Text>
              </AnimatedButton>
            )}

            <AnimatedButton
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? t('signUp') : t('signIn')}
                </Text>
              )}
            </AnimatedButton>

            <AnimatedButton
              style={styles.switchMode}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
              }}
              disabled={loading}
            >
              <Text style={styles.switchModeText}>
                {isSignUp ? t('haveAccount') : t('noAccount')}{' '}
                <Text style={styles.switchModeLink}>
                  {isSignUp ? t('signIn') : t('signUp')}
                </Text>
              </Text>
            </AnimatedButton>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.grey,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: colors.green,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(160, 255, 107, 0.3)',
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.background,
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchModeText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  switchModeLink: {
    color: colors.green,
    fontWeight: '700',
  },
});
