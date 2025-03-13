import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Share, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { addToFavorites, removeFromFavorites } from '../../redux/slices/mantraSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Button from '../../components/Button';
import Header from '../../components/Header';
import GradientCard from '../../components/GradientCard';

const MantraDetailScreen = ({ route, navigation }) => {
  const { mantra } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { favorites } = useSelector((state) => state.mantra);
  
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFavorite = favorites.some(fav => fav.id === mantra.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(mantra.id));
    } else {
      dispatch(addToFavorites(mantra));
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${mantra.text}" - ${mantra.author || 'Unknown'}\n\nShared from Mantra App`,
      });
    } catch (error) {
      console.error('Error sharing mantra:', error);
    }
  };

  const handleAddToJournal = () => {
    navigation.navigate('AddJournal', {
      initialContent: `Reflecting on this mantra: "${mantra.text}"\n\n`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Mantra Detail" 
        showBackButton={true}
        rightIcon={isFavorite ? "heart" : "heart-outline"}
        onRightIconPress={toggleFavorite}
        useGradient={true}
      />
      
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <GradientCard style={styles.card}>
            <Card.Content>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{mantra.category.toUpperCase()}</Text>
              </View>
              
              <View style={styles.mantraContainer}>
                <MaterialCommunityIcons name="format-quote-open" size={24} color={COLORS.sereneBlue} style={styles.quoteIcon} />
                <Title style={styles.mantraText}>
                  <Text>{mantra.text}</Text>
                </Title>
                <MaterialCommunityIcons name="format-quote-close" size={24} color={COLORS.sereneBlue} style={[styles.quoteIcon, styles.quoteIconEnd]} />
              </View>
              
              <Paragraph style={styles.authorText}>
                <Text>— {mantra.author || 'Unknown'}</Text>
              </Paragraph>
            </Card.Content>
          </GradientCard>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <LinearGradient
                colors={isFavorite ? gradients.button : gradients.card}
                style={styles.actionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons 
                  name={isFavorite ? 'heart' : 'heart-outline'} 
                  size={28} 
                  color={isFavorite ? COLORS.softWhite : COLORS.warmGray} 
                />
                {isAnimating ? (
                  <View style={styles.animationOverlay}>
                    <MaterialCommunityIcons name="heart" size={40} color={COLORS.paleRose} />
                  </View>
                ) : null}
              </LinearGradient>
              <Text style={styles.actionText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <LinearGradient
                colors={gradients.card}
                style={styles.actionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="share-variant" size={28} color={COLORS.warmGray} />
              </LinearGradient>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToJournal}>
              <LinearGradient
                colors={gradients.card}
                style={styles.actionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="book-edit" size={28} color={COLORS.warmGray} />
              </LinearGradient>
              <Text style={styles.actionText}>Add to Journal</Text>
            </TouchableOpacity>
          </View>
          
          <GradientCard style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoTitle}>
                <Text>About This Mantra</Text>
              </Title>
              <Paragraph style={styles.infoText}>
                <Text>
                  This mantra is designed to help you focus on {mantra.category.toLowerCase()} and bring more positivity into your life. 
                  Repeat it daily for the best results.
                </Text>
              </Paragraph>
              
              <View style={styles.tipContainer}>
                <MaterialCommunityIcons name="lightbulb-on" size={24} color={COLORS.sereneBlue} />
                <Text style={styles.tipText}>
                  Try repeating this mantra during meditation or when you need a moment of calm.
                </Text>
              </View>
            </Card.Content>
          </GradientCard>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Random')}
            style={styles.randomButton}
            gradient={true}
          >
            <Text>Generate Another Mantra</Text>
          </Button>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softWhite,
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  categoryContainer: {
    backgroundColor: COLORS.sereneBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    marginBottom: SPACING.md,
  },
  categoryText: {
    color: COLORS.softWhite,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    fontSize: TYPOGRAPHY.fontSizes.xs,
  },
  mantraContainer: {
    marginBottom: SPACING.md,
    position: 'relative',
    paddingHorizontal: SPACING.sm,
  },
  quoteIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  quoteIconEnd: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  mantraText: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    lineHeight: TYPOGRAPHY.lineHeights.xxl,
    color: COLORS.warmGray,
    textAlign: 'center',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  authorText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontStyle: 'italic',
    color: COLORS.mutedLilac,
    textAlign: 'right',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    position: 'relative',
    ...SHADOWS.medium,
  },
  animationOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warmGray,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  infoCard: {
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    color: COLORS.warmGray,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    lineHeight: TYPOGRAPHY.lineHeights.md,
    color: COLORS.warmGray,
    marginBottom: SPACING.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.softLavender,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warmGray,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  randomButton: {
    marginTop: SPACING.md,
  },
});

export default MantraDetailScreen; 