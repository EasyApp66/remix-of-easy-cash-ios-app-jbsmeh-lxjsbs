
import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";

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
  }, [delay, opacity, translateX, translateY]);

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

export default function SnowAnimation() {
  // Generate snowflakes with random delays
  const snowflakes = Array.from({ length: 50 }, (_, i) => (
    <Snowflake key={i} delay={Math.random() * 5000} />
  ));

  return (
    <View style={styles.snowContainer}>
      {snowflakes}
    </View>
  );
}

const styles = StyleSheet.create({
  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});
