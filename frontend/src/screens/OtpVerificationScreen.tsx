import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CircleIconButton } from '../components/CircleIconButton';
import { NumberPad } from '../components/NumberPad';
import { OtpBoxes } from '../components/OtpBoxes';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';
import { maskPhoneForDisplay } from '../utils/format';

interface OtpVerificationScreenProps {
  phone: string;
  otpCode: string;
  onBack: () => void;
  onDone: () => void;
  onEnterDigit: (digit: string) => void;
  onDeleteDigit: () => void;
  onEditPhone: () => void;
}

export function OtpVerificationScreen({
  phone,
  otpCode,
  onBack,
  onDone,
  onEnterDigit,
  onDeleteDigit,
  onEditPhone,
}: OtpVerificationScreenProps) {
  const maskedPhone = useMemo(() => maskPhoneForDisplay(phone), [phone]);
  const isComplete = otpCode.length === 6;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <View style={styles.topRow}>
            <CircleIconButton icon="←" onPress={onBack} />
          </View>

          <Text style={styles.title}>We just sent an SMS</Text>
          <Text style={styles.subtitle}>Enter the security code we sent to</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phoneText}>{maskedPhone}</Text>
            <Pressable onPress={onEditPhone}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <OtpBoxes length={6} value={otpCode} />

          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn&apos;t get the code?</Text>
            <Pressable>
              <Text style={styles.resendLink}>Resend it</Text>
            </Pressable>
            <Text style={styles.timer}>45s</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            label="Done"
            onPress={onDone}
            disabled={!isComplete}
            fullWidth
          />
          <NumberPad
            onPressNumber={onEnterDigit}
            onBackspace={onDeleteDigit}
            height={48}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.white,
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  title: {
    ...AppTypography.h1,
    marginBottom: 8,
  },
  subtitle: {
    ...AppTypography.body,
    marginBottom: 2,
  },
  phoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 20,
  },
  phoneText: {
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  editText: {
    color: AppColors.primaryDark,
    fontWeight: '700',
  },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 22,
  },
  resendPrompt: {
    ...AppTypography.h3,
  },
  resendLink: {
    ...AppTypography.h3,
    color: AppColors.primaryDark,
  },
  timer: {
    ...AppTypography.h3,
    color: AppColors.grey300,
    marginLeft: 'auto',
  },
  bottomSection: {
    gap: 14,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
});