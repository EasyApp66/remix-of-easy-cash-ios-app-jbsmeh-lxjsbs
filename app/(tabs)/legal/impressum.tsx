
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
          
          <Text style={styles.sectionTitle}>Angaben gemäss Schweizer Recht</Text>
          <Text style={styles.text}>
            Easy Budget{'\n'}
            Ivan Mirosnic{'\n'}
            Ahornstrasse{'\n'}
            8600 Dübendorf{'\n'}
            Schweiz
          </Text>

          <Text style={styles.sectionTitle}>Kontakt</Text>
          <Text style={styles.text}>
            E-Mail: Über Support-Funktion in der App erreichbar
          </Text>

          <Text style={styles.sectionTitle}>Haftungsausschluss</Text>
          <Text style={styles.text}>
            Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, 
            Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
            {'\n\n'}
            Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, 
            welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten 
            Informationen, durch Missbrauch der Verbindung oder durch technische Störungen 
            entstanden sind, werden ausgeschlossen.
          </Text>

          <Text style={styles.sectionTitle}>Haftung für Links</Text>
          <Text style={styles.text}>
            Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. 
            Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die 
            Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
          </Text>

          <Text style={styles.sectionTitle}>Urheberrechte</Text>
          <Text style={styles.text}>
            Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien 
            auf dieser App gehören ausschliesslich Ivan Mirosnic oder den speziell genannten 
            Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung 
            der Urheberrechtsträger im Voraus einzuholen.
          </Text>

          <Text style={styles.sectionTitle}>Anwendbares Recht</Text>
          <Text style={styles.text}>
            Auf diese App und deren Nutzung ist ausschliesslich Schweizer Recht anwendbar. 
            Gerichtsstand ist Zürich, Schweiz.
          </Text>

          <Text style={styles.sectionTitle}>Zahlungsinformationen</Text>
          <Text style={styles.text}>
            Diese App bietet kostenpflichtige Premium-Funktionen an. Es stehen folgende 
            Zahlungsoptionen zur Verfügung:{'\n\n'}
            - Einmalige Zahlung für lebenslangen Zugang{'\n'}
            - Monatliches Abonnement mit automatischer Verlängerung{'\n\n'}
            Die Zahlungsabwicklung erfolgt über die jeweiligen App-Store-Anbieter (Apple App Store, 
            Google Play Store). Es gelten deren Zahlungs- und Rückerstattungsbedingungen.
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
