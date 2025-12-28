
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ImpressumScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();

  return (
    <View style={styles.container}>
      <SnowAnimation />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={28} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('imprint')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('legalImprintTitle')}</Text>
          
          <Text style={styles.sectionTitle}>{t('imprintAccordingToSwissLaw')}</Text>
          <Text style={styles.text}>
            Easy Budget{'\n'}
            Ivan Mirosnic{'\n'}
            Ahornstrasse{'\n'}
            8600 Dübendorf{'\n'}
            {language === 'de' ? 'Schweiz' : 'Switzerland'}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintContact')}</Text>
          <Text style={styles.text}>
            {t('imprintContactText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintDisclaimer')}</Text>
          <Text style={styles.text}>
            {t('imprintDisclaimerText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintLiabilityForLinks')}</Text>
          <Text style={styles.text}>
            {t('imprintLiabilityForLinksText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintCopyright')}</Text>
          <Text style={styles.text}>
            {t('imprintCopyrightText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintApplicableLaw')}</Text>
          <Text style={styles.text}>
            {t('imprintApplicableLawText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('imprintPaymentInfo')}</Text>
          <Text style={styles.text}>
            {t('imprintPaymentInfoText')}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    zIndex: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
});
