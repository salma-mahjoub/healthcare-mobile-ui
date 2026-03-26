import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import HeartbeatLine from '../components/HeartbeatLine';
import LogoBox from '../components/LogoBox';
import { saveSession } from '../lib/auth-storage';

export default function SignUpScreen() {
  const { colors } = useAppTheme();
  const [fullName,        setFullName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed,          setAgreed]          = useState(false);
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [loading,         setLoading]         = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const clearErr = (k: string) => setErrors(p => { const c = { ...p }; delete c[k]; return c; });

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName.trim())              errs.fullName        = 'Full name required';
    if (!email.trim())                 errs.email           = 'Email required';
    else if (!emailReg.test(email))    errs.email           = 'Invalid email';
    if (!password)                     errs.password        = 'Password required';
    else if (password.length < 8)      errs.password        = 'Minimum 8 characters';
    if (password !== confirmPassword)  errs.confirmPassword = 'Passwords do not match';
    if (!agreed)                       errs.terms           = 'Please accept the terms and conditions';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = () => {
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
          <LogoBox color={colors.teal} />
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Join HealthCare+</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Start your wellness journey today</Text>
        </View>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={[styles.stepBar, { backgroundColor: colors.teal }]} />
          <View style={[styles.stepBar, { backgroundColor: colors.border }]} />
          <View style={[styles.stepBar, { backgroundColor: colors.border }]} />
        </View>

        <HeartbeatLine color={colors.teal} />

        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateX: shakeAnim }], backgroundColor: colors.cardBg, shadowColor: colors.shadow },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Create Account</Text>

          <AppInput iconName="person-outline"      placeholder="Full name"         autoCapitalize="words"  value={fullName}        onChangeText={t => { setFullName(t);        clearErr('fullName'); }}        error={!!errors.fullName} />
          {errors.fullName        && <Text style={styles.errTxt}>{errors.fullName}</Text>}

          <AppInput iconName="mail-outline"        placeholder="Email address"     keyboardType="email-address" autoCapitalize="none" value={email}    onChangeText={t => { setEmail(t);           clearErr('email'); }}           error={!!errors.email} />
          {errors.email           && <Text style={styles.errTxt}>{errors.email}</Text>}

          <AppInput iconName="lock-closed-outline" placeholder="Create password"   secureTextEntry value={password}        onChangeText={t => { setPassword(t);        clearErr('password'); }}        error={!!errors.password} />
          {errors.password        && <Text style={styles.errTxt}>{errors.password}</Text>}

          <AppInput iconName="lock-closed-outline" placeholder="Confirm password"  secureTextEntry value={confirmPassword}  onChangeText={t => { setConfirmPassword(t); clearErr('confirmPassword'); }} error={!!errors.confirmPassword} />
          {errors.confirmPassword && <Text style={styles.errTxt}>{errors.confirmPassword}</Text>}

          {/* Terms checkbox */}
          <TouchableOpacity style={styles.termsRow} onPress={() => { setAgreed(!agreed); clearErr('terms'); }} activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.border },
                agreed && { backgroundColor: colors.teal, borderColor: colors.teal },
                !!errors.terms && { borderColor: colors.urgent },
              ]}>
              {agreed && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[styles.termsTxt, { color: colors.textSecondary }]}>
              I agree to the{' '}
              <Text style={[styles.termsLink, { color: colors.teal }]} onPress={() => Alert.alert('Terms & Conditions', 'À venir')}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={[styles.termsLink, { color: colors.teal }]} onPress={() => Alert.alert('Privacy Policy', 'À venir')}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errTxt}>{errors.terms}</Text>}

          <AppButton title="Sign Up" onPress={handleSignUp} loading={loading} style={styles.btn} />

          <View style={styles.footer}>
            <Text style={[styles.footerTxt, { color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.link, { color: colors.teal }]}>Log In</Text>
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

  header:  { alignItems: 'center', marginBottom: 16 },
  appName: { fontFamily: Typography.fontBold, fontSize: Typography.xl },
  tagline: { fontFamily: Typography.fontRegular, fontSize: Typography.sm, marginTop: 4 },

  stepRow:    { flexDirection: 'row', gap: 8, marginBottom: 8, paddingHorizontal: 4 },
  stepBar:    { flex: 1, height: 4, borderRadius: 4 },

  card:      { borderRadius: 28, padding: 24, marginTop: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  cardTitle: { fontFamily: Typography.fontBold, fontSize: Typography.xl, marginBottom: 24 },

  termsRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  checkbox:    { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  termsTxt:    { flex: 1, fontFamily: Typography.fontRegular, fontSize: Typography.sm, lineHeight: 20 },
  termsLink:   { fontFamily: Typography.fontSemiBold },

  btn: { marginTop: 16, marginBottom: 20 },

  footer:    { flexDirection: 'row', justifyContent: 'center' },
  footerTxt: { fontFamily: Typography.fontRegular, fontSize: Typography.sm },
  link:      { fontFamily: Typography.fontSemiBold, fontSize: Typography.sm },

  errTxt: { fontFamily: Typography.fontRegular, fontSize: Typography.xs, color: '#F97316', marginTop: -10, marginBottom: 10, marginLeft: 4 },
});
