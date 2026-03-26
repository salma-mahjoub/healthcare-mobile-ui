import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'healthcare_mobile_ui_session';

let memorySession: string | null = null;

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveSession() {
  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(SESSION_KEY, 'authenticated');
    return;
  }

  memorySession = 'authenticated';
}

export async function clearSession() {
  if (await isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return;
  }

  memorySession = null;
}

export async function hasSession() {
  if (await isSecureStoreAvailable()) {
    const value = await SecureStore.getItemAsync(SESSION_KEY);
    return value === 'authenticated';
  }

  return memorySession === 'authenticated';
}
