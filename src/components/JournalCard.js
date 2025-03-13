import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY, SPACING, gradients } from '../constants/theme';

const JournalCard = ({ journal }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('JournalDetail', { journal });
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get mood emoji based on mood value
  const getMoodEmoji = (mood) => {
    const moods = {
      'Great': '😊',
      'Good': '🙂',
      'Okay': '😐',
      'Bad': '😕',
      'Terrible': '😢'
    };
    return moods[mood] || '😐';
  };

  return (
    <Card 
      style={styles.card}
      onPress={handlePress}
    >
      <LinearGradient
        colors={gradients.card}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerContainer}>
            <View style={styles.dateContainer}>
              <LinearGradient
                colors={gradients.accent}
                style={styles.dateTag}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.dateText}>{formatDate(journal.date)}</Text>
              </LinearGradient>
            </View>
            <View style={styles.moodContainer}>
              <Text style={styles.moodText}>
                {journal.mood}
              </Text>
            </View>
          </View>
          
          <View style={styles.contentContainer}>
            <Text 
              style={styles.entryText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {journal.text}
            </Text>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('JournalDetail', { journal })}
            >
              <LinearGradient
                colors={gradients.button}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <IconButton
                  icon="pencil"
                  iconColor={COLORS.buttonText}
                  size={20}
                  style={styles.icon}
                />
              </LinearGradient>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  moodContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    ...SHADOWS.light,
  },
  moodText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  contentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.inset,
  },
  entryText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeights.md,
    fontWeight: TYPOGRAPHY.fontWeights.regular,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.circle,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  actionGradient: {
    borderRadius: BORDER_RADIUS.circle,
  },
  icon: {
    margin: 0,
  },
});

export default JournalCard; 