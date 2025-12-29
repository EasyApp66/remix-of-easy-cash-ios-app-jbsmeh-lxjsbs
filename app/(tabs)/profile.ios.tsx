
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { PremiumModal } from "@/components/PremiumModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLimitTracking } from "@/contexts/LimitTrackingContext";
import * as MailComposer from 'expo-mail-composer';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { setShouldRollback, previousRoute, setPreviousRoute } = useLimitTracking();
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check if we should show premium modal on mount (when redirected from limit)
  useEffect(() => {
    if (params.showPremium === 'true') {
      console.log('Showing premium modal, previous route:', previousRoute);
      setShowPremiumModal(true);
    }
  }, [params]);

  const handleClosePremiumModal = () => {
    console.log('Closing premium modal, previous route:', previousRoute);
    
    // If this was triggered by a limit, trigger rollback
    if (params.showPremium === 'true') {
      console.log('Triggering rollback of last action');
      setShouldRollback(true);
    }
    
    setShowPremiumModal(false);
    
    // Navigate back to the previous screen using replace
    if (previousRoute) {
      console.log('Navigating back to:', previousRoute);
      router.replace(previousRoute);
      setPreviousRoute(null); // Clear the stored route
    } else {
      // Fallback to budget screen if no previous route is stored
      console.log('No previous route stored, navigating to budget');
      router.replace('/(tabs)/budget');
    }
  };

  const handleLogout = async () => {
    console.log('Handle logout/login');
    if (user) {
      await signOut();
      router.replace('/(tabs)/(home)');
    } else {
      router.push('/(tabs)/(home)/login');
    }
  };

  const handleRestorePremium = async () => {
    console.log('Restore Premium - Navigating to Welcome Screen');
    // Sign out the user first
    if (user) {
      await signOut();
    }
    // Navigate to welcome screen for re-login
    router.replace('/(tabs)/(home)');
  };

  const handleSendEmail = async (subject: string) => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      console.log('Mail composer available:', isAvailable);
      
      if (isAvailable) {
        const result = await MailComposer.composeAsync({
          recipients: ['ivanmirosnic006@gmail.com'],
          subject: subject,
        });
        console.log('Mail composer result:', result);
      } else {
        Alert.alert(
          t('emailNotAvailable'),
          t('emailNotAvailableMessage'),
          [{ text: t('ok') }]
        );
      }
    } catch (error) {
      console.error('Error opening mail composer:', error);
      Alert.alert(
        t('error'),
        t('emailCouldNotOpen'),
        [{ text: t('ok') }]
      );
    }
  };

  const menuItems = [
    {
      id: 'auth',
      title: user ? t('logout') : t('login'),
      icon: 'person',
      iosIcon: 'person.fill',
      onPress: handleLogout,
    },
    {
      id: 'language',
      title: `${t('changeLanguage')}: ${language === 'de' ? 'Deutsch' : 'English'}`,
      icon: 'language',
      iosIcon: 'globe',
      onPress: toggleLanguage,
    },
    {
      id: 'restore',
      title: t('restorePremium'),
      icon: 'restore',
      iosIcon: 'arrow.clockwise',
      onPress: handleRestorePremium,
    },
    {
      id: 'buy',
      title: t('buyPremium'),
      icon: 'star',
      iosIcon: 'star.fill',
      onPress: () => setShowPremiumModal(true),
    },
    {
      id: 'agb',
      title: t('agb'),
      icon: 'description',
      iosIcon: 'doc.text',
      onPress: () => {
        console.log('Navigate to AGB');
        router.push('/(tabs)/legal/agb');
      },
    },
    {
      id: 'terms',
      title: t('terms'),
      icon: 'gavel',
      iosIcon: 'doc.text.fill',
      onPress: () => {
        console.log('Navigate to Nutzungsbedingungen');
        router.push('/(tabs)/legal/nutzungsbedingungen');
      },
    },
    {
      id: 'privacy',
      title: t('privacy'),
      icon: 'privacy-tip',
      iosIcon: 'lock.shield',
      onPress: () => {
        console.log('Navigate to Datenschutz');
        router.push('/(tabs)/legal/datenschutz');
      },
    },
    {
      id: 'imprint',
      title: t('imprint'),
      icon: 'info',
      iosIcon: 'info.circle',
      onPress: () => {
        console.log('Navigate to Impressum');
        router.push('/(tabs)/legal/impressum');
      },
    },
    {
      id: 'support',
      title: t('support'),
      icon: 'support-agent',
      iosIcon: 'questionmark.circle',
      onPress: () => handleSendEmail('Support Anfrage - Easy Cash App'),
    },
    {
      id: 'bug',
      title: t('reportBug'),
      icon: 'bug-report',
      iosIcon: 'ant.fill',
      onPress: () => handleSendEmail('Bug Report - Easy Cash App'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Snow animation background */}
      <SnowAnimation />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section - Glass Effect */}
        <View style={styles.userSectionWrapper}>
          <BlurView intensity={30} tint="dark" style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow}>
                <IconSymbol 
                  ios_icon_name="person.circle.fill" 
                  android_material_icon_name="account-circle" 
                  size={100} 
                  color={colors.green} 
                />
              </View>
            </View>
            {user ? (
              <React.Fragment>
                <Text style={styles.userName}>
                  {user.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text style={styles.userName}>{t('guest')}</Text>
                <Text style={styles.userEmail}>{t('notLoggedIn')}</Text>
              </React.Fragment>
            )}
            <View style={styles.premiumBadgeWrapper}>
              <BlurView 
                intensity={isPremium ? 40 : 20} 
                tint={isPremium ? "light" : "dark"} 
                style={styles.premiumBadge}
              >
                <Text style={[styles.premiumText, isPremium && styles.premiumTextActive]}>
                  {t('premium')}: {isPremium ? t('yes') : t('no')}
                </Text>
              </BlurView>
            </View>
          </BlurView>
        </View>

        {/* Menu Items - Glass Effect */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable 
              key={item.id}
              style={({ pressed }) => [
                styles.menuItemWrapper,
                pressed && styles.menuItemPressed
              ]}
              onPress={() => {
                console.log(`Menu item pressed: ${item.title}`);
                item.onPress();
              }}
            >
              <BlurView intensity={20} tint="dark" style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <IconSymbol 
                      ios_icon_name={item.iosIcon} 
                      android_material_icon_name={item.icon} 
                      size={24} 
                      color={colors.green} 
                    />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron-right" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </BlurView>
            </Pressable>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>{t('appVersion')} 1.00.00</Text>
        </View>
      </ScrollView>

      {/* Premium Purchase Modal */}
      <PremiumModal 
        visible={showPremiumModal}
        onClose={handleClosePremiumModal}
        showLimitMessage={params.showPremium === 'true'}
      />
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
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  userSectionWrapper: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 8px 32px rgba(160, 255, 107, 0.2)',
    elevation: 12,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarGlow: {
    borderRadius: 50,
    boxShadow: '0px 0px 30px rgba(160, 255, 107, 0.3)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  premiumBadgeWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  premiumBadge: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
  },
  premiumText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  premiumTextActive: {
    color: colors.green,
  },
  menuSection: {
    gap: 12,
    marginBottom: 24,
  },
  menuItemWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(160, 255, 107, 0.1)',
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(160, 255, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
