import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';
import { hasSession } from '../lib/auth-storage';

export default function SplashScreen() {
  const { colors } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const ring1     = useRef(new Animated.Value(0)).current;
  const ring2     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    // Fade in and slide the text into place.
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    // Keep the logo gently pulsing.
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Expand the rings behind the logo.
    const ringLoop = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
        ])
      ).start();
    };
    ringLoop(ring1, 0);
    ringLoop(ring2, 900);

    // Keep the splash visible during the intro animation, then route
    // based on whether a local session is already stored.
    const bootstrap = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2800));

      if (!isMounted) return;

      const authenticated = await hasSession();
      router.replace(authenticated ? '/(tabs)' : '/login');
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [fadeAnim, pulseAnim, ring1, ring2, slideAnim]);

  const ringStyle = (anim: Animated.Value) => ({
    transform: [{
      scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }),
    }],
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.2, 0] }),
  });

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Animated rings */}
      <View style={styles.ringsWrapper}>
        <Animated.View style={[styles.ring, ringStyle(ring1)]} />
        <Animated.View style={[styles.ring, ringStyle(ring2)]} />
      </View>

      {/* Pulsing logo */}
      <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }], opacity: fadeAnim }]}>
        <View style={styles.logoBox}>
          <Text style={styles.heart}>♥</Text>
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.appName}>HealthCare+</Text>
        <Text style={styles.tagline}>Your wellness companion</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blobTopRight:   { position: 'absolute', top: -80,  right: -80,  width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.1)' },
  blobBottomLeft: { position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.08)' },
  ringsWrapper:   { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ring:           { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  logoWrapper:    { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 16 },
  logoBox:        { width: 100, height: 100, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  heart:          { fontSize: 48, color: '#fff' },
  textBlock:      { alignItems: 'center', marginTop: 28 },
  appName:        { fontFamily: Typography.fontBold, fontSize: Typography.xxl, color: '#fff', letterSpacing: 0.5 },
  tagline:        { fontFamily: Typography.fontRegular, fontSize: Typography.base, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
});
