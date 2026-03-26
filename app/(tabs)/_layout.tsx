import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/use-app-theme';
import { Typography } from '../../constants/typography';
import { View, StyleSheet } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name:     IconName;
  focused:  boolean;
  color: string;
  activeBg: string;
}

function TabIcon({ name, focused, color, activeBg }: TabIconProps) {
  return (
    <View style={[styles.iconWrapper, focused && { backgroundColor: activeBg }]}>
      <Ionicons
        name={name}
        size={22}
        color={color}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarShowLabel: true,
        tabBarStyle:     [styles.tabBar, { backgroundColor: colors.cardBg, borderTopColor: colors.border, shadowColor: colors.shadow }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} activeBg={isDark ? colors.overlay : colors.primaryLight} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="calendar-outline" focused={focused} color={color} activeBg={isDark ? colors.overlay : colors.primaryLight} />
          ),
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: 'Patients',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="people-outline" focused={focused} color={color} activeBg={isDark ? colors.overlay : colors.primaryLight} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="person-outline" focused={focused} color={color} activeBg={isDark ? colors.overlay : colors.primaryLight} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor:  '#FFFFFF',
    borderTopColor:   '#E2E8F0',
    borderTopWidth:   1,
    height:           70,
    paddingBottom:    10,
    paddingTop:       8,
    shadowColor:      '#64748B',
    shadowOffset:     { width: 0, height: -4 },
    shadowOpacity:    0.08,
    shadowRadius:     16,
    elevation:        16,
  },
  tabLabel: {
    fontFamily: Typography.fontMedium,
    fontSize:   10,
  },
  iconWrapper: {
    width:         42,
    height:        42,
    borderRadius:  14,
    alignItems:    'center',
    justifyContent:'center',
  },
});
