
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

export default function AGBScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>AGB</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Allgemeine Geschäftsbedingungen</Text>
          
          <Text style={styles.sectionTitle}>1. Geltungsbereich</Text>
          <Text style={styles.text}>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Easy Cash App. 
            Mit der Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.
          </Text>

          <Text style={styles.sectionTitle}>2. Leistungsbeschreibung</Text>
          <Text style={styles.text}>
            Easy Cash ist eine Budgetverwaltungs-App, die es Nutzern ermöglicht, ihre Ausgaben 
            und Abonnements zu verwalten und zu überwachen.
          </Text>

          <Text style={styles.sectionTitle}>3. Nutzerkonto</Text>
          <Text style={styles.text}>
            Für die vollständige Nutzung der App ist die Erstellung eines Nutzerkontos erforderlich. 
            Sie sind verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und 
            diese aktuell zu halten.
          </Text>

          <Text style={styles.sectionTitle}>4. Nutzungsrechte</Text>
          <Text style={styles.text}>
            Mit dem Download der App erhalten Sie ein nicht-exklusives, nicht übertragbares Recht 
            zur Nutzung der App für private Zwecke.
          </Text>

          <Text style={styles.sectionTitle}>5. Premium-Funktionen</Text>
          <Text style={styles.text}>
            Bestimmte Funktionen der App sind kostenpflichtig und erfordern den Abschluss eines 
            Premium-Abonnements. Die Preise und Laufzeiten werden in der App angezeigt.
          </Text>

          <Text style={styles.sectionTitle}>6. Haftung</Text>
          <Text style={styles.text}>
            Wir haften nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten 
            beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.
          </Text>

          <Text style={styles.sectionTitle}>7. Änderungen der AGB</Text>
          <Text style={styles.text}>
            Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche 
            Änderungen werden Sie rechtzeitig informiert.
          </Text>

          <Text style={styles.sectionTitle}>8. Schlussbestimmungen</Text>
          <Text style={styles.text}>
            Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen 
            dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
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
