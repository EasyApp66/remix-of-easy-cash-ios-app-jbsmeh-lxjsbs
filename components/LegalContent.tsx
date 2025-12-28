
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useLanguage } from '@/contexts/LanguageContext';

interface LegalContentProps {
  contentKey: string;
}

// German and English content for all legal pages
const legalContent: { [key: string]: { de: any; en: any } } = {
  agb: {
    de: {
      title: 'Allgemeine Geschäftsbedingungen',
      sections: [
        {
          title: '1. Geltungsbereich',
          content: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Easy Budget App. Mit der Nutzung der App erklärst du dich mit diesen Bedingungen einverstanden.\n\nDiese AGB unterliegen dem Schweizer Recht, insbesondere dem Obligationenrecht (OR).'
        },
        {
          title: '2. Leistungsbeschreibung',
          content: 'Easy Budget ist eine Budgetverwaltungs-App, die es Nutzern ermöglicht, ihre Ausgaben und Abonnements zu verwalten und zu überwachen.'
        },
        {
          title: '3. Nutzerkonto',
          content: 'Für die vollständige Nutzung der App ist die Erstellung eines Nutzerkontos erforderlich. Du bist verpflichtet, bei der Registrierung wahrheitsgemässe Angaben zu machen und diese aktuell zu halten.'
        },
        {
          title: '4. Nutzungsrechte',
          content: 'Mit dem Download der App erhältst du ein nicht-exklusives, nicht übertragbares Recht zur Nutzung der App für private Zwecke.'
        },
        {
          title: '5. Premium-Funktionen und Zahlungsmodalitäten',
          content: 'Bestimmte Funktionen der App sind kostenpflichtig und erfordern den Erwerb von Premium-Zugang. Es stehen zwei Zahlungsoptionen zur Verfügung:\n\n5.1 Einmalige Zahlung\n- Einmaliger Kaufpreis für unbegrenzten, lebenslangen Zugang zu allen Premium-Funktionen\n- Keine automatische Verlängerung\n- Keine wiederkehrenden Gebühren\n- Der Preis wird in der App in Schweizer Franken (CHF) angezeigt\n\n5.2 Monatliches Abonnement\n- Monatliche Zahlung für Zugang zu allen Premium-Funktionen\n- Automatische Verlängerung am Ende jedes Abrechnungszeitraums\n- Der Preis wird in der App in Schweizer Franken (CHF) angezeigt\n- Kündigung jederzeit möglich mit Wirkung zum Ende des laufenden Abrechnungszeitraums\n\n5.3 Zahlungsabwicklung\nDie Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, Google Play Store). Es gelten deren Zahlungsbedingungen.\n\n5.4 Rückerstattungen\nRückerstattungen erfolgen gemäss den Richtlinien des jeweiligen App Stores und den geltenden Schweizer Konsumentenschutzbestimmungen. Bitte wende dich für Rückerstattungsanfragen direkt an den jeweiligen App Store.'
        },
        {
          title: '6. Haftung',
          content: 'Die Haftung richtet sich nach den Bestimmungen des Schweizer Obligationenrechts (OR). Wir haften nur für Schäden, die auf vorsätzlichem oder grobfahrlässigem Verhalten beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich zulässig.'
        },
        {
          title: '7. Datenschutz',
          content: 'Die Verarbeitung deiner personenbezogenen Daten erfolgt gemäss unserer Datenschutzerklärung und den Bestimmungen des Schweizer Datenschutzgesetzes (DSG).'
        },
        {
          title: '8. Änderungen der AGB',
          content: 'Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche Änderungen wirst du rechtzeitig informiert. Die Fortsetzung der Nutzung nach Bekanntgabe der Änderungen gilt als Zustimmung zu den geänderten AGB.'
        },
        {
          title: '9. Anwendbares Recht und Gerichtsstand',
          content: 'Es gilt ausschliesslich Schweizer Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten ist Zürich, Schweiz.'
        },
        {
          title: '10. Salvatorische Klausel',
          content: 'Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.'
        }
      ]
    },
    en: {
      title: 'Terms and Conditions',
      sections: [
        {
          title: '1. Scope',
          content: 'These Terms and Conditions (T&C) apply to the use of the Easy Budget App. By using the app, you agree to these terms.\n\nThese T&C are subject to Swiss law, in particular the Swiss Code of Obligations (OR).'
        },
        {
          title: '2. Service Description',
          content: 'Easy Budget is a budget management app that allows users to manage and monitor their expenses and subscriptions.'
        },
        {
          title: '3. User Account',
          content: 'Full use of the app requires the creation of a user account. You are obliged to provide truthful information during registration and keep it up to date.'
        },
        {
          title: '4. Usage Rights',
          content: 'By downloading the app, you receive a non-exclusive, non-transferable right to use the app for private purposes.'
        },
        {
          title: '5. Premium Features and Payment Terms',
          content: 'Certain features of the app are paid and require the purchase of Premium access. Two payment options are available:\n\n5.1 One-Time Payment\n- One-time purchase price for unlimited, lifetime access to all Premium features\n- No automatic renewal\n- No recurring fees\n- Price is displayed in Swiss Francs (CHF) in the app\n\n5.2 Monthly Subscription\n- Monthly payment for access to all Premium features\n- Automatic renewal at the end of each billing period\n- Price is displayed in Swiss Francs (CHF) in the app\n- Cancellation possible at any time, effective at the end of the current billing period\n\n5.3 Payment Processing\nPayment processing is handled by the respective app store providers (Apple App Store, Google Play Store). Their payment terms apply.\n\n5.4 Refunds\nRefunds are made in accordance with the policies of the respective app store and applicable Swiss consumer protection regulations. Please contact the respective app store directly for refund requests.'
        },
        {
          title: '6. Liability',
          content: 'Liability is governed by the provisions of the Swiss Code of Obligations (OR). We are only liable for damages based on intentional or grossly negligent conduct. Liability for slight negligence is excluded to the extent permitted by law.'
        },
        {
          title: '7. Data Protection',
          content: 'The processing of your personal data is carried out in accordance with our Privacy Policy and the provisions of the Swiss Data Protection Act (DSG).'
        },
        {
          title: '8. Changes to the T&C',
          content: 'We reserve the right to change these T&C at any time. You will be informed of significant changes in good time. Continued use after notification of changes is deemed acceptance of the amended T&C.'
        },
        {
          title: '9. Applicable Law and Jurisdiction',
          content: 'Swiss law applies exclusively, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction for all disputes is Zurich, Switzerland.'
        },
        {
          title: '10. Severability Clause',
          content: 'Should individual provisions of these T&C be or become invalid, the validity of the remaining provisions shall remain unaffected. The invalid provision shall be replaced by a valid one that comes closest to the economic purpose of the invalid provision.'
        }
      ]
    }
  }
};

export function LegalContent({ contentKey }: LegalContentProps) {
  const { language } = useLanguage();
  const content = legalContent[contentKey]?.[language];

  if (!content) {
    return <Text style={styles.text}>Content not found</Text>;
  }

  return (
    <>
      <Text style={styles.title}>{content.title}</Text>
      {content.sections.map((section: any, index: number) => (
        <React.Fragment key={index}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.text}>{section.content}</Text>
        </React.Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
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
