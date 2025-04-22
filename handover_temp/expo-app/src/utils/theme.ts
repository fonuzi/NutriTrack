// Color definitions based on your web app's theme
export const colors = {
  primary: '#6366F1',
  primaryForeground: '#FFFFFF',
  secondary: '#6B7280',
  background: '#111827',
  backgroundLight: '#1F2937',
  cardBackground: '#1F2937',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

// Font weights
export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Typography
export const typography = {
  headingLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.bold,
  },
  headingMedium: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeights.bold,
  },
  headingSmall: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.normal,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.normal,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.medium,
  },
};