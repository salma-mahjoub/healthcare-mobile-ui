import { useColorScheme } from 'react-native';
import { getThemeColors } from '../constants/colors';

export function useAppTheme() {
  const colorScheme = useColorScheme();

  return {
    colorScheme,
    colors: getThemeColors(colorScheme),
    isDark: colorScheme === 'dark',
  };
}
