
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
  hapticFeedback = true,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
    
    if (hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (!disabled) {
      if (hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.button, style, animatedStyle, disabled && styles.disabled]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
