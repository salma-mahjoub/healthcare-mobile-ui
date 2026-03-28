import * as SecureStore from 'expo-secure-store';

const PROFILE_KEY = 'healthcare_mobile_ui_profile';

type ProfileRole = 'Doctor' | 'Patient' | '';

export interface StoredProfile {
  fullName: string;
  email: string;
  role: ProfileRole;
  phone: string;
  clinicName: string;
}

const defaultProfile: StoredProfile = {
  fullName: '',
  email: '',
  role: '',
  phone: '',
  clinicName: '',
};

let memoryProfile: StoredProfile = defaultProfile;

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getStoredProfile() {
  if (await isSecureStoreAvailable()) {
    const raw = await SecureStore.getItemAsync(PROFILE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  }

  return memoryProfile;
}

export async function updateStoredProfile(partialProfile: Partial<StoredProfile>) {
  const nextProfile = {
    ...(await getStoredProfile()),
    ...partialProfile,
  };

  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(nextProfile));
  } else {
    memoryProfile = nextProfile;
  }

  return nextProfile;
}

export function getProfileCompletion(profile: StoredProfile) {
  const completedFields = [
    profile.fullName.trim(),
    profile.email.trim(),
    profile.role.trim(),
    profile.phone.trim(),
  ].filter(Boolean).length;

  return Math.round((completedFields / 4) * 100);
}
