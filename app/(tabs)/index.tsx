import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAppTheme } from '../../hooks/use-app-theme';
import { Typography } from '../../constants/typography';
import QuickActionButton from '../../components/QuickActionButton';
import OverviewCard from '../../components/OverviewCard';

const NOTIFICATION_COUNT = 3;

const quickActions = [
  {
    icon: 'add' as const,
    label: 'New',
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    onPress: () => router.push('/(tabs)/schedule'),
  },
  {
    icon: 'calendar-outline' as const,
    label: 'Schedule',
    bgColor: '#D1FAE5',
    iconColor: '#10B981',
    onPress: () => router.push('/(tabs)/schedule'),
  },
  {
    icon: 'videocam-outline' as const,
    label: 'Video',
    bgColor: '#ECFDF5',
    iconColor: '#059669',
    onPress: () => router.push('/(tabs)/schedule'),
  },
  {
    icon: 'people-outline' as const,
    label: 'Patients',
    bgColor: '#EDE9FE',
    iconColor: '#7C3AED',
    onPress: () => router.push('/(tabs)/patients'),
  },
];

const overviewCards = [
  {
    icon: 'calendar-outline' as const,
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    title: 'Upcoming Appointments',
    subtitle: 'Next: 2:30 PM - John Smith',
    value: 3,
    valueColor: Colors.primary,
    badge: 'Today',
    badgeColor: Colors.primary,
    badgeBg: Colors.primaryLight,
  },
  {
    icon: 'people-outline' as const,
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
    title: 'Total Patients',
    subtitle: 'Active in your care',
    value: 124,
    valueColor: Colors.teal,
    badge: 'This month',
    badgeColor: Colors.teal,
    badgeBg: Colors.tealLight,
  },
  {
    icon: 'time-outline' as const,
    iconBg: '#FEF3C7',
    iconColor: Colors.urgent,
    title: 'Pending Reviews',
    subtitle: 'Awaiting your response',
    value: 7,
    valueColor: Colors.urgent,
    badge: 'Urgent',
    badgeColor: Colors.urgent,
    badgeBg: '#FEF3C7',
  },
];

const animatedSectionStyle = (opacity: Animated.Value, translateY: Animated.Value) => ({
  opacity,
  transform: [{ translateY }],
});

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Run a short native-driven animation to keep the entry smooth
    // without adding unnecessary work on the JS thread.
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <View style={styles.container}>
      {/* Gradient header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerBlob} />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting()}</Text>
              <Text style={styles.userName}>Dr. Salma Mahjoub</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.notifBtn}
              accessibilityRole="button"
              accessibilityLabel={`Notifications, ${NOTIFICATION_COUNT} non lues`}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {NOTIFICATION_COUNT > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeTxt}>{NOTIFICATION_COUNT}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.glassLeft}>
              <View style={styles.pulseIcon}>
                <Ionicons name="pulse-outline" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.glassLabel}>Today&apos;s Appointments</Text>
                <Text style={styles.glassValue}>8 patients</Text>
              </View>
            </View>
            <View>
              <Text style={styles.glassLabel}>Completed</Text>
              <Text style={styles.glassCompleted}>5/8</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Scrollable body */}
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[styles.section, animatedSectionStyle(fadeAnim, slideAnim)]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
          <View style={[styles.actionsCard, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
            <View style={styles.actionsRow}>
              {quickActions.map((action) => (
                <QuickActionButton key={action.label} {...action} />
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, animatedSectionStyle(fadeAnim, slideAnim)]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today&apos;s Overview</Text>
          {overviewCards.map((card) => (
            <OverviewCard key={card.title} {...card} />
          ))}
        </Animated.View>

        <Animated.View style={[styles.section, animatedSectionStyle(fadeAnim, slideAnim)]}>
          <View style={[styles.focusCard, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
            <View style={styles.focusCopy}>
              <Text style={[styles.focusEyebrow, { color: colors.primary }]}>Focus of the day</Text>
              <Text style={[styles.focusTitle, { color: colors.textPrimary }]}>Complete follow-ups before 4:00 PM</Text>
              <Text style={[styles.focusText, { color: colors.textSecondary }]}>
                Prioritize pending reviews and keep patient response time under 30 minutes.
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.focusButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/schedule')}
              accessibilityRole="button"
              accessibilityLabel="Open schedule">
              <Text style={styles.focusButtonText}>Open schedule</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, animatedSectionStyle(fadeAnim, slideAnim)]}>
          <View
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: isDark ? colors.border : colors.primaryLight,
                shadowColor: colors.shadow,
              },
            ]}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightBadge, { backgroundColor: isDark ? colors.overlay : colors.primaryLight }]}>
                <Text style={[styles.insightBadgeText, { color: colors.primary }]}>Today&apos;s Insight</Text>
              </View>
              <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>
              Small follow-ups today prevent critical escalations tomorrow.
            </Text>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              A calm, thoughtful interface can also carry product meaning. This block is your signature touch.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
  headerBlob: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  userName: { fontFamily: Typography.fontBold, fontSize: Typography.xl, color: '#fff' },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  notifBadgeTxt: { fontFamily: Typography.fontBold, fontSize: 9, color: '#fff' },
  glassCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pulseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassLabel: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  glassValue: { fontFamily: Typography.fontBold, fontSize: Typography.md, color: '#fff' },
  glassCompleted: { fontFamily: Typography.fontBold, fontSize: Typography.xxl, color: '#fff' },
  scroll: { flex: 1, paddingTop: 24, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
    marginBottom: 16,
  },
  actionsCard: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  focusCard: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    gap: 18,
  },
  focusCopy: { gap: 6 },
  focusEyebrow: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  focusTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
  },
  focusText: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.sm,
    lineHeight: 20,
  },
  focusButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  focusButtonText: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.sm,
    color: '#FFFFFF',
  },
  insightCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  insightBadgeText: {
    fontFamily: Typography.fontSemiBold,
    fontSize: Typography.xs,
  },
  insightTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.md,
    lineHeight: 24,
  },
  insightText: {
    fontFamily: Typography.fontRegular,
    fontSize: Typography.sm,
    lineHeight: 20,
  },
});
