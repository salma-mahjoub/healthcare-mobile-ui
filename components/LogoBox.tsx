import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/use-app-theme';

interface LogoBoxProps {
  color: string;
  size?: number;
}

export default function LogoBox({ color, size = 72 }: LogoBoxProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[
      styles.box,
      {
        backgroundColor: color,
        width:  size,
        height: size,
        borderRadius: size * 0.3,
        shadowColor: color,
        borderColor: colors.glassBorder,
      },
    ]}>
      <Text style={[styles.heart, { fontSize: size * 0.47 }]}>♥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems:    'center',
    justifyContent:'center',
    marginBottom:   14,
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity:  0.35,
    shadowRadius:   16,
    elevation:      10,
    borderWidth: 1,
  },
  heart: { color: '#fff' },
});
