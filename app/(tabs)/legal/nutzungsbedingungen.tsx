
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NutzungsbedingungenScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const content = language === 'de' ? {
    title: 'Nutzungsbedingungen',
    sections: [
      {
        title: '1. Akzeptanz der Bedingungen',
        text: 'Durch die Nutzung von Easy Budget akzeptierst du diese Nutzungsbedingungen in vollem Umfang. Wenn du mit diesen Bedingungen nicht einverstanden bist, darfst du die App nicht nutzen.\n\nDiese Bedingungen unterliegen dem Schweizer Recht.'
      },
      {
        title: '2. Registrierung und Konto',
        text: '- Du musst mindestens 16 Jahre alt sein, um ein Konto zu erstellen\n- Du bist für die Geheimhaltung deiner Zugangsdaten verantwortlich\n- Du darfst nur ein Konto pro Person erstellen\n- Du musst korrekte und aktuelle Informationen angeben'
      },
      {
        title: '3. Erlaubte Nutzung',
        text: 'Du darfst die App ausschliesslich für legale Zwecke nutzen. Folgende Handlungen sind untersagt:\n\n- Missbrauch der App für illegale Aktivitäten\n- Verbreitung von Malware oder schädlichem Code\n- Versuch, die Sicherheit der App zu kompromittieren\n- Automatisierte Zugriffe ohne ausdrückliche Genehmigung\n- Weitergabe deiner Zugangsdaten an Dritte'
      },
      {
        title: '4. Deine Daten',
        text: 'Du behältst alle Rechte an den Daten, die du in der App eingibst. Wir verwenden deine Daten nur gemäss unserer Datenschutzerklärung und den geltenden Schweizer Datenschutzbestimmungen.'
      },
      {
        title: '5. Premium-Funktionen und Zahlungen',
        text: 'Die App bietet kostenpflichtige Premium-Funktionen an. Es stehen zwei Zahlungsoptionen zur Verfügung:\n\na) Einmalige Zahlung\n- Einmaliger Kaufpreis für lebenslangen Zugang zu allen Premium-Funktionen\n- Keine automatische Verlängerung\n- Keine wiederkehrenden Gebühren\n\nb) Monatliches Abonnement\n- Monatliche Zahlung für Zugang zu allen Premium-Funktionen\n- Automatische Verlängerung am Ende jedes Abrechnungszeitraums\n- Kündigung jederzeit möglich\n- Bei Kündigung bleibt der Zugang bis zum Ende des bezahlten Zeitraums bestehen\n\nDie Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, Google Play Store). Rückerstattungen erfolgen gemäss den Richtlinien des jeweiligen App Stores und den geltenden Schweizer Konsumentenschutzbestimmungen.'
      },
      {
        title: '6. Verfügbarkeit',
        text: 'Wir bemühen uns um eine hohe Verfügbarkeit der App, können diese jedoch nicht garantieren. Wartungsarbeiten können zu vorübergehenden Unterbrechungen führen.'
      },
      {
        title: '7. Änderungen der App',
        text: 'Wir behalten uns das Recht vor, die App jederzeit zu ändern, zu erweitern oder Funktionen zu entfernen. Wesentliche Änderungen werden angekündigt.'
      },
      {
        title: '8. Beendigung',
        text: 'Wir können dein Konto bei Verstoss gegen diese Bedingungen ohne Vorankündigung sperren oder löschen. Du kannst dein Konto jederzeit selbst löschen.'
      },
      {
        title: '9. Haftungsausschluss',
        text: 'Die App wird "wie besehen" bereitgestellt. Wir übernehmen keine Garantie für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen.\n\nDie Haftung richtet sich nach den Bestimmungen des Schweizer Obligationenrechts (OR).'
      },
      {
        title: '10. Anwendbares Recht und Gerichtsstand',
        text: 'Auf diese Nutzungsbedingungen ist ausschliesslich Schweizer Recht anwendbar. Gerichtsstand ist Zürich, Schweiz.'
      },
      {
        title: '11. Kontakt',
        text: 'Bei Fragen zu diesen Nutzungsbedingungen kontaktiere uns bitte über die Support-Funktion in der App.'
      }
    ]
  } : {
    title: 'Terms of Use',
    sections: [
      {
        title: '1. Acceptance of Terms',
        text: 'By using Easy Budget, you accept these terms of use in full. If you do not agree with these terms, you may not use the app.\n\nThese terms are subject to Swiss law.'
      },
      {
        title: '2. Registration and Account',
        text: '- You must be at least 16 years old to create an account\n- You are responsible for keeping your login credentials confidential\n- You may only create one account per person\n- You must provide correct and current information'
      },
      {
        title: '3. Permitted Use',
        text: 'You may only use the app for legal purposes. The following actions are prohibited:\n\n- Misuse of the app for illegal activities\n- Distribution of malware or harmful code\n- Attempting to compromise the security of the app\n- Automated access without express permission\n- Sharing your login credentials with third parties'
      },
      {
        title: '4. Your Data',
        text: 'You retain all rights to the data you enter in the app. We use your data only in accordance with our privacy policy and applicable Swiss data protection regulations.'
      },
      {
        title: '5. Premium Features and Payments',
        text: 'The app offers paid premium features. Two payment options are available:\n\na) One-Time Payment\n- One-time purchase price for lifetime access to all premium features\n- No automatic renewal\n- No recurring fees\n\nb) Monthly Subscription\n- Monthly payment for access to all premium features\n- Automatic renewal at the end of each billing period\n- Cancellation possible at any time\n- Upon cancellation, access remains until the end of the paid period\n\nPayment processing is handled by the respective app store providers (Apple App Store, Google Play Store). Refunds are made in accordance with the policies of the respective app store and applicable Swiss consumer protection regulations.'
      },
      {
        title: '6. Availability',
        text: 'We strive for high availability of the app, but cannot guarantee it. Maintenance work may lead to temporary interruptions.'
      },
      {
        title: '7. Changes to the App',
        text: 'We reserve the right to change, expand or remove features of the app at any time. Significant changes will be announced.'
      },
      {
        title: '8. Termination',
        text: 'We may suspend or delete your account without prior notice if you violate these terms. You can delete your account yourself at any time.'
      },
      {
        title: '9. Disclaimer',
        text: 'The app is provided "as is". We do not guarantee the accuracy, completeness or timeliness of the information provided.\n\nLiability is governed by the provisions of the Swiss Code of Obligations (OR).'
      },
      {
        title: '10. Applicable Law and Jurisdiction',
        text: 'Swiss law applies exclusively to these terms of use. Place of jurisdiction is Zurich, Switzerland.'
      },
      {
        title: '11. Contact',
        text: 'For questions about these terms of use, please contact us via the support function in the app.'
      }
    ]
  };

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
        <Text style={styles.headerTitle}>{t('terms')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{content.title}</Text>
          
          {content.sections.map((section, index) => (
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
  boldText: {
    fontWeight: '700',
    color: colors.text,
  },
});
