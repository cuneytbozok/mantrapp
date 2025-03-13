import { DefaultTheme } from 'react-native-paper';

// Base color palette with generic names
// These are the actual color values that can be changed
const palette = {
  // Primary Colors (Rich, Deep, Inviting)
  primary100: '#D78F72', // Warm Terracotta
  primary200: '#C0785A', // Earthy Clay
  primary300: '#A66046', // Deep Mocha

  // Secondary Colors (More Saturated for Pop)
  secondary100: '#B35D5D', // Burnt Rose
  secondary200: '#E5A45D', // Sunset Amber
  secondary300: '#5C574E', // Smoky Olive

  // Neutral Colors (Adding Depth)
  neutral100: '#F8EDE3', // Soft Sand (Background)
  neutral200: '#D2B8A4', // Muted Parchment
  neutral300: '#8C7568', // Warm Walnut (Better Text Contrast)
  neutral400: '#463B38', // Dark Espresso (Strongest Text)

  // Dark Accents (For Contrast)
  dark100: '#3A2A28', // Vintage Leather
  dark200: '#2C1E1C', // Deep Coffee
  dark300: '#1E1412', // Dark Cocoa

  // Call-to-Action & Highlights (Rich & Eye-Catching)
  highlight100: '#F6A86E', // Golden Peach
  highlight200: '#E6773E', // Deep Sienna
  highlight300: '#CF5C36', // Rust Red

  // Semantic Colors (High Visibility)
  success: '#4CAF50', // Deep Emerald Green
  warning: '#E09F3E', // Antique Gold
  error: '#BF3F3F', // Vintage Red
  info: '#3D5A80', // Moody Teal
  
  // Legacy colors - for backward compatibility
  earth: '#654C37',
  pine: '#383B26',
  sage: '#7D8471',
  mist: '#F5F5F5',
  almond: '#EFDECD',
};

// Semantic color mapping
// These are the semantic names that components will use
// If we want to change the actual colors, we only need to change the palette references
const colors = {
  // UI Elements
  background: palette.neutral100,
  surface: palette.neutral200,
  card: palette.neutral200,
  cardAlt: palette.primary100,
  
  // Text colors - improved contrast
  text: palette.dark100,
  textSecondary: palette.dark200,
  textTertiary: palette.neutral300,
  textLight: palette.neutral100,
  
  // Brand colors
  primary: palette.primary300,
  primaryLight: palette.primary100,
  primaryDark: palette.primary200,
  
  // Accent colors
  accent: palette.secondary100,
  accentLight: palette.secondary200,
  accentDark: palette.secondary300,
  
  // Highlight colors
  highlight: palette.highlight200,
  highlightLight: palette.highlight100,
  highlightDark: palette.highlight300,
  
  // Status colors
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  
  // Category tag colors
  categoryTag: palette.primary200,
  categoryTagText: palette.neutral100,
  
  // Button colors
  buttonPrimary: palette.primary300,
  buttonSecondary: palette.secondary200,
  buttonText: palette.neutral100,
  
  // Legacy mappings - for backward compatibility
  softLavender: palette.primary100,
  mutedLilac: palette.primary200,
  paleRose: palette.secondary100,
  sereneBlue: palette.primary300,
  warmGray: palette.neutral300,
  softWhite: palette.neutral100,
};

// Typography settings
const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Spacing system
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 500,
  circle: 9999,
};

// Shadow styles - enhanced for more depth
const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  // Inner shadow effect for cards
  inset: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
};

// Helper function to create gradient colors
export const createGradient = (startColor, endColor, middleColor = null) => {
  return middleColor ? [startColor, middleColor, endColor] : [startColor, endColor];
};

// Common gradients - enhanced for more depth and richness
export const gradients = {
  // Main background gradient (soft and subtle)
  background: createGradient(
    palette.neutral100, 
    palette.neutral200
  ),
  
  // Rich primary gradient for buttons and CTAs
  primary: createGradient(
    palette.primary200,
    palette.primary300
  ),
  
  // Card gradients
  card: createGradient(
    palette.neutral200,
    palette.neutral100
  ),
  
  // Highlight card for featured content
  cardHighlight: createGradient(
    palette.primary100,
    palette.neutral200
  ),
  
  // Button gradients
  button: createGradient(
    palette.primary200,
    palette.primary300
  ),
  
  // Accent gradients
  accent: createGradient(
    palette.secondary100,
    palette.secondary200
  ),
  
  // Category tag gradient
  categoryTag: createGradient(
    palette.primary200,
    palette.primary300
  ),
  
  // Highlight gradient for special elements
  highlight: createGradient(
    palette.highlight100,
    palette.highlight200
  ),
  
  // Dark gradient for modal backgrounds
  dark: createGradient(
    palette.dark100,
    palette.dark200
  ),
};

// React Native Paper theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    text: colors.text,
    surface: colors.surface,
    error: colors.error,
    disabled: colors.textTertiary,
    placeholder: colors.textTertiary,
    backdrop: 'rgba(30, 20, 18, 0.5)', // Darker, more opaque backdrop
    notification: colors.accent,
  },
  roundness: borderRadius.md,
  fonts: {
    ...DefaultTheme.fonts,
  },
};

// Export all theme elements
export const COLORS = colors;
export const PALETTE = palette;
export const TYPOGRAPHY = typography;
export const SPACING = spacing;
export const BORDER_RADIUS = borderRadius;
export const SHADOWS = shadows;

// Utility function to get a color with fallback
export const getColor = (colorName, fallback = colors.background) => {
  return colors[colorName] || fallback;
};

// Map legacy colors to new colors
export const mapLegacyColor = (legacyColor) => {
  const legacyColorMap = {
    mist: colors.background,
    sage: colors.primaryDark,
    almond: colors.accent,
    earth: colors.text,
    pine: colors.primary,
  };
  
  return legacyColorMap[legacyColor] || legacyColor;
}; 