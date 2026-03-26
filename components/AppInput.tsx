import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';

interface AppInputProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
  error?:   boolean;
}

export default function AppInput({ iconName, error, secureTextEntry, ...props }: AppInputProps) {
  const [isFocused,  setFocused]  = useState(false);
  const [showPass,   setShowPass] = useState(false);
  const isPassword = secureTextEntry !== undefined;
  const { colors, isDark } = useAppTheme();

  const focusedBackground = isDark ? colors.surfaceMuted : colors.primaryLight;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.inputBg },
        isFocused && { borderColor: colors.primary, backgroundColor: focusedBackground },
        error && { borderColor: colors.urgent },
      ]}>
      <Ionicons
        name={iconName}
        size={18}
        color={isFocused ? colors.primary : colors.textLight}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholderTextColor={colors.textLight}
        selectionColor={colors.primary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={isPassword ? !showPass : false}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eye}>
          <Ionicons
            name={showPass ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, height: 56, borderWidth: 1.5, borderColor: 'transparent', marginBottom: 14 },
  icon:    { marginRight: 10 },
  input:   { flex: 1, fontFamily: Typography.fontRegular, fontSize: Typography.base, height: '100%' },
  eye:     { padding: 4 },
});
