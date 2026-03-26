import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { AppColors } from '../theme/colors';

interface CircleIconButtonProps {
  icon: string;
  onPress: () => void;
}

export function CircleIconButton({ icon, onPress }: CircleIconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && {
          transform: [{ scale: 0.97 }],
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

export default CircleIconButton;

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AppColors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 22,
  },
});
