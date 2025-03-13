import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, gradients } from '../constants/theme';

/**
 * A reusable card component with gradient background
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional styles for the card
 * @param {Array} props.gradientColors - Custom gradient colors
 * @param {Object} props.gradientStart - Start point for gradient
 * @param {Object} props.gradientEnd - End point for gradient
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Object} props.contentStyle - Additional styles for the card content
 * @param {Boolean} props.elevated - Whether to apply elevated shadow style
 */
const GradientCard = ({
  children,
  style,
  gradientColors = gradients.card,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  onPress,
  contentStyle,
  elevated = false,
  ...props
}) => {
  return (
    <Card
      style={[
        styles.card, 
        elevated ? styles.elevatedCard : null,
        style
      ]}
      onPress={onPress}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={gradientStart}
        end={gradientEnd}
      >
        <Card.Content style={[styles.content, contentStyle]}>
          {children}
        </Card.Content>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  elevatedCard: {
    ...SHADOWS.heavy,
    transform: [{ translateY: -2 }],
  },
  gradient: {
    borderRadius: BORDER_RADIUS.md,
  },
  content: {
    padding: SPACING.md,
  },
});

export default GradientCard; 