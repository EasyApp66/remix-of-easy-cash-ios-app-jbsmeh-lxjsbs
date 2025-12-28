
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [isPremium, setIsPremium] = useState(false);

  const toggleLanguage = () => {
    console.log('Toggle language');
    setLanguage(language === 'de' ? 'en' : 'de');
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

  const handleRestorePremium = () => {
    console.log('Restore Premium');
  };

  const menuItems = [
    {
      title: user ? 'Ausloggen' : 'Einloggen',
      icon: 'person',
      iosIcon: 'person.fill',
      onPress: handleLogout,
    },
    {
      title: `Sprache ändern: ${language === 'de' ? 'Deutsch' : 'English'}`,
      icon: 'language',
      iosIcon: 'globe',
      onPress: toggleLanguage,
    },
    {
      title: 'Premium Wiederherstellen',
      icon: 'restore',
      iosIcon: 'arrow.clockwise',
      onPress: handleRestorePremium,
    },
    {
      title: 'Premium Kaufen',
      icon: 'star',
      iosIcon: 'star.fill',
      onPress: () => console.log('Buy Premium'),
    },
    {
      title: 'AGB',
      icon: 'description',
      iosIcon: 'doc.text',
      onPress: () => {
        console.log('Navigate to AGB');
        router.push('/(tabs)/legal/agb');
      },
    },
    {
      title: 'Nutzungsbedingungen',
      icon: 'gavel',
      iosIcon: 'doc.text.fill',
      onPress: () => {
        console.log('Navigate to Nutzungsbedingungen');
        router.push('/(tabs)/legal/nutzungsbedingungen');
      },
    },
    {
      title: 'Datenschutzerklärung',
      icon: 'privacy-tip',
      iosIcon: 'lock.shield',
      onPress: () => {
        console.log('Navigate to Datenschutz');
        router.push('/(tabs)/legal/datenschutz');
      },
    },
    {
      title: 'Impressum',
      icon: 'info',
      iosIcon: 'info.circle',
      onPress: () => {
        console.log('Navigate to Impressum');
        router.push('/(tabs)/legal/impressum');
      },
    },
    {
      title: 'Support',
      icon: 'support-agent',
      iosIcon: 'questionmark.circle',
      onPress: () => console.log('Support'),
    },
    {
      title: 'Bug Melden',
      icon: 'bug-report',
      iosIcon: 'ant.fill',
      onPress: () => console.log('Report Bug'),
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
            <>
              <Text style={styles.userName}>
                {user.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.userName}>Gast</Text>
              <Text style={styles.userEmail}>Nicht angemeldet</Text>
            </>
          )}
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium: {isPremium ? 'Ja' : 'Nein'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
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
          <Text style={styles.versionText}>App Version 1.00.00</Text>
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
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 60 : 80,
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
