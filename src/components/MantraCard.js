import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY, SPACING, gradients } from '../constants/theme';

const MantraCard = ({ mantra, onFavorite, isFavorite }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('MantraDetail', { mantra });
  };

  return (
    <Card 
      style={styles.card}
      onPress={handlePress}
    >
      <LinearGradient
        colors={gradients.cardHighlight}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.categoryContainer}>
            <LinearGradient
              colors={gradients.categoryTag}
              style={styles.categoryTag}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.categoryText}>{mantra.category}</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.mantraText}>{mantra.text}</Text>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              onPress={() => onFavorite(mantra)}
              style={styles.actionButton}
            >
              <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                iconColor={isFavorite ? COLORS.accent : COLORS.textSecondary}
                size={24}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <IconButton
                icon="share-outline"
                iconColor={COLORS.textSecondary}
                size={24}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: BORDER_RADIUS.md,
  },
  cardContent: {
    padding: SPACING.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  categoryTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.categoryTagText,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  mantraText: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: TYPOGRAPHY.lineHeights.lg,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    ...SHADOWS.light,
    borderRadius: BORDER_RADIUS.circle,
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.surface,
  },
  icon: {
    margin: 0,
  },
});

export default MantraCard; 