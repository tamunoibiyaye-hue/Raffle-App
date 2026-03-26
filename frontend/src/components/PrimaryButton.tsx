import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'light';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  style,
  labelStyle,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.light,
        fullWidth ? styles.fullWidth : undefined,
        disabled ? styles.disabled : undefined,
        pressed && !disabled ? styles.pressed : undefined,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' ? styles.labelPrimary : styles.labelLight,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 14,
  },
  primary: {
    backgroundColor: AppColors.primaryDark,
  },
  light: {
    backgroundColor: AppColors.white,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: AppColors.primarySoft,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    ...AppTypography.buttonLabel,
    textAlign: 'center',
  },
  labelPrimary: {
    color: AppColors.white,
  },
  labelLight: {
    color: AppColors.primaryDark,
  },
});
