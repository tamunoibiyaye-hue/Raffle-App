import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CircleIconButton } from '../components/CircleIconButton';
import { NumberPad } from '../components/NumberPad';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';
import { clampPhoneDigits, maskPhoneNumber } from '../utils/format';

interface PhoneEntryScreenProps {
  phone: string;
  setPhone: (value: string) => void;
  openSignIn?: () => void;
  sendCode: () => void;
  onClose: () => void;
  showNumberPad: boolean;
  onFocusInput: () => void;
}

export function PhoneEntryScreen({
  phone,
  setPhone,
  openSignIn,
  sendCode,
  onClose,
  showNumberPad,
  onFocusInput,
}: PhoneEntryScreenProps) {
  const digitsOnly = useMemo(() => phone.replace(/\D/g, ''), [phone]);
  const canSend = digitsOnly.length >= 6;

  const onPressNumber = (digit: string): void => {
    setPhone(clampPhoneDigits(`${digitsOnly}${digit}`));
  };

  const onBackspace = (): void => {
    setPhone(clampPhoneDigits(digitsOnly.slice(0, -1)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <CircleIconButton icon="✕" onPress={onClose} />
          <Text style={styles.headerText}>Welcome to Rifa24</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verify your phone number with code</Text>
          <Text style={styles.subtitle}>
            We’ll send you a code. It helps keep your account secure
          </Text>

          <Text style={styles.label}>Your Phone number</Text>
          <View style={styles.inputRow}>
            <View style={styles.countryBox}>
              <Text style={styles.flag}>🇵🇦</Text>
              <Text style={styles.countryCode}>+507</Text>
            </View>
            <TextInput
              value={maskPhoneNumber(digitsOnly)}
              onChangeText={(value) => setPhone(clampPhoneDigits(value))}
              onFocus={onFocusInput}
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={AppColors.textMuted}
              keyboardType="number-pad"
              maxLength={20}
            />
          </View>

          <View style={styles.accountRow}>
            <Text style={styles.accountText}>Already have an account? </Text>
            <Pressable onPress={openSignIn}>
              <Text style={styles.accountLink}>Sign in</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton
            label="Send code"
            onPress={sendCode}
            disabled={!canSend}
            fullWidth
          />
          {showNumberPad ? (
            <View style={styles.numberPadWrap}>
              <NumberPad
                onPressNumber={onPressNumber}
                onBackspace={onBackspace}
                height={48}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PhoneEntryScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.white,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerText: {
    ...AppTypography.subtitle,
    color: AppColors.primaryDark,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  title: {
    ...AppTypography.h1,
    marginBottom: 12,
    maxWidth: 320,
  },
  subtitle: {
    ...AppTypography.body,
    color: AppColors.textSecondary,
    marginBottom: 28,
    maxWidth: 330,
  },
  label: {
    ...AppTypography.subtitle,
    color: AppColors.textSecondary,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryBox: {
    alignItems: 'center',
    borderColor: AppColors.borderLight,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 12,
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    ...AppTypography.bodyBold,
    color: AppColors.textPrimary,
  },
  input: {
    ...AppTypography.body,
    borderColor: AppColors.borderLight,
    borderRadius: 12,
    borderWidth: 1,
    color: AppColors.textPrimary,
    flex: 1,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  accountRow: {
    flexDirection: 'row',
    marginTop: 22,
  },
  accountText: {
    ...AppTypography.h4,
    color: AppColors.textPrimary,
  },
  accountLink: {
    ...AppTypography.h4,
    color: AppColors.primaryDark,
  },
  bottom: {
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 22,
  },
  numberPadWrap: {
    minHeight: 260,
  },
});
