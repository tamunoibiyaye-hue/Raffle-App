import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ProgressDots } from '../components/ProgressDots';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

interface OnboardingScreenProps {
  onRegister: () => void;
  onSignIn: () => void;
}

export function OnboardingScreen({
  onRegister,
  onSignIn,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArea}>
        <ProgressDots total={3} activeIndex={2} />
      </View>

      <View style={styles.imageWrap}>
        <View style={styles.chatBubble}>
          <Text style={styles.starLarge}>★</Text>
          <Text style={styles.starSmall}>★</Text>
          <Text style={styles.starSmallRight}>★</Text>
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.titleAccent}>Customer friendly</Text>
        <Text style={styles.titleMain}>
          Seamless and transparent customer experience at every step of transfer
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <PrimaryButton label="Register" onPress={onRegister} />
        <PrimaryButton label="Sign in" onPress={onSignIn} />
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    flex: 1,
    paddingBottom: 18,
    paddingHorizontal: 22,
  },
  topArea: {
    alignItems: 'center',
    marginTop: 10,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  chatBubble: {
    alignItems: 'center',
    backgroundColor: '#f8f8fb',
    borderColor: '#eeeeee',
    borderRadius: 36,
    borderWidth: 1,
    height: 220,
    justifyContent: 'center',
    width: 290,
  },
  starLarge: {
    color: '#ffbe2d',
    fontSize: 90,
    left: 0,
    position: 'absolute',
    textShadowColor: '#f4ae20',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    top: 56,
  },
  starSmall: {
    color: '#ffcb4b',
    fontSize: 58,
    left: 42,
    position: 'absolute',
    top: 72,
  },
  starSmallRight: {
    color: '#ffcb4b',
    fontSize: 58,
    position: 'absolute',
    right: 42,
    top: 72,
  },
  textWrap: {
    marginTop: 78,
    paddingHorizontal: 6,
  },
  titleAccent: {
    ...AppTypography.subtitle,
    color: AppColors.primaryDark,
    fontSize: 32,
    marginBottom: 14,
    textAlign: 'center',
  },
  titleMain: {
    ...AppTypography.h2,
    color: AppColors.textDark,
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 'auto',
  },
});
