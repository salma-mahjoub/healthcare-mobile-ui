import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';
import { Typography } from '../../constants/typography';

export default function PatientsScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>Patients</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text:      { fontFamily: Typography.fontBold, fontSize: Typography.xl },
  sub:       { fontFamily: Typography.fontRegular, fontSize: Typography.sm, marginTop: 8 },
});
