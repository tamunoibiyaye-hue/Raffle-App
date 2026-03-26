import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { AppScreen } from './src/types/navigation';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PhoneEntryScreen from './src/screens/PhoneEntryScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import VerificationSuccessScreen from './src/screens/VerificationSuccessScreen';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPhoneNumberPad, setShowPhoneNumberPad] = useState(false);

  useEffect(() => {
    if (screen !== 'splash') {
      return;
    }
    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 1600);
    return () => clearTimeout(timer);
  }, [screen]);

  const canPushOtpDigit = useMemo(() => otpCode.length < 6, [otpCode.length]);

  const onEnterOtpDigit = (digit: string): void => {
    if (!canPushOtpDigit) {
      return;
    }
    setOtpCode((prev) => `${prev}${digit}`);
  };

  const onDeleteOtpDigit = (): void => {
    setOtpCode((prev) => prev.slice(0, -1));
  };

  const onSendCode = (): void => {
    setOtpCode('');
    setScreen('otpVerification');
  };

  const onContinueAfterSuccess = (): void => {
    setScreen('onboarding');
    setPhone('');
    setOtpCode('');
    setShowPhoneNumberPad(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.viewport}>
        {screen === 'splash' ? <SplashScreen /> : null}

        {screen === 'onboarding' ? (
          <OnboardingScreen
            onRegister={() => {
              setShowPhoneNumberPad(false);
              setScreen('phoneEntry');
            }}
            onSignIn={() => {
              setShowPhoneNumberPad(false);
              setScreen('phoneEntry');
            }}
          />
        ) : null}

        {screen === 'phoneEntry' ? (
          <PhoneEntryScreen
            phone={phone}
            setPhone={setPhone}
            openSignIn={() => setScreen('phoneEntry')}
            sendCode={onSendCode}
            onClose={() => {
              setShowPhoneNumberPad(false);
              setScreen('onboarding');
            }}
            showNumberPad={showPhoneNumberPad}
            onFocusInput={() => setShowPhoneNumberPad(true)}
          />
        ) : null}

        {screen === 'otpVerification' ? (
          <OtpVerificationScreen
            phone={phone}
            otpCode={otpCode}
            onBack={() => setScreen('phoneEntry')}
            onDone={() => setScreen('verificationSuccess')}
            onEnterDigit={onEnterOtpDigit}
            onDeleteDigit={onDeleteOtpDigit}
            onEditPhone={() => setScreen('phoneEntry')}
          />
        ) : null}

        {screen === 'verificationSuccess' ? (
          <VerificationSuccessScreen onContinue={onContinueAfterSuccess} />
        ) : null}

      </View>
      <StatusBar style={screen === 'verificationSuccess' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#e9eef2',
    flex: 1,
    justifyContent: 'center',
  },
  viewport: {
    backgroundColor: '#ffffff',
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    width: '100%',
  },
});

