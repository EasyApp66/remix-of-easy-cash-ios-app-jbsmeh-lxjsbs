
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      {/* Snow animation background */}
      <SnowAnimation />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Welcome Screen */}
        <View style={[styles.page, { width }]}>
          <View style={styles.welcomeContainer}>
            <View style={[styles.headerSection, { marginBottom: 3 }]}>
              <Text style={styles.welcomeTitle}>
                Hello! I&apos;m <Text style={styles.greenText}>EASY CASH</Text>
              </Text>
              <View style={styles.subtitleContainer}>
                <Text style={[styles.welcomeSubtitle, { fontSize: 48 }]}>
                  Tracke dein{'\n'}
                  <Text style={styles.greenText}>BUDGET</Text>
                  {'\n\n'}
                  und deine{'\n'}
                  <Text style={styles.greenText}>ABOs</Text>
                </Text>
              </View>
              {/* 20 pixel spacer after "und deine ABOs" */}
              <View style={{ height: 20 }} />
            </View>

            <View style={styles.loginSection}>
              <TouchableOpacity style={[styles.loginButton, styles.emailButton, { backgroundColor: "#A0FF6B", marginBottom: 1 }]}>
                <IconSymbol 
                  ios_icon_name="envelope.fill" 
                  android_material_icon_name="email" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.loginButtonText}>Mit E-Mail fortfahren</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.loginButton, styles.appleButton]}>
                <IconSymbol 
                  ios_icon_name="apple.logo" 
                  android_material_icon_name="apple" 
                  size={20} 
                  color="#000000" 
                />
                <Text style={[styles.loginButtonText, styles.appleButtonText]}>Mit Apple fortfahren</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                Indem du fortfährst, bestätigst du, dass du die{'\n'}
                <Text style={styles.termsLink}>Nutzungsbedingungen</Text> und die <Text style={styles.termsLink}>Datenschutzerklärung</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Swipe indicator */}
        <View style={[styles.page, { width }]}>
          <View style={styles.swipeIndicatorContainer}>
            <Text style={styles.swipeIndicatorText}>← Swipe to Budget Screen</Text>
            <Text style={styles.swipeHintText}>Or use the tab bar below</Text>
          </View>
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
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 120,
    paddingHorizontal: 24,
    width: '100%',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  subtitleContainer: {
    alignSelf: 'flex-start',
  },
  welcomeSubtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'left',
    lineHeight: 56,
  },
  greenText: {
    color: colors.green,
  },
  loginSection: {
    width: '100%',
    gap: 12,
    marginBottom: 0,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  emailButton: {
    backgroundColor: '#E57373',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  appleButtonText: {
    color: '#000000',
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  swipeIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  swipeIndicatorText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  swipeHintText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
