import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

interface VerificationSuccessScreenProps {
  onContinue: () => void;
}

export function VerificationSuccessScreen({
  onContinue,
}: VerificationSuccessScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Verification complete</Text>
        <Text style={styles.subtitle}>Your Phone number has been verified.</Text>

        <View style={styles.buttonWrap}>
          <PrimaryButton
            label="Continue"
            onPress={onContinue}
            variant="light"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default VerificationSuccessScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.primaryDark,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: AppColors.primaryDark,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#00cb2f',
    borderRadius: 92,
    borderWidth: 2,
    borderColor: '#8effa5',
    height: 184,
    justifyContent: 'center',
    marginBottom: 34,
    width: 184,
  },
  check: {
    color: AppColors.white,
    fontSize: 96,
    fontWeight: '900',
    lineHeight: 96,
    marginTop: -8,
  },
  title: {
    ...AppTypography.h3,
    color: AppColors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...AppTypography.body,
    color: AppColors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonWrap: {
    bottom: 24,
    left: 22,
    position: 'absolute',
    right: 22,
  },
});
