
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import * as MailComposer from 'expo-mail-composer';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleLogout = async () => {
    console.log('Handle logout/login');
    if (user) {
      await signOut();
      router.replace('/(tabs)/(home)');
    } else {
      router.push('/(tabs)/(home)/login');
    }
  };

  const handleRestorePremium = () => {
    console.log('Restore Premium');
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
          'Email nicht verfügbar',
          'Bitte richten Sie ein E-Mail-Konto auf Ihrem Gerät ein.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening mail composer:', error);
      Alert.alert(
        'Fehler',
        'E-Mail konnte nicht geöffnet werden.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBuyPremium = (type: 'onetime' | 'monthly') => {
    console.log('Buy Premium:', type);
    setShowPremiumModal(false);
    // TODO: Implement payment processing
    Alert.alert(
      'Zahlung',
      `${type === 'onetime' ? 'Einmalige Zahlung' : 'Monatliches Abo'} wird verarbeitet...`,
      [{ text: 'OK' }]
    );
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
      <Modal
        visible={showPremiumModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowPremiumModal(false)}
            >
              <IconSymbol 
                ios_icon_name="xmark.circle.fill" 
                android_material_icon_name="close" 
                size={28} 
                color={colors.textSecondary} 
              />
            </Pressable>

            {/* Title */}
            <View style={styles.modalHeader}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={48} 
                color={colors.green} 
              />
              <Text style={styles.modalTitle}>{t('premiumTitle')}</Text>
            </View>

            {/* Description */}
            <Text style={styles.modalDescription}>{t('premiumDescription')}</Text>

            {/* Features List */}
            <View style={styles.featuresList}>
              <Text style={styles.featureText}>{t('premiumFeature1')}</Text>
              <Text style={styles.featureText}>{t('premiumFeature2')}</Text>
              <Text style={styles.featureText}>{t('premiumFeature3')}</Text>
            </View>

            {/* Payment Options */}
            <View style={styles.paymentOptions}>
              {/* One-Time Payment */}
              <Pressable 
                style={({ pressed }) => [
                  styles.paymentButton,
                  pressed && styles.paymentButtonPressed
                ]}
                onPress={() => handleBuyPremium('onetime')}
              >
                <View style={styles.paymentButtonContent}>
                  <Text style={styles.paymentButtonTitle}>{t('oneTimePayment')}</Text>
                  <Text style={styles.paymentButtonPrice}>CHF 10.00</Text>
                </View>
                <View style={styles.payButton}>
                  <Text style={styles.payButtonText}>{t('pay')}</Text>
                </View>
              </Pressable>

              {/* OR Separator */}
              <View style={styles.orSeparatorContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>{t('or')}</Text>
                <View style={styles.orLine} />
              </View>

              {/* Monthly Subscription */}
              <Pressable 
                style={({ pressed }) => [
                  styles.paymentButton,
                  pressed && styles.paymentButtonPressed
                ]}
                onPress={() => handleBuyPremium('monthly')}
              >
                <View style={styles.paymentButtonContent}>
                  <Text style={styles.paymentButtonTitle}>{t('monthlySubscription')}</Text>
                  <Text style={styles.paymentButtonPrice}>CHF 1.00{t('perMonth')}</Text>
                </View>
                <View style={styles.payButton}>
                  <Text style={styles.payButtonText}>{t('pay')}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.green,
  },
  paymentButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  paymentButtonContent: {
    marginBottom: 12,
  },
  paymentButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentButtonPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.green,
  },
  payButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  orSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey,
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
});
