
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AGBScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const content = language === 'de' ? {
    title: 'Allgemeine Geschäftsbedingungen',
    sections: [
      {
        title: '1. Geltungsbereich',
        text: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Easy Budget App. Mit der Nutzung der App erklärst du dich mit diesen Bedingungen einverstanden.\n\nDiese AGB unterliegen dem Schweizer Recht, insbesondere dem Obligationenrecht (OR).'
      },
      {
        title: '2. Leistungsbeschreibung',
        text: 'Easy Budget ist eine Budgetverwaltungs-App, die es Nutzern ermöglicht, ihre Ausgaben und Abonnements zu verwalten und zu überwachen.'
      },
      {
        title: '3. Nutzerkonto',
        text: 'Für die vollständige Nutzung der App ist die Erstellung eines Nutzerkontos erforderlich. Du bist verpflichtet, bei der Registrierung wahrheitsgemässe Angaben zu machen und diese aktuell zu halten.'
      },
      {
        title: '4. Nutzungsrechte',
        text: 'Mit dem Download der App erhältst du ein nicht-exklusives, nicht übertragbares Recht zur Nutzung der App für private Zwecke.'
      },
      {
        title: '5. Premium-Funktionen und Zahlungsmodalitäten',
        text: 'Bestimmte Funktionen der App sind kostenpflichtig und erfordern den Erwerb von Premium-Zugang. Es stehen zwei Zahlungsoptionen zur Verfügung:\n\n5.1 Einmalige Zahlung\n- Einmaliger Kaufpreis für unbegrenzten, lebenslangen Zugang zu allen Premium-Funktionen\n- Keine automatische Verlängerung\n- Keine wiederkehrenden Gebühren\n- Der Preis wird in der App in Schweizer Franken (CHF) angezeigt\n\n5.2 Monatliches Abonnement\n- Monatliche Zahlung für Zugang zu allen Premium-Funktionen\n- Automatische Verlängerung am Ende jedes Abrechnungszeitraums\n- Der Preis wird in der App in Schweizer Franken (CHF) angezeigt\n- Kündigung jederzeit möglich mit Wirkung zum Ende des laufenden Abrechnungszeitraums\n\n5.3 Zahlungsabwicklung\nDie Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, Google Play Store). Es gelten deren Zahlungsbedingungen.\n\n5.4 Rückerstattungen\nRückerstattungen erfolgen gemäss den Richtlinien des jeweiligen App Stores und den geltenden Schweizer Konsumentenschutzbestimmungen. Bitte wende dich für Rückerstattungsanfragen direkt an den jeweiligen App Store.'
      },
      {
        title: '6. Haftung',
        text: 'Die Haftung richtet sich nach den Bestimmungen des Schweizer Obligationenrechts (OR). Wir haften nur für Schäden, die auf vorsätzlichem oder grobfahrlässigem Verhalten beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich zulässig.'
      },
      {
        title: '7. Datenschutz',
        text: 'Die Verarbeitung deiner personenbezogenen Daten erfolgt gemäss unserer Datenschutzerklärung und den Bestimmungen des Schweizer Datenschutzgesetzes (DSG).'
      },
      {
        title: '8. Änderungen der AGB',
        text: 'Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche Änderungen wirst du rechtzeitig informiert. Die Fortsetzung der Nutzung nach Bekanntgabe der Änderungen gilt als Zustimmung zu den geänderten AGB.'
      },
      {
        title: '9. Anwendbares Recht und Gerichtsstand',
        text: 'Es gilt ausschliesslich Schweizer Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten ist Zürich, Schweiz.'
      },
      {
        title: '10. Salvatorische Klausel',
        text: 'Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.'
      }
    ]
  } : {
    title: 'Terms and Conditions',
    sections: [
      {
        title: '1. Scope',
        text: 'These Terms and Conditions (T&C) apply to the use of the Easy Budget App. By using the app, you agree to these terms.\n\nThese T&C are subject to Swiss law, in particular the Swiss Code of Obligations (OR).'
      },
      {
        title: '2. Service Description',
        text: 'Easy Budget is a budget management app that allows users to manage and monitor their expenses and subscriptions.'
      },
      {
        title: '3. User Account',
        text: 'Full use of the app requires the creation of a user account. You are obliged to provide truthful information during registration and keep it up to date.'
      },
      {
        title: '4. Usage Rights',
        text: 'By downloading the app, you receive a non-exclusive, non-transferable right to use the app for private purposes.'
      },
      {
        title: '5. Premium Features and Payment Terms',
        text: 'Certain features of the app are paid and require the purchase of Premium access. Two payment options are available:\n\n5.1 One-Time Payment\n- One-time purchase price for unlimited, lifetime access to all Premium features\n- No automatic renewal\n- No recurring fees\n- Price is displayed in Swiss Francs (CHF) in the app\n\n5.2 Monthly Subscription\n- Monthly payment for access to all Premium features\n- Automatic renewal at the end of each billing period\n- Price is displayed in Swiss Francs (CHF) in the app\n- Cancellation possible at any time, effective at the end of the current billing period\n\n5.3 Payment Processing\nPayment processing is handled by the respective app store providers (Apple App Store, Google Play Store). Their payment terms apply.\n\n5.4 Refunds\nRefunds are made in accordance with the policies of the respective app store and applicable Swiss consumer protection regulations. Please contact the respective app store directly for refund requests.'
      },
      {
        title: '6. Liability',
        text: 'Liability is governed by the provisions of the Swiss Code of Obligations (OR). We are only liable for damages based on intentional or grossly negligent conduct. Liability for slight negligence is excluded to the extent permitted by law.'
      },
      {
        title: '7. Data Protection',
        text: 'The processing of your personal data is carried out in accordance with our Privacy Policy and the provisions of the Swiss Data Protection Act (DSG).'
      },
      {
        title: '8. Changes to the T&C',
        text: 'We reserve the right to change these T&C at any time. You will be informed of significant changes in good time. Continued use after notification of changes is deemed acceptance of the amended T&C.'
      },
      {
        title: '9. Applicable Law and Jurisdiction',
        text: 'Swiss law applies exclusively, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction for all disputes is Zurich, Switzerland.'
      },
      {
        title: '10. Severability Clause',
        text: 'Should individual provisions of these T&C be or become invalid, the validity of the remaining provisions shall remain unaffected. The invalid provision shall be replaced by a valid one that comes closest to the economic purpose of the invalid provision.'
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
        <Text style={styles.headerTitle}>{t('agb')}</Text>
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
});
