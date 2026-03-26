import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';

interface OverviewCardProps {
  icon:        keyof typeof Ionicons.glyphMap;
  iconBg:      string;
  iconColor:   string;
  title:       string;
  subtitle:    string;
  value:       string | number;
  valueColor:  string;
  badge?:      string;
  badgeColor?: string;
  badgeBg?:    string;
}

function OverviewCard({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  valueColor,
  badge,
  badgeColor = Colors.primary,
  badgeBg = Colors.primaryLight,
}: OverviewCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      accessible
      style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}
      accessibilityLabel={`${title}, ${subtitle}, valeur ${value}`}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeTxt, { color: badgeColor }]}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
}

// This card is presentational only, so memo keeps it lightweight
// when the parent screen animates or rerenders other sections.
export default memo(OverviewCard);

const styles = StyleSheet.create({
  card:      { borderRadius: 20, padding: 18, marginBottom: 14, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  iconBox:   { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badge:     { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeTxt:  { fontFamily: Typography.fontSemiBold, fontSize: Typography.xs },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  textGroup: { flex: 1 },
  title:     { fontFamily: Typography.fontSemiBold, fontSize: Typography.base, marginBottom: 2 },
  subtitle:  { fontFamily: Typography.fontRegular, fontSize: Typography.sm },
  value:     { fontFamily: Typography.fontBold, fontSize: Typography.xxxl, lineHeight: 40 },
});
