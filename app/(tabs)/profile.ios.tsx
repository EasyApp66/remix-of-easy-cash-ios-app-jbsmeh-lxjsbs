
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

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { setShouldRollback } = useLimitTracking();
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check if we should show premium modal on mount (when redirected from limit)
  useEffect(() => {
    if (params.showPremium === 'true') {
      setShowPremiumModal(true);
    }
  }, [params]);

  const handleClosePremiumModal = () => {
    console.log('Closing premium modal');
    
    // If this was triggered by a limit, trigger rollback
    if (params.showPremium === 'true') {
      console.log('Triggering rollback of last action');
      setShouldRollback(true);
    }
    
    setShowPremiumModal(false);
    
    // Navigate back to previous screen
    router.back();
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
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={80} 
              color={colors.green} 
            />
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
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>
              {t('premium')}: {isPremium ? t('yes') : t('no')}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable 
              key={item.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed
              ]}
              onPress={() => {
                console.log(`Menu item pressed: ${item.title}`);
                item.onPress();
              }}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol 
                  ios_icon_name={item.iosIcon} 
                  android_material_icon_name={item.icon} 
                  size={24} 
                  color={colors.text} 
                />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron-right" 
                size={20} 
                color={colors.textSecondary} 
              />
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
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menuSection: {
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    backgroundColor: colors.background,
  },
  menuItemPressed: {
    backgroundColor: colors.cardBackground,
    opacity: 0.8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
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
  },
});
