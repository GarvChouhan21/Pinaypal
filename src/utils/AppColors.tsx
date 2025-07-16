// src/theme/colors.ts

import { useColorScheme } from 'react-native';

const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#F2F2F2',
  border: '#E5E5E5',
};

const darkColors = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#0A84FF',
  secondary: '#1C1C1E',
  border: '#3A3A3C',
};

// Hook version
export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};

// Static function (if you want non-hook usage)
export const getThemeColors = (scheme: 'light' | 'dark') => {
  return scheme === 'dark' ? darkColors : lightColors;
};
