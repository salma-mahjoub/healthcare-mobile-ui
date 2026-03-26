import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';
import { Typography } from '../../constants/typography';
import { clearSession } from '../../lib/auth-storage';

export default function ProfileScreen() {
  const { colors } = useAppTheme();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous revenir à l’écran de connexion ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}>
          <Text style={styles.avatarText}>SM</Text>
        </View>

        <Text style={[styles.name, { color: colors.textPrimary }]}>Dr. Salma Mahjoub</Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>General Practitioner</Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textLight }]}>Email</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>salma@healthcare.app</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textLight }]}>Status</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>Available today</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
        onPress={handleLogout}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Se déconnecter">
        <Ionicons name="log-out-outline" size={18} color={colors.textWhite} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.xl,
    color: '#FFFFFF',
  },
  name: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.xl,
  },
  role: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.sm,
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    borderRadius: 22,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    gap: 6,
  },
  label: {
    fontFamily: Typography.fontMedium,
    fontSize: Typography.xs,
    textTransform: 'uppercase',
  },
  value: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.base,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  logoutButton: {
    borderRadius: 18,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.base,
    color: '#FFFFFF',
  },
});
