
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert, Modal, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { PremiumModal } from "@/components/PremiumModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import * as MailComposer from 'expo-mail-composer';
import { BlurView } from 'expo-blur';
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, signOut, isAdmin, isPremium } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');

  // Load user name from Supabase
  useEffect(() => {
    const loadUserName = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading user name:', error);
          } else if (data?.name) {
            setUserName(data.name);
          }
        } catch (error) {
          console.error('Error loading user name:', error);
        }
      }
    };

    loadUserName();
  }, [user]);

  // Check if we should show premium modal on mount (when redirected from limit)
  useEffect(() => {
    if (params.showPremium === 'true') {
      console.log('Showing premium modal');
      setShowPremiumModal(true);
    }
  }, [params]);

  const handleClosePremiumModal = () => {
    console.log('Closing premium modal');
    setShowPremiumModal(false);
    
    // Navigate back to budget screen
    router.replace('/(tabs)/budget');
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

  const handleOpenNameModal = () => {
    setTempName(userName);
    setShowNameModal(true);
  };

  const handleSaveName = async () => {
    if (!user) {
      console.log('No user logged in');
      setShowNameModal(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: tempName || null })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving name:', error);
        Alert.alert(t('error'), 'Fehler beim Speichern des Namens');
      } else {
        setUserName(tempName);
        console.log('Name saved successfully:', tempName);
      }
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert(t('error'), 'Fehler beim Speichern des Namens');
    }

    setShowNameModal(false);
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
      hidden: isAdmin, // Hide for admins
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
  ].filter(item => !item.hidden);

  return (
    <View style={styles.container}>
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
            
            {/* Clickable Name Field */}
            <TouchableOpacity onPress={handleOpenNameModal} activeOpacity={0.7}>
              <Text style={styles.userName}>
                {userName || 'Namen eingeben'}
              </Text>
            </TouchableOpacity>
            
            {/* Admin Badge */}
            {isAdmin && (
              <View style={styles.adminBadgeWrapper}>
                <BlurView intensity={40} tint="light" style={styles.adminBadge}>
                  <IconSymbol 
                    ios_icon_name="crown.fill" 
                    android_material_icon_name="workspace-premium" 
                    size={20} 
                    color="#FFD700" 
                  />
                  <Text style={styles.adminText}>ADMIN</Text>
                </BlurView>
              </View>
            )}
            
            {/* Premium Badge */}
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

        {/* Email Display Section */}
        {user && (
          <View style={styles.emailSectionWrapper}>
            <BlurView intensity={20} tint="dark" style={styles.emailSection}>
              <View style={styles.emailRow}>
                <IconSymbol 
                  ios_icon_name="envelope.fill" 
                  android_material_icon_name="email" 
                  size={20} 
                  color={colors.green} 
                />
                <Text style={styles.emailText}>{user.email}</Text>
              </View>
            </BlurView>
          </View>
        )}

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>{t('appVersion')} 1.00.00</Text>
        </View>
      </ScrollView>

      {/* Name Input Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Namen eingeben</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Dein Name"
              placeholderTextColor={colors.textSecondary}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNameModal(false)}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveName}
              >
                <Text style={styles.saveButtonText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Premium Purchase Modal - Only show for non-admins */}
      {!isAdmin && (
        <PremiumModal 
          visible={showPremiumModal}
          onClose={handleClosePremiumModal}
          showLimitMessage={params.showPremium === 'true'}
        />
      )}
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
    paddingTop: Platform.OS === 'android' ? 60 : 80,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  adminBadgeWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.4)',
    elevation: 6,
    marginBottom: 12,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  adminText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
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
  emailSectionWrapper: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emailSection: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emailText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.grey,
  },
  saveButton: {
    backgroundColor: colors.green,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
