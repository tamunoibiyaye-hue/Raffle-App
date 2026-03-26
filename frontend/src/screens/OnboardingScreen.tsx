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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topArea}>
          <ProgressDots total={3} activeIndex={2} />
        </View>

        <View style={styles.centerArea}>
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
        </View>

        <View style={styles.actionsRow}>
          <PrimaryButton label="Register" onPress={onRegister} style={styles.cta} />
          <PrimaryButton label="Sign in" onPress={onSignIn} style={styles.cta} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.white,
    flex: 1,
  },
  container: {
    backgroundColor: AppColors.white,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topArea: {
    alignItems: 'center',
    marginTop: 2,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  chatBubble: {
    alignItems: 'center',
    backgroundColor: '#f8f8fb',
    borderColor: '#eeeeee',
    borderRadius: 30,
    borderWidth: 1,
    height: 200,
    justifyContent: 'center',
    width: 270,
  },
  starLarge: {
    color: '#ffbe2d',
    fontSize: 82,
    left: 0,
    position: 'absolute',
    textShadowColor: '#f4ae20',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    top: 50,
  },
  starSmall: {
    color: '#ffcb4b',
    fontSize: 52,
    left: 40,
    position: 'absolute',
    top: 68,
  },
  starSmallRight: {
    color: '#ffcb4b',
    fontSize: 52,
    position: 'absolute',
    right: 40,
    top: 68,
  },
  textWrap: {
    marginTop: 34,
    paddingHorizontal: 10,
  },
  titleAccent: {
    ...AppTypography.h4,
    color: AppColors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleMain: {
    ...AppTypography.h3,
    color: AppColors.textDark,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
  },
  cta: {
    flex: 1,
  },
});
