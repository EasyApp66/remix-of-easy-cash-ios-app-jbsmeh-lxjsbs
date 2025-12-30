
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedButton from "@/components/AnimatedButton";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const handleEmailLogin = () => {
    router.push('/(tabs)/(home)/login');
  };

  const handleTermsPress = () => {
    router.push('/(tabs)/legal/nutzungsbedingungen');
  };

  const handlePrivacyPress = () => {
    router.push('/(tabs)/legal/datenschutz');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Welcome Screen */}
        <View style={[styles.page, { width }]}>
          <View style={styles.welcomeContainer}>
            {/* Header Section - Takes up more space */}
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>
                {t('welcomeGreeting')}{'\n'}
                <Text style={styles.greenText}>EASY BUDGET</Text>
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
            </View>

            {/* Login Section - Positioned at bottom with more spacing */}
            <View style={styles.loginSection}>
              <AnimatedButton 
                style={[styles.loginButton, styles.emailButton]}
                onPress={handleEmailLogin}
              >
                <IconSymbol 
                  ios_icon_name="envelope.fill" 
                  android_material_icon_name="email" 
                  size={22} 
                  color={colors.background} 
                />
                <Text style={[styles.loginButtonText, { color: colors.background }]}>
                  {t('continueWithEmail')}
                </Text>
              </AnimatedButton>

              <AnimatedButton 
                style={[styles.loginButton, styles.appleButton]}
                onPress={() => console.log('Apple login not implemented yet')}
              >
                <IconSymbol 
                  ios_icon_name="apple.logo" 
                  android_material_icon_name="apple" 
                  size={22} 
                  color="#000000" 
                />
                <Text style={[styles.loginButtonText, styles.appleButtonText]}>
                  {t('continueWithApple')}
                </Text>
              </AnimatedButton>

              <Text style={styles.termsText}>
                {t('welcomeTermsText')}{'\n'}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  {t('terms')}
                </Text> {t('welcomeTermsAnd')} <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                  {t('privacy')}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Swipe indicator */}
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
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingBottom: 60,
    paddingHorizontal: 32,
    width: '100%',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'left',
    marginBottom: 48,
    alignSelf: 'flex-start',
    lineHeight: 44,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    alignSelf: 'flex-start',
  },
  welcomeSubtitle: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'left',
    lineHeight: 64,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  greenText: {
    color: colors.green,
  },
  loginSection: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  emailButton: {
    backgroundColor: colors.green,
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  appleButtonText: {
    color: '#000000',
  },
  termsText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: colors.green,
    fontWeight: '600',
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
