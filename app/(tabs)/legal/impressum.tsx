
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

export default function ImpressumScreen() {
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
        <Text style={styles.headerTitle}>Impressum</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Impressum</Text>
          
          <Text style={styles.sectionTitle}>Angaben gemäß § 5 TMG</Text>
          <Text style={styles.text}>
            Easy Cash{'\n'}
            Musterstraße 123{'\n'}
            12345 Musterstadt{'\n'}
            Deutschland
          </Text>

          <Text style={styles.sectionTitle}>Vertreten durch</Text>
          <Text style={styles.text}>
            Max Mustermann{'\n'}
            Geschäftsführer
          </Text>

          <Text style={styles.sectionTitle}>Kontakt</Text>
          <Text style={styles.text}>
            Telefon: +49 (0) 123 456789{'\n'}
            E-Mail: kontakt@easycash.de{'\n'}
            Website: www.easycash.de
          </Text>

          <Text style={styles.sectionTitle}>Registereintrag</Text>
          <Text style={styles.text}>
            Eintragung im Handelsregister{'\n'}
            Registergericht: Amtsgericht Musterstadt{'\n'}
            Registernummer: HRB 12345
          </Text>

          <Text style={styles.sectionTitle}>Umsatzsteuer-ID</Text>
          <Text style={styles.text}>
            Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:{'\n'}
            DE123456789
          </Text>

          <Text style={styles.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</Text>
          <Text style={styles.text}>
            Max Mustermann{'\n'}
            Musterstraße 123{'\n'}
            12345 Musterstadt
          </Text>

          <Text style={styles.sectionTitle}>Streitschlichtung</Text>
          <Text style={styles.text}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            https://ec.europa.eu/consumers/odr{'\n\n'}
            Unsere E-Mail-Adresse finden Sie oben im Impressum.{'\n\n'}
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
            Verbraucherschlichtungsstelle teilzunehmen.
          </Text>

          <Text style={styles.sectionTitle}>Haftung für Inhalte</Text>
          <Text style={styles.text}>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
            Tätigkeit hinweisen.
          </Text>

          <Text style={styles.sectionTitle}>Haftung für Links</Text>
          <Text style={styles.text}>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
            der Seiten verantwortlich.
          </Text>

          <Text style={styles.sectionTitle}>Urheberrecht</Text>
          <Text style={styles.text}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
            Zustimmung des jeweiligen Autors bzw. Erstellers.
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
