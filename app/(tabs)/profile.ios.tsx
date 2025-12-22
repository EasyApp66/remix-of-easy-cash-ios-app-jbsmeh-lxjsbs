
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [budgetView, setBudgetView] = useState<'cards' | 'list'>('cards');
  const [isPremium, setIsPremium] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  const toggleBudgetView = () => {
    setBudgetView(budgetView === 'cards' ? 'list' : 'cards');
  };

  const menuItems = [
    {
      title: isLoggedIn ? 'Ausloggen' : 'Einloggen',
      icon: 'person',
      iosIcon: 'person.fill',
      onPress: () => setIsLoggedIn(!isLoggedIn),
    },
    {
      title: `Sprache ändern: ${language === 'de' ? 'Deutsch' : 'English'}`,
      icon: 'language',
      iosIcon: 'globe',
      onPress: toggleLanguage,
    },
    {
      title: `Budget Ansicht: ${budgetView === 'cards' ? '2-Spalten-Karten' : 'Breite Rechtecke'}`,
      icon: 'view-module',
      iosIcon: 'square.grid.2x2',
      onPress: toggleBudgetView,
    },
    {
      title: 'Premium Wiederherstellen',
      icon: 'restore',
      iosIcon: 'arrow.clockwise',
      onPress: () => console.log('Restore Premium'),
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
      onPress: () => console.log('AGB'),
    },
    {
      title: 'Nutzungsbedingungen',
      icon: 'gavel',
      iosIcon: 'doc.text.fill',
      onPress: () => console.log('Terms'),
    },
    {
      title: 'Datenschutzerklärung',
      icon: 'privacy-tip',
      iosIcon: 'lock.shield',
      onPress: () => console.log('Privacy'),
    },
    {
      title: 'Impressum',
      icon: 'info',
      iosIcon: 'info.circle',
      onPress: () => console.log('Impressum'),
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
          <Text style={styles.userName}>Max Mustermann</Text>
          <Text style={styles.userEmail}>max.mustermann@email.com</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium: {isPremium ? 'Ja' : 'Nein'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress}
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
            </TouchableOpacity>
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
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
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
