
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
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Easy Budget App. 
            Mit der Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.
            {'\n\n'}
            Diese AGB unterliegen dem Schweizer Recht, insbesondere dem Obligationenrecht (OR).
          </Text>

          <Text style={styles.sectionTitle}>2. Leistungsbeschreibung</Text>
          <Text style={styles.text}>
            Easy Budget ist eine Budgetverwaltungs-App, die es Nutzern ermöglicht, ihre Ausgaben 
            und Abonnements zu verwalten und zu überwachen.
          </Text>

          <Text style={styles.sectionTitle}>3. Nutzerkonto</Text>
          <Text style={styles.text}>
            Für die vollständige Nutzung der App ist die Erstellung eines Nutzerkontos erforderlich. 
            Sie sind verpflichtet, bei der Registrierung wahrheitsgemässe Angaben zu machen und 
            diese aktuell zu halten.
          </Text>

          <Text style={styles.sectionTitle}>4. Nutzungsrechte</Text>
          <Text style={styles.text}>
            Mit dem Download der App erhalten Sie ein nicht-exklusives, nicht übertragbares Recht 
            zur Nutzung der App für private Zwecke.
          </Text>

          <Text style={styles.sectionTitle}>5. Premium-Funktionen und Zahlungsmodalitäten</Text>
          <Text style={styles.text}>
            Bestimmte Funktionen der App sind kostenpflichtig und erfordern den Erwerb von 
            Premium-Zugang. Es stehen zwei Zahlungsoptionen zur Verfügung:{'\n\n'}
            <Text style={styles.boldText}>5.1 Einmalige Zahlung</Text>{'\n'}
            - Einmaliger Kaufpreis für unbegrenzten, lebenslangen Zugang zu allen Premium-Funktionen{'\n'}
            - Keine automatische Verlängerung{'\n'}
            - Keine wiederkehrenden Gebühren{'\n'}
            - Der Preis wird in der App in Schweizer Franken (CHF) angezeigt{'\n\n'}
            <Text style={styles.boldText}>5.2 Monatliches Abonnement</Text>{'\n'}
            - Monatliche Zahlung für Zugang zu allen Premium-Funktionen{'\n'}
            - Automatische Verlängerung am Ende jedes Abrechnungszeitraums{'\n'}
            - Der Preis wird in der App in Schweizer Franken (CHF) angezeigt{'\n'}
            - Kündigung jederzeit möglich mit Wirkung zum Ende des laufenden Abrechnungszeitraums{'\n\n'}
            <Text style={styles.boldText}>5.3 Zahlungsabwicklung</Text>{'\n'}
            Die Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, 
            Google Play Store). Es gelten deren Zahlungsbedingungen.{'\n\n'}
            <Text style={styles.boldText}>5.4 Rückerstattungen</Text>{'\n'}
            Rückerstattungen erfolgen gemäss den Richtlinien des jeweiligen App Stores und den 
            geltenden Schweizer Konsumentenschutzbestimmungen. Bitte wenden Sie sich für 
            Rückerstattungsanfragen direkt an den jeweiligen App Store.
          </Text>

          <Text style={styles.sectionTitle}>6. Haftung</Text>
          <Text style={styles.text}>
            Die Haftung richtet sich nach den Bestimmungen des Schweizer Obligationenrechts (OR). 
            Wir haften nur für Schäden, die auf vorsätzlichem oder grobfahrlässigem Verhalten beruhen. 
            Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich zulässig.
          </Text>

          <Text style={styles.sectionTitle}>7. Datenschutz</Text>
          <Text style={styles.text}>
            Die Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäss unserer Datenschutzerklärung 
            und den Bestimmungen des Schweizer Datenschutzgesetzes (DSG).
          </Text>

          <Text style={styles.sectionTitle}>8. Änderungen der AGB</Text>
          <Text style={styles.text}>
            Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche 
            Änderungen werden Sie rechtzeitig informiert. Die Fortsetzung der Nutzung nach 
            Bekanntgabe der Änderungen gilt als Zustimmung zu den geänderten AGB.
          </Text>

          <Text style={styles.sectionTitle}>9. Anwendbares Recht und Gerichtsstand</Text>
          <Text style={styles.text}>
            Es gilt ausschliesslich Schweizer Recht unter Ausschluss des UN-Kaufrechts. 
            Gerichtsstand für alle Streitigkeiten ist Zürich, Schweiz.
          </Text>

          <Text style={styles.sectionTitle}>10. Salvatorische Klausel</Text>
          <Text style={styles.text}>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die 
            Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung wird 
            durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen 
            Bestimmung am nächsten kommt.
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
  boldText: {
    fontWeight: '700',
    color: colors.text,
  },
});
