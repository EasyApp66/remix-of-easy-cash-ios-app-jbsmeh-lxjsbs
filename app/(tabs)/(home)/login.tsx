
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import SnowAnimation from '@/components/SnowAnimation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // For web/test version - bypass login
  const isWebOrTest = Platform.OS === 'web' || __DEV__;

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
        const { error } = await signIn(email, password);
        if (error) {
          Alert.alert(t('error'), error.message || t('loginFailed'));
        } else {
          router.replace('/(tabs)/budget');
        }
      }
    } catch (error: any) {
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

  const handleSkipLogin = () => {
    // For web/test version - skip to budget screen
    router.replace('/(tabs)/budget');
  };

  return (
    <View style={styles.container}>
      <SnowAnimation />

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? t('createAccount') : t('welcomeBack')}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? t('createAccountSubtitle') : t('signInSubtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>
                  {t('forgotPassword')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
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
            </TouchableOpacity>

            <TouchableOpacity
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
            </TouchableOpacity>

            {/* Web/Test Version Skip Button */}
            {isWebOrTest && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipLogin}
                disabled={loading}
              >
                <Text style={styles.skipButtonText}>
                  {t('skipTestVersion')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.green,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchModeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchModeLink: {
    color: colors.green,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
