import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <Ionicons
        name="heart"
        size={size * 0.44}
        color="#FFFFFF"
      />
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
});
