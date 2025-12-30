
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { signInWithApple } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAppleSignInLoading, setIsAppleSignInLoading] = useState(false);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const handleEmailLogin = () => {
    router.push('/(tabs)/(home)/login');
  };

  const handleAppleSignIn = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(
        'Nicht verfügbar',
        'Apple Sign In ist nur auf iOS-Geräten verfügbar.'
      );
      return;
    }

    setIsAppleSignInLoading(true);
    
    try {
      const { error } = await signInWithApple();
      
      if (error) {
        console.error('HomeScreen: Apple Sign In error:', error);
        Alert.alert(
          'Fehler',
          error.message || 'Bei der Anmeldung mit Apple ist ein Fehler aufgetreten.'
        );
      }
    } catch (error) {
      console.error('HomeScreen: Apple Sign In exception:', error);
      Alert.alert(
        'Fehler',
        'Bei der Anmeldung mit Apple ist ein unerwarteter Fehler aufgetreten.'
      );
    } finally {
      setIsAppleSignInLoading(false);
    }
  };

  const handleTermsPress = () => {
    router.push('/(tabs)/legal/nutzungsbedingungen');
  };

  const handlePrivacyPress = () => {
    router.push('/(tabs)/legal/datenschutz');
  };

  return (
    <View style={styles.container}>
      <SnowAnimation />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        <View style={[styles.page, { width }]}>
          <View style={styles.welcomeContainer}>
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>
                {t('welcomeGreeting')} <Text style={styles.greenText}>EASY BUDGET</Text>
              </Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.welcomeSubtitle}>
                  {t('welcomeTrackBudget')}{'\n'}
                  <Text style={styles.greenText}>BUDGET</Text>
                  {'\n\n'}
                  {t('welcomeAnd')}{'\n'}
                  <Text style={styles.greenText}>ABOS</Text>
                </Text>
              </View>
              <View style={styles.spacer} />
            </View>

            <View style={styles.loginSection}>
              <TouchableOpacity 
                style={[styles.loginButton, styles.emailButton]}
                onPress={handleEmailLogin}
              >
                <IconSymbol 
                  ios_icon_name="envelope.fill" 
                  android_material_icon_name="email" 
                  size={20} 
                  color={colors.background} 
                />
                <Text style={styles.emailButtonText}>{t('continueWithEmail')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginButton, styles.appleButton]}
                onPress={handleAppleSignIn}
                disabled={isAppleSignInLoading}
              >
                <IconSymbol 
                  ios_icon_name="apple.logo" 
                  android_material_icon_name="apple" 
                  size={20} 
                  color="#000000" 
                />
                <Text style={styles.appleButtonText}>
                  {isAppleSignInLoading ? 'Wird geladen...' : t('continueWithApple')}
                </Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                {t('welcomeTermsText')}{'\n'}
                <Text style={styles.termsLink} onPress={handleTermsPress}>{t('terms')}</Text> {t('welcomeTermsAnd')} <Text style={styles.termsLink} onPress={handlePrivacyPress}>{t('privacy')}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.page, { width }]}>
          <View style={styles.swipeIndicatorContainer}>
            <Text style={styles.swipeIndicatorText}>← Swipe to Budget Screen</Text>
            <Text style={styles.swipeHintText}>Or use the tab bar below</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 120,
    paddingHorizontal: 24,
    width: '100%',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  subtitleContainer: {
    alignSelf: 'flex-start',
  },
  welcomeSubtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'left',
    lineHeight: 56,
  },
  greenText: {
    color: colors.green,
  },
  spacer: {
    height: 20,
  },
  loginSection: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  emailButton: {
    backgroundColor: colors.green,
    marginBottom: 1,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: colors.green,
  },
  swipeIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  swipeIndicatorText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  swipeHintText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
