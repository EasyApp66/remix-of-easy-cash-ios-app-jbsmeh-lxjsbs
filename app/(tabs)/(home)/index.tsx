
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

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
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>
                Hello! I&apos;m <Text style={styles.greenText}>Easy Budget</Text>
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Tracke dein{'\n'}
                <Text style={styles.greenText}>BUDGET</Text>
                {'\n'}und deine{'\n'}
                <Text style={styles.greenText}>ABOs</Text>
              </Text>
            </View>

            <View style={styles.loginSection}>
              <TouchableOpacity style={[styles.loginButton, styles.emailButton]}>
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

              <TouchableOpacity style={[styles.loginButton, styles.googleButton]}>
                <IconSymbol 
                  ios_icon_name="g.circle.fill" 
                  android_material_icon_name="g-translate" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.loginButtonText}>Mit Google fortfahren</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.moreOptionsText}>Mit weiteren Optionen fortfahren</Text>
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

      {/* Page Indicators */}
      <View style={styles.pageIndicators}>
        <View style={[styles.indicator, currentPage === 0 && styles.activeIndicator]} />
        <View style={[styles.indicator, currentPage === 1 && styles.activeIndicator]} />
      </View>
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
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  welcomeSubtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 56,
  },
  greenText: {
    color: colors.green,
  },
  loginSection: {
    width: '100%',
    gap: 12,
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
  googleButton: {
    backgroundColor: '#424242',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  appleButtonText: {
    color: '#000000',
  },
  moreOptionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
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
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grey,
  },
  activeIndicator: {
    backgroundColor: colors.green,
    width: 24,
  },
});
