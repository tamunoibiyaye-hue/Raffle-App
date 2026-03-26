import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../theme/colors';
import { AppTypography } from '../theme/typography';

interface NumberPadProps {
  onPressNumber: (digit: string) => void;
  onBackspace: () => void;
  height?: number;
}

const rows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

const lettersByDigit: Record<string, string> = {
  '1': '',
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
  '0': '',
};

export function NumberPad({
  onPressNumber,
  onBackspace,
  height = 56,
}: NumberPadProps) {
  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <View key={row.join('-')} style={styles.row}>
          {row.map((digit) => (
            <Pressable
              key={digit}
              onPress={() => onPressNumber(digit)}
              style={({ pressed }) => [
                styles.key,
                { height },
                pressed ? styles.keyPressed : undefined,
              ]}
            >
              <Text style={styles.digit}>{digit}</Text>
              {lettersByDigit[digit] ? (
                <Text style={styles.letters}>{lettersByDigit[digit]}</Text>
              ) : (
                <View style={styles.lettersSpacer} />
              )}
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <View style={styles.keyPlaceholder} />
        <Pressable
          onPress={() => onPressNumber('0')}
          style={({ pressed }) => [
            styles.key,
            { height },
            pressed ? styles.keyPressed : undefined,
          ]}
        >
          <Text style={styles.digit}>0</Text>
          <View style={styles.lettersSpacer} />
        </Pressable>
        <Pressable
          onPress={onBackspace}
          style={({ pressed }) => [
            styles.key,
            { height },
            styles.backspace,
            pressed ? styles.keyPressed : undefined,
          ]}
        >
          <Text style={styles.backspaceText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default NumberPad;

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  key: {
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderColor: AppColors.borderLight,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 56,
    justifyContent: 'center',
    maxWidth: 120,
  },
  keyPressed: {
    backgroundColor: AppColors.grey100,
  },
  digit: {
    ...AppTypography.h4,
    fontSize: 32,
    lineHeight: 34,
  },
  letters: {
    ...AppTypography.caption,
    letterSpacing: 0.7,
    marginTop: 2,
  },
  lettersSpacer: {
    height: 14,
  },
  keyPlaceholder: {
    flex: 1,
    maxWidth: 120,
  },
  backspace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backspaceText: {
    color: AppColors.primaryDark,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
});
