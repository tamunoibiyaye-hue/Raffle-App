import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppColors } from '../theme/colors';

interface ProgressDotsProps {
  total: number;
  activeIndex: number;
}

export function ProgressDots({ total, activeIndex }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <View
            key={`dot-${index}`}
            style={[styles.dot, active ? styles.activeDot : styles.inactiveDot]}
          />
        );
      })}
    </View>
  );
}

export default ProgressDots;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 38,
    height: 6,
    borderRadius: 999,
  },
  activeDot: {
    backgroundColor: AppColors.primaryDark,
  },
  inactiveDot: {
    backgroundColor: AppColors.primarySoft,
  },
});
