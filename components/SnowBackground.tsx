
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Snowflake {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  duration: number;
  delay: number;
}

const SNOWFLAKE_COUNT = 30; // Subtle amount of snowflakes

export default function SnowBackground() {
  const snowflakes = useRef<Snowflake[]>([]);

  useEffect(() => {
    // Initialize snowflakes with random properties
    snowflakes.current = Array.from({ length: SNOWFLAKE_COUNT }, (_, index) => {
      const size = Math.random() * 4 + 2; // 2-6px size
      const duration = Math.random() * 8000 + 10000; // 10-18 seconds fall time
      const delay = Math.random() * 5000; // Random start delay
      
      return {
        id: index,
        x: new Animated.Value(Math.random() * SCREEN_WIDTH),
        y: new Animated.Value(-20),
        opacity: new Animated.Value(Math.random() * 0.3 + 0.2), // 0.2-0.5 opacity
        size,
        duration,
        delay,
      };
    });

    // Start animations for all snowflakes
    snowflakes.current.forEach((snowflake) => {
      animateSnowflake(snowflake);
    });

    return () => {
      // Cleanup animations
      snowflakes.current.forEach((snowflake) => {
        snowflake.x.stopAnimation();
        snowflake.y.stopAnimation();
        snowflake.opacity.stopAnimation();
      });
    };
  }, []);

  const animateSnowflake = (snowflake: Snowflake) => {
    // Reset position
    snowflake.y.setValue(-20);
    snowflake.x.setValue(Math.random() * SCREEN_WIDTH);

    // Animate falling
    Animated.parallel([
      // Fall down
      Animated.timing(snowflake.y, {
        toValue: SCREEN_HEIGHT + 20,
        duration: snowflake.duration,
        delay: snowflake.delay,
        useNativeDriver: true,
      }),
      // Slight horizontal drift
      Animated.sequence([
        Animated.timing(snowflake.x, {
          toValue: snowflake.x._value + (Math.random() * 40 - 20),
          duration: snowflake.duration / 2,
          delay: snowflake.delay,
          useNativeDriver: true,
        }),
        Animated.timing(snowflake.x, {
          toValue: snowflake.x._value + (Math.random() * 40 - 20),
          duration: snowflake.duration / 2,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and out
      Animated.sequence([
        Animated.timing(snowflake.opacity, {
          toValue: Math.random() * 0.3 + 0.3, // 0.3-0.6
          duration: snowflake.duration / 4,
          delay: snowflake.delay,
          useNativeDriver: true,
        }),
        Animated.timing(snowflake.opacity, {
          toValue: Math.random() * 0.2 + 0.1, // 0.1-0.3
          duration: snowflake.duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(snowflake.opacity, {
          toValue: 0,
          duration: snowflake.duration / 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Loop the animation
      animateSnowflake(snowflake);
    });
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {snowflakes.current.map((snowflake) => (
        <Animated.View
          key={snowflake.id}
          style={[
            styles.snowflake,
            {
              width: snowflake.size,
              height: snowflake.size,
              borderRadius: snowflake.size / 2,
              opacity: snowflake.opacity,
              transform: [
                { translateX: snowflake.x },
                { translateY: snowflake.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    backgroundColor: 'transparent',
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});
