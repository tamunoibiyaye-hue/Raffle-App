import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

interface OtpBoxesProps {
  value: string;
  length?: number;
}

export function OtpBoxes({ value, length = 6 }: OtpBoxesProps) {
  const digits = Array.from({ length }).map((_, index) => value[index] ?? '');
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => {
        const isActive = index === activeIndex;
        const isFilled = digit.length > 0;
        return (
          <View
            key={`${index}-${digit}`}
            style={[
              styles.box,
              isActive ? styles.boxActive : undefined,
              isFilled ? styles.boxFilled : undefined,
            ]}
          >
            <Text style={styles.digit}>{digit}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default OtpBoxes;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    alignItems: 'center',
    borderColor: AppColors.borderLight,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    height: 56,
    justifyContent: 'center',
    maxWidth: 52,
  },
  boxActive: {
    borderColor: AppColors.primary,
    borderWidth: 1.5,
  },
  boxFilled: {
    borderColor: AppColors.primary,
  },
  digit: {
    ...AppTypography.h4,
    color: AppColors.textPrimary,
    fontSize: 24,
    lineHeight: 28,
  },
});
