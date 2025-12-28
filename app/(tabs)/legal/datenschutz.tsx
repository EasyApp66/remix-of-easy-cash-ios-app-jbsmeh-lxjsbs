
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DatenschutzScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const content = language === 'de' ? {
    title: 'Datenschutzerklärung',
    sections: [
      {
        title: '1. Verantwortlicher',
        text: 'Verantwortlich für die Datenverarbeitung im Rahmen dieser App ist:\n\nIvan Mirosnic\nAhornstrasse\n8600 Dübendorf\nSchweiz\n\nDiese Datenschutzerklärung entspricht den Anforderungen des Schweizer Datenschutzgesetzes (DSG) und der Datenschutz-Grundverordnung (DSGVO) der Europäischen Union.'
      },
      {
        title: '2. Erhebung und Speicherung personenbezogener Daten',
        text: 'Wir erheben und verarbeiten folgende Daten:\n\n- E-Mail-Adresse (bei Registrierung)\n- Nutzungsdaten (Budget-Einträge, Abonnements, Ausgaben)\n- Technische Daten (Gerätetyp, Betriebssystem, App-Version)\n- Nutzungsstatistiken (anonymisiert)\n- Zahlungsinformationen (verarbeitet durch App-Store-Anbieter)'
      },
      {
        title: '3. Zweck der Datenverarbeitung',
        text: 'Deine Daten werden ausschliesslich für folgende Zwecke verwendet:\n\n- Bereitstellung der App-Funktionen\n- Verwaltung deines Nutzerkontos\n- Verbesserung der App-Qualität\n- Technischer Support\n- Abwicklung von Premium-Käufen (einmalige Zahlung oder Abonnement)\n- Erfüllung rechtlicher Verpflichtungen'
      },
      {
        title: '4. Rechtsgrundlage',
        text: 'Die Verarbeitung deiner Daten erfolgt auf Grundlage von:\n\n- Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO / Art. 31 Abs. 1 DSG)\n- Einwilligung (Art. 6 Abs. 1 lit. a DSGVO / Art. 31 Abs. 1 DSG)\n- Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO / Art. 31 Abs. 2 DSG)'
      },
      {
        title: '5. Datenspeicherung und -sicherheit',
        text: 'Deine Daten werden auf sicheren Servern gespeichert und durch technische und organisatorische Massnahmen geschützt. Wir nutzen Verschlüsselung und moderne Sicherheitsstandards gemäss Schweizer Datenschutzrecht.'
      },
      {
        title: '6. Weitergabe von Daten',
        text: 'Wir geben deine Daten nicht an Dritte weiter, ausser:\n\n- Du hast ausdrücklich eingewilligt\n- Es besteht eine gesetzliche Verpflichtung\n- Es ist zur Vertragserfüllung notwendig (z.B. Payment-Provider wie Apple App Store, Google Play Store für die Abwicklung von einmaligen Zahlungen oder Abonnements)'
      },
      {
        title: '7. Zahlungsabwicklung',
        text: 'Die Zahlungsabwicklung für Premium-Funktionen (einmalige Zahlung oder monatliches Abonnement) erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, Google Play Store). Diese verarbeiten deine Zahlungsinformationen gemäss ihren eigenen Datenschutzbestimmungen. Wir erhalten keine direkten Zahlungsinformationen wie Kreditkartennummern.'
      },
      {
        title: '8. Deine Rechte',
        text: 'Du hast folgende Rechte gemäss Schweizer Datenschutzgesetz (DSG) und DSGVO:\n\n- Auskunft über deine gespeicherten Daten\n- Berichtigung unrichtiger Daten\n- Löschung deiner Daten\n- Einschränkung der Verarbeitung\n- Datenübertragbarkeit\n- Widerspruch gegen die Verarbeitung\n- Beschwerde bei einer Aufsichtsbehörde (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter EDÖB)'
      },
      {
        title: '9. Cookies und Tracking',
        text: 'Die App verwendet lokale Speicherung für technisch notwendige Funktionen. Wir setzen keine Tracking-Cookies zu Werbezwecken ein.'
      },
      {
        title: '10. Dauer der Speicherung',
        text: 'Deine Daten werden gespeichert, solange dein Konto aktiv ist. Nach Löschung des Kontos werden deine Daten innerhalb von 30 Tagen vollständig gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.'
      },
      {
        title: '11. Änderungen der Datenschutzerklärung',
        text: 'Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder App-Funktionen anzupassen. Die aktuelle Version ist stets in der App verfügbar.'
      },
      {
        title: '12. Kontakt',
        text: 'Bei Fragen zum Datenschutz kontaktiere uns bitte über die Support-Funktion in der App.'
      }
    ]
  } : {
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. Data Controller',
        text: 'Responsible for data processing within this app:\n\nIvan Mirosnic\nAhornstrasse\n8600 Dübendorf\nSwitzerland\n\nThis privacy policy complies with the requirements of the Swiss Data Protection Act (DSG) and the European Union\'s General Data Protection Regulation (GDPR).'
      },
      {
        title: '2. Collection and Storage of Personal Data',
        text: 'We collect and process the following data:\n\n- Email address (upon registration)\n- Usage data (budget entries, subscriptions, expenses)\n- Technical data (device type, operating system, app version)\n- Usage statistics (anonymized)\n- Payment information (processed by app store providers)'
      },
      {
        title: '3. Purpose of Data Processing',
        text: 'Your data is used exclusively for the following purposes:\n\n- Provision of app functions\n- Management of your user account\n- Improvement of app quality\n- Technical support\n- Processing of premium purchases (one-time payment or subscription)\n- Fulfillment of legal obligations'
      },
      {
        title: '4. Legal Basis',
        text: 'The processing of your data is based on:\n\n- Contract fulfillment (Art. 6 para. 1 lit. b GDPR / Art. 31 para. 1 DSG)\n- Consent (Art. 6 para. 1 lit. a GDPR / Art. 31 para. 1 DSG)\n- Legitimate interests (Art. 6 para. 1 lit. f GDPR / Art. 31 para. 2 DSG)'
      },
      {
        title: '5. Data Storage and Security',
        text: 'Your data is stored on secure servers and protected by technical and organizational measures. We use encryption and modern security standards in accordance with Swiss data protection law.'
      },
      {
        title: '6. Data Disclosure',
        text: 'We do not share your data with third parties, except:\n\n- You have expressly consented\n- There is a legal obligation\n- It is necessary for contract fulfillment (e.g., payment providers such as Apple App Store, Google Play Store for processing one-time payments or subscriptions)'
      },
      {
        title: '7. Payment Processing',
        text: 'Payment processing for premium features (one-time payment or monthly subscription) is handled by the respective app store providers (Apple App Store, Google Play Store). They process your payment information according to their own privacy policies. We do not receive direct payment information such as credit card numbers.'
      },
      {
        title: '8. Your Rights',
        text: 'You have the following rights under Swiss Data Protection Act (DSG) and GDPR:\n\n- Access to your stored data\n- Correction of incorrect data\n- Deletion of your data\n- Restriction of processing\n- Data portability\n- Objection to processing\n- Complaint to a supervisory authority (Federal Data Protection and Information Commissioner FDPIC)'
      },
      {
        title: '9. Cookies and Tracking',
        text: 'The app uses local storage for technically necessary functions. We do not use tracking cookies for advertising purposes.'
      },
      {
        title: '10. Storage Duration',
        text: 'Your data is stored as long as your account is active. After account deletion, your data will be completely deleted within 30 days, unless there are legal retention obligations.'
      },
      {
        title: '11. Changes to Privacy Policy',
        text: 'We reserve the right to adapt this privacy policy to reflect changes in legal situations or app functions. The current version is always available in the app.'
      },
      {
        title: '12. Contact',
        text: 'For questions about data protection, please contact us via the support function in the app.'
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
        <Text style={styles.headerTitle}>{t('privacy')}</Text>
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
