import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useAppTheme } from '../hooks/use-app-theme';

const { width } = Dimensions.get('window');

interface HeartbeatLineProps {
  color?: string;
}

export default function HeartbeatLine({ color = '#2563EB' }: HeartbeatLineProps) {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const { isDark } = useAppTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1,   duration: 1400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim]);

  const points = `0,30 50,30 65,8 75,52 85,20 95,38 110,30 ${width},30`;

  return (
    <Animated.View style={[styles.wrap, { opacity: fadeAnim }]}>
      <Svg height="60" width={width}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity={isDark ? 0.7 : 0.5}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
});
