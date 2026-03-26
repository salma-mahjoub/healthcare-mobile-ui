import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import HeartbeatLine from '../components/HeartbeatLine';
import LogoBox from '../components/LogoBox';
import { saveSession } from '../lib/auth-storage';

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});
  const [loading,  setLoading]  = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const errs: typeof errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim())           errs.email    = 'Email required';
    else if (!emailReg.test(email)) errs.email = 'Invalid email';
    if (!password)               errs.password = 'Password required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) { shake(); return; }
    setLoading(true);
    setTimeout(async () => {
      await saveSession();
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LogoBox color={colors.primary} />
          <Text style={[styles.appName, { color: colors.textPrimary }]}>HealthCare+</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Your wellness companion</Text>
        </View>

        <HeartbeatLine color={colors.primary} />

        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateX: shakeAnim }], backgroundColor: colors.cardBg, shadowColor: colors.shadow },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Welcome Back</Text>

          <AppInput
            iconName="mail-outline"
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
            error={!!errors.email}
          />
          {errors.email && <Text style={styles.errTxt}>{errors.email}</Text>}

          <AppInput
            iconName="lock-closed-outline"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
            error={!!errors.password}
          />
          {errors.password && <Text style={styles.errTxt}>{errors.password}</Text>}

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={[styles.forgotTxt, { color: colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <AppButton title="Log In" onPress={handleLogin} loading={loading} style={styles.btn} />

          <View style={styles.footer}>
            <Text style={[styles.footerTxt, { color: colors.textSecondary }]}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.link, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:    { flex: 1 },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, flexGrow: 1 },

  header:  { alignItems: 'center', marginBottom: 8 },
  appName: { fontFamily: Typography.fontBold, fontSize: Typography.xl },
  tagline: { fontFamily: Typography.fontRegular, fontSize: Typography.sm, marginTop: 4 },

  card:      { borderRadius: 28, padding: 24, marginTop: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  cardTitle: { fontFamily: Typography.fontBold, fontSize: Typography.xl, marginBottom: 24 },

  forgotRow: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotTxt: { fontFamily: Typography.fontMedium, fontSize: Typography.sm },

  btn: { marginBottom: 20 },

  footer:    { flexDirection: 'row', justifyContent: 'center' },
  footerTxt: { fontFamily: Typography.fontRegular, fontSize: Typography.sm },
  link:      { fontFamily: Typography.fontSemiBold, fontSize: Typography.sm },

  errTxt: { fontFamily: Typography.fontRegular, fontSize: Typography.xs, color: '#F97316', marginTop: -10, marginBottom: 10, marginLeft: 4 },
});
