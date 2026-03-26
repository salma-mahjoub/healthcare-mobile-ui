import { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';

interface QuickActionButtonProps {
  icon:      keyof typeof Ionicons.glyphMap;
  label:     string;
  bgColor:   string;
  iconColor: string;
  onPress?:  () => void;
}

function QuickActionButton({
  icon,
  label,
  bgColor,
  iconColor,
  onPress,
}: QuickActionButtonProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View style={[styles.box, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// memo prevents unnecessary rerenders when the parent updates
// but the quick action props stay the same.
export default memo(QuickActionButton);

const styles = StyleSheet.create({
  wrap:  { alignItems: 'center', gap: 8 },
  box:   { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: Typography.fontMedium, fontSize: Typography.sm },
});
