import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';

interface AppButtonProps {
  title:     string;
  onPress:   () => void;
  loading?:  boolean;
  disabled?: boolean;
  style?:    ViewStyle;
}

export default function AppButton({ title, onPress, loading = false, disabled = false, style }: AppButtonProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.wrapper, { shadowColor: colors.primary }, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, (disabled || loading) && styles.dimmed]}
      >
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.txt}>{title}</Text>
        }
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper:  { borderRadius: 16, overflow: 'hidden', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  gradient: { height: 56, alignItems: 'center', justifyContent: 'center' },
  txt:      { fontFamily: Typography.fontBold, fontSize: Typography.base, color: '#fff', letterSpacing: 0.5 },
  dimmed:   { opacity: 0.6 },
});
