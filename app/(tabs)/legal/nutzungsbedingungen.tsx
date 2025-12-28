
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

export default function NutzungsbedingungenScreen() {
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
        <Text style={styles.headerTitle}>Nutzungsbedingungen</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Nutzungsbedingungen</Text>
          
          <Text style={styles.sectionTitle}>1. Akzeptanz der Bedingungen</Text>
          <Text style={styles.text}>
            Durch die Nutzung von Easy Cash akzeptieren Sie diese Nutzungsbedingungen in vollem Umfang. 
            Wenn Sie mit diesen Bedingungen nicht einverstanden sind, dürfen Sie die App nicht nutzen.
          </Text>

          <Text style={styles.sectionTitle}>2. Registrierung und Konto</Text>
          <Text style={styles.text}>
            - Sie müssen mindestens 16 Jahre alt sein, um ein Konto zu erstellen{'\n'}
            - Sie sind für die Geheimhaltung Ihrer Zugangsdaten verantwortlich{'\n'}
            - Sie dürfen nur ein Konto pro Person erstellen{'\n'}
            - Sie müssen korrekte und aktuelle Informationen angeben
          </Text>

          <Text style={styles.sectionTitle}>3. Erlaubte Nutzung</Text>
          <Text style={styles.text}>
            Sie dürfen die App ausschließlich für legale Zwecke nutzen. Folgende Handlungen sind untersagt:{'\n\n'}
            - Missbrauch der App für illegale Aktivitäten{'\n'}
            - Verbreitung von Malware oder schädlichem Code{'\n'}
            - Versuch, die Sicherheit der App zu kompromittieren{'\n'}
            - Automatisierte Zugriffe ohne ausdrückliche Genehmigung{'\n'}
            - Weitergabe Ihrer Zugangsdaten an Dritte
          </Text>

          <Text style={styles.sectionTitle}>4. Ihre Daten</Text>
          <Text style={styles.text}>
            Sie behalten alle Rechte an den Daten, die Sie in der App eingeben. Wir verwenden 
            Ihre Daten nur gemäß unserer Datenschutzerklärung.
          </Text>

          <Text style={styles.sectionTitle}>5. Premium-Abonnement</Text>
          <Text style={styles.text}>
            - Premium-Abonnements verlängern sich automatisch{'\n'}
            - Sie können Ihr Abonnement jederzeit kündigen{'\n'}
            - Bei Kündigung bleibt der Zugang bis zum Ende des bezahlten Zeitraums bestehen{'\n'}
            - Rückerstattungen erfolgen gemäß den Richtlinien des App Stores
          </Text>

          <Text style={styles.sectionTitle}>6. Verfügbarkeit</Text>
          <Text style={styles.text}>
            Wir bemühen uns um eine hohe Verfügbarkeit der App, können diese jedoch nicht garantieren. 
            Wartungsarbeiten können zu vorübergehenden Unterbrechungen führen.
          </Text>

          <Text style={styles.sectionTitle}>7. Änderungen der App</Text>
          <Text style={styles.text}>
            Wir behalten uns das Recht vor, die App jederzeit zu ändern, zu erweitern oder 
            Funktionen zu entfernen. Wesentliche Änderungen werden angekündigt.
          </Text>

          <Text style={styles.sectionTitle}>8. Beendigung</Text>
          <Text style={styles.text}>
            Wir können Ihr Konto bei Verstoß gegen diese Bedingungen ohne Vorankündigung sperren 
            oder löschen. Sie können Ihr Konto jederzeit selbst löschen.
          </Text>

          <Text style={styles.sectionTitle}>9. Haftungsausschluss</Text>
          <Text style={styles.text}>
            Die App wird &quot;wie besehen&quot; bereitgestellt. Wir übernehmen keine Garantie für 
            die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen.
          </Text>

          <Text style={styles.sectionTitle}>10. Kontakt</Text>
          <Text style={styles.text}>
            Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns bitte über die 
            Support-Funktion in der App.
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
