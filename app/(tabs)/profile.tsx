import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';
import { Typography } from '../../constants/typography';
import { clearSession } from '../../lib/auth-storage';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import {
  getProfileCompletion,
  getStoredProfile,
  StoredProfile,
  updateStoredProfile,
} from '../../lib/profile-storage';

const roleOptions: StoredProfile['role'][] = ['Doctor', 'Patient'];

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const [profile, setProfile] = useState<StoredProfile>({
    fullName: '',
    email: '',
    role: '',
    phone: '',
    clinicName: '',
  });
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await getStoredProfile();
      setProfile(storedProfile);
      setShowCompletionForm(!storedProfile.role || !storedProfile.phone);
    };

    loadProfile();
  }, []);

  const completion = getProfileCompletion(profile);
  const isProfileComplete = completion >= 100;

  const handleProfileChange = (field: keyof StoredProfile, value: string) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const storedProfile = await updateStoredProfile({
      fullName: profile.fullName.trim(),
      email: profile.email.trim(),
      role: profile.role,
      phone: profile.phone.trim(),
      clinicName: profile.clinicName.trim(),
    });
    setProfile(storedProfile);
    setShowCompletionForm(false);
    setSaving(false);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Do you want to return to the login screen?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}>
          <Text style={styles.avatarText}>
            {profile.fullName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'HC'}
          </Text>
        </View>

        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {profile.fullName || 'Your profile'}
        </Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>
          {profile.role || 'Complete your profile to personalize your experience'}
        </Text>

        <View
          style={[
            styles.completeCard,
            { backgroundColor: colors.cardBg, shadowColor: colors.shadow, borderColor: colors.border },
          ]}>
          <View style={styles.completeHeader}>
            <View style={styles.completeCopy}>
              <Text style={[styles.completeTitle, { color: colors.textPrimary }]}>Complete your profile</Text>
              <Text style={[styles.completeSubtitle, { color: colors.textSecondary }]}>
                Add more information to improve your experience
              </Text>
            </View>
            <Text style={[styles.completePercent, { color: colors.primary }]}>{completion}%</Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceMuted }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${completion}%` },
              ]}
            />
          </View>

          {!showCompletionForm && !isProfileComplete && (
            <AppButton
              title="Complete now"
              onPress={() => setShowCompletionForm(true)}
              style={styles.completeButton}
            />
          )}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textLight }]}>Email</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {profile.email || 'Not provided yet'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textLight }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {profile.phone || 'Add your phone number'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textLight }]}>Clinic</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {profile.clinicName || 'Optional'}
            </Text>
          </View>
        </View>

        {showCompletionForm && (
          <View style={[styles.formCard, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
            <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Finish your details</Text>

            <View style={styles.roleGrid}>
              {roleOptions.map((roleOption) => {
                const isSelected = profile.role === roleOption;

                return (
                  <TouchableOpacity
                    key={roleOption}
                    activeOpacity={0.85}
                    onPress={() => handleProfileChange('role', roleOption)}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surfaceMuted,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.roleChipText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}>
                      {roleOption}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AppInput
              iconName="call-outline"
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={profile.phone}
              onChangeText={(value) => handleProfileChange('phone', value)}
            />

            <AppInput
              iconName="business-outline"
              placeholder="Clinic name (optional)"
              value={profile.clinicName}
              onChangeText={(value) => handleProfileChange('clinicName', value)}
            />

            <AppButton
              title="Save profile"
              onPress={handleSaveProfile}
              loading={saving}
              style={styles.saveButton}
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
        onPress={handleLogout}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Log out">
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
    paddingTop: 20,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
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
    textAlign: 'center',
  },
  completeCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  completeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  completeCopy: {
    flex: 1,
    gap: 4,
  },
  completeTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
  },
  completeSubtitle: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.sm,
    lineHeight: 20,
  },
  completePercent: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  completeButton: {
    marginTop: 18,
  },
  infoCard: {
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
  formCard: {
    width: '100%',
    borderRadius: 22,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 16,
  },
  formTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
    marginBottom: 16,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  roleChip: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  roleChipText: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.sm,
  },
  saveButton: {
    marginTop: 4,
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
