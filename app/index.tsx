import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '../hooks/use-app-theme';
import { Typography } from '../constants/typography';
import { hasSession } from '../lib/auth-storage';

export default function SplashScreen() {
  const { colors, isDark } = useAppTheme();
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
      <View
        style={[
          styles.blobTopRight,
          { backgroundColor: isDark ? 'rgba(15,23,42,0.3)' : 'rgba(255,255,255,0.1)' },
        ]}
      />
      <View
        style={[
          styles.blobBottomLeft,
          { backgroundColor: isDark ? 'rgba(8,47,73,0.35)' : 'rgba(255,255,255,0.08)' },
        ]}
      />
      {isDark && <View style={styles.darkAura} />}

      {/* Animated rings */}
      <View style={styles.ringsWrapper}>
        <Animated.View
          style={[
            styles.ring,
            styles.outerRing,
            { borderColor: isDark ? 'rgba(186,230,253,0.45)' : 'rgba(255,255,255,0.6)' },
            ringStyle(ring1),
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.innerRing,
            { borderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.6)' },
            ringStyle(ring2),
          ]}
        />
      </View>

      {/* Pulsing logo */}
      <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }], opacity: fadeAnim }]}>
        <View
          style={[
            styles.logoBox,
            {
              backgroundColor: isDark ? 'rgba(15,23,42,0.38)' : 'rgba(255,255,255,0.25)',
              borderColor: isDark ? 'rgba(186,230,253,0.3)' : 'rgba(255,255,255,0.4)',
            },
          ]}>
          <Ionicons name="heart" size={44} color="#FFFFFF" />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.appName}>HealthCare+</Text>
        <Text style={[styles.tagline, { color: isDark ? 'rgba(226,232,240,0.86)' : 'rgba(255,255,255,0.8)' }]}>
          {isDark ? 'Night-ready care experience' : 'Your wellness companion'}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blobTopRight:   { position: 'absolute', top: -80,  right: -80,  width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.1)' },
  blobBottomLeft: { position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.08)' },
  darkAura:       { position: 'absolute', top: 140, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(14,165,233,0.12)' },
  ringsWrapper:   { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ring:           { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  outerRing:      { shadowColor: '#7DD3FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 18 },
  innerRing:      { borderStyle: 'dashed' },
  logoWrapper:    { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 16 },
  logoBox:        { width: 100, height: 100, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  textBlock:      { alignItems: 'center', marginTop: 28 },
  appName:        { fontFamily: Typography.fontBold, fontSize: Typography.xxl, color: '#fff', letterSpacing: 0.5 },
  tagline:        { fontFamily: Typography.fontRegular, fontSize: Typography.base, marginTop: 6 },
});
