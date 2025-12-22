
import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform, Animated } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

const { width, height } = Dimensions.get('window');

// Snowflake component
const Snowflake = ({ delay }: { delay: number }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(-50);
      translateX.setValue(Math.random() * width);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 50,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, [delay]);

  const size = 4 + Math.random() * 6;

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    />
  );
};

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  // Generate snowflakes with random delays
  const snowflakes = Array.from({ length: 50 }, (_, i) => (
    <Snowflake key={i} delay={Math.random() * 5000} />
  ));

  return (
    <View style={styles.container}>
      {/* Snow animation background */}
      <View style={styles.snowContainer}>
        {snowflakes}
      </View>

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
                Hello! I&apos;m <Text style={styles.greenText}>EASY CASH</Text>
              </Text>
              <View style={styles.subtitleContainer}>
                <Text style={[styles.welcomeSubtitle, { fontSize: 37 }]}>
                  Tracke dein{'\n'}
                  <Text style={styles.greenText}>BUDGET</Text>
                  {'\n\n'}
                  und deine{'\n'}
                  <Text style={styles.greenText}>ABOs</Text>
                </Text>
              </View>
            </View>

            <View style={styles.loginSection}>
              <TouchableOpacity style={[styles.loginButton, styles.emailButton, { backgroundColor: "#A0FF6B" }]}>
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
  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
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
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'left',
    lineHeight: 40,
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
