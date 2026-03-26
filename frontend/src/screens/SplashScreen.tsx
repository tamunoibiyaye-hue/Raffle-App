import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

export function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logoRow}>
          <View style={styles.ball}>
            <Text style={styles.ballText}>24</Text>
          </View>
          <Text style={styles.brandText}>
            Rifa<Text style={styles.brandAccent}>24</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AppColors.bgGradient,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    width: '100%',
  },
  ball: {
    alignItems: 'center',
    backgroundColor: AppColors.logoBlue,
    borderColor: AppColors.white,
    borderRadius: 40,
    borderWidth: 3,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  ballText: {
    ...AppTypography.h2,
    color: AppColors.white,
    fontSize: 34,
    lineHeight: 36,
  },
  brandText: {
    ...AppTypography.h1,
    color: AppColors.logoBlue,
    fontSize: 56,
    lineHeight: 58,
  },
  brandAccent: {
    color: AppColors.logoGreen,
  },
});
