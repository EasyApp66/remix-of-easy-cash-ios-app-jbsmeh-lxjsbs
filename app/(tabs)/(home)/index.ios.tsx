
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

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
      {/* Snow animation background */}
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
        {/* Welcome Screen */}
        <View style={[styles.page, { width }]}>
          <View style={styles.welcomeContainer}>
            <View style={[styles.headerSection, { marginBottom: 3 }]}>
              <Text style={styles.welcomeTitle}>
                {t('welcomeGreeting')} <Text style={styles.greenText}>EASY BUDGET</Text>
              </Text>
              <View style={styles.subtitleContainer}>
                <Text style={[styles.welcomeSubtitle, { fontSize: 48 }]}>
                  {t('welcomeTrackBudget')}{'\n'}
                  <Text style={styles.greenText}>BUDGET</Text>
                  {'\n\n'}
                  {t('welcomeAnd')}{'\n'}
                  <Text style={styles.greenText}>ABOS</Text>
                </Text>
              </View>
              {/* 20 pixel spacer after "und deine ABOs" */}
              <View style={{ height: 20 }} />
            </View>

            <View style={styles.loginSection}>
              <TouchableOpacity 
                style={[styles.loginButton, styles.emailButton, { backgroundColor: colors.green, marginBottom: 1 }]}
                onPress={handleEmailLogin}
              >
                <IconSymbol 
                  ios_icon_name="envelope.fill" 
                  android_material_icon_name="email" 
                  size={20} 
                  color={colors.background} 
                />
                <Text style={[styles.loginButtonText, { color: colors.background }]}>{t('continueWithEmail')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.loginButton, styles.appleButton]}>
                <IconSymbol 
                  ios_icon_name="apple.logo" 
                  android_material_icon_name="apple" 
                  size={20} 
                  color="#000000" 
                />
                <Text style={[styles.loginButtonText, styles.appleButtonText]}>{t('continueWithApple')}</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                {t('welcomeTermsText')}{'\n'}
                <Text style={styles.termsLink} onPress={handleTermsPress}>{t('terms')}</Text> {t('welcomeTermsAnd')} <Text style={styles.termsLink} onPress={handlePrivacyPress}>{t('privacy')}</Text>
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
  loginSection: {
    width: '100%',
    gap: 12,
    marginBottom: 0,
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
    backgroundColor: '#E57373',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  appleButtonText: {
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
