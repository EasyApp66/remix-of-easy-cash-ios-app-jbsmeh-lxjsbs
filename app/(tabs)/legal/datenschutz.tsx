
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

export default function DatenschutzScreen() {
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
        <Text style={styles.headerTitle}>Datenschutz</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Datenschutzerklärung</Text>
          
          <Text style={styles.sectionTitle}>1. Verantwortlicher</Text>
          <Text style={styles.text}>
            Verantwortlich für die Datenverarbeitung im Rahmen dieser App ist der in den 
            Impressum-Angaben genannte Betreiber.
          </Text>

          <Text style={styles.sectionTitle}>2. Erhebung und Speicherung personenbezogener Daten</Text>
          <Text style={styles.text}>
            Wir erheben und verarbeiten folgende Daten:{'\n\n'}
            - E-Mail-Adresse (bei Registrierung){'\n'}
            - Nutzungsdaten (Budget-Einträge, Abonnements){'\n'}
            - Technische Daten (Gerätetyp, Betriebssystem, App-Version){'\n'}
            - Nutzungsstatistiken (anonymisiert)
          </Text>

          <Text style={styles.sectionTitle}>3. Zweck der Datenverarbeitung</Text>
          <Text style={styles.text}>
            Ihre Daten werden ausschließlich für folgende Zwecke verwendet:{'\n\n'}
            - Bereitstellung der App-Funktionen{'\n'}
            - Verwaltung Ihres Nutzerkontos{'\n'}
            - Verbesserung der App-Qualität{'\n'}
            - Technischer Support{'\n'}
            - Erfüllung rechtlicher Verpflichtungen
          </Text>

          <Text style={styles.sectionTitle}>4. Rechtsgrundlage</Text>
          <Text style={styles.text}>
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von:{'\n\n'}
            - Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung){'\n'}
            - Art. 6 Abs. 1 lit. a DSGVO (Einwilligung){'\n'}
            - Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)
          </Text>

          <Text style={styles.sectionTitle}>5. Datenspeicherung und -sicherheit</Text>
          <Text style={styles.text}>
            Ihre Daten werden auf sicheren Servern gespeichert und durch technische und 
            organisatorische Maßnahmen geschützt. Wir nutzen Verschlüsselung und moderne 
            Sicherheitsstandards.
          </Text>

          <Text style={styles.sectionTitle}>6. Weitergabe von Daten</Text>
          <Text style={styles.text}>
            Wir geben Ihre Daten nicht an Dritte weiter, außer:{'\n\n'}
            - Sie haben ausdrücklich eingewilligt{'\n'}
            - Es besteht eine gesetzliche Verpflichtung{'\n'}
            - Es ist zur Vertragserfüllung notwendig (z.B. Payment-Provider)
          </Text>

          <Text style={styles.sectionTitle}>7. Ihre Rechte</Text>
          <Text style={styles.text}>
            Sie haben folgende Rechte:{'\n\n'}
            - Auskunft über Ihre gespeicherten Daten{'\n'}
            - Berichtigung unrichtiger Daten{'\n'}
            - Löschung Ihrer Daten{'\n'}
            - Einschränkung der Verarbeitung{'\n'}
            - Datenübertragbarkeit{'\n'}
            - Widerspruch gegen die Verarbeitung{'\n'}
            - Beschwerde bei einer Aufsichtsbehörde
          </Text>

          <Text style={styles.sectionTitle}>8. Cookies und Tracking</Text>
          <Text style={styles.text}>
            Die App verwendet lokale Speicherung für technisch notwendige Funktionen. 
            Wir setzen keine Tracking-Cookies zu Werbezwecken ein.
          </Text>

          <Text style={styles.sectionTitle}>9. Dauer der Speicherung</Text>
          <Text style={styles.text}>
            Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. Nach Löschung des 
            Kontos werden Ihre Daten innerhalb von 30 Tagen vollständig gelöscht, sofern 
            keine gesetzlichen Aufbewahrungspflichten bestehen.
          </Text>

          <Text style={styles.sectionTitle}>10. Änderungen der Datenschutzerklärung</Text>
          <Text style={styles.text}>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte 
            Rechtslagen oder App-Funktionen anzupassen. Die aktuelle Version ist stets in der 
            App verfügbar.
          </Text>

          <Text style={styles.sectionTitle}>11. Kontakt</Text>
          <Text style={styles.text}>
            Bei Fragen zum Datenschutz kontaktieren Sie uns bitte über die Support-Funktion 
            in der App oder per E-Mail an die im Impressum angegebene Adresse.
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
