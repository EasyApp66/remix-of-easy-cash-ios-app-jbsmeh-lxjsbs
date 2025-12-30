
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useLanguage } from "@/contexts/LanguageContext";

interface LegalSection {
  title: string;
  text: string;
}

interface LegalContent {
  title: string;
  sections: LegalSection[];
}

interface LegalPageProps {
  headerTitle: string;
  content: {
    de: LegalContent;
    en: LegalContent;
  };
}

export default function LegalPage({ headerTitle, content }: LegalPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  
  const currentContent = content[language as 'de' | 'en'] || content.de;

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{currentContent.title}</Text>
          
          {currentContent.sections.map((section, index) => (
            <React.Fragment key={index}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.text}>{section.text}</Text>
            </React.Fragment>
          ))}
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
