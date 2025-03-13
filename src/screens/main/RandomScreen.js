import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { addToFavorites, removeFromFavorites } from '../../redux/slices/mantraSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import MantraCard from '../../components/MantraCard';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { generateMantra } from '../../api/mantraApi';

const { width } = Dimensions.get('window');

const RandomScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { favorites } = useSelector((state) => state.mantra);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(null);
  const [dailyLimit] = useState(3);
  const [usedToday, setUsedToday] = useState(0);

  useEffect(() => {
    if (currentMantra) {
      animateCard();
    }
  }, [currentMantra]);

  const animateCard = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

  const handleGenerateMantra = async () => {
    if (usedToday >= dailyLimit) {
      // User has reached daily limit
      return;
    }
    
    setIsGenerating(true);
    resetAnimation();
    
    try {
      const newMantra = await generateMantra();
      setCurrentMantra(newMantra);
      setUsedToday(prev => prev + 1);
    } catch (error) {
      console.error('Error generating mantra:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (mantra) => {
    if (!mantra) return;
    
    const isFavorite = favorites.some(fav => fav.id === mantra.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(mantra.id));
    } else {
      dispatch(addToFavorites(mantra));
    }
  };

  const isFavorite = currentMantra && favorites.some(fav => fav.id === currentMantra.id);
  const remainingMantras = dailyLimit - usedToday;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Random Mantra" rightIcon="shuffle-variant" useGradient={true} />
      
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {currentMantra ? (
            <Animated.View
              style={[
                styles.cardContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <MantraCard 
                mantra={currentMantra} 
                onFavorite={toggleFavorite} 
                isFavorite={isFavorite} 
              />
            </Animated.View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="meditation" size={64} color={COLORS.sereneBlue} />
              <Text style={styles.emptyText}>Generate your first random mantra</Text>
              <Text style={styles.emptySubText}>
                Tap the button below to receive a mantra for inspiration
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleGenerateMantra}
              style={styles.generateButton}
              loading={isGenerating}
              disabled={isGenerating || usedToday >= dailyLimit}
              gradient={true}
            >
              <Text>Generate New Mantra</Text>
            </Button>
            
            {dailyLimit > 0 ? (
              <Text style={styles.limitText}>
                {remainingMantras} {remainingMantras === 1 ? 'mantra' : 'mantras'} remaining today
              </Text>
            ) : null}
          </View>
        </View>
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
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: '80%',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  generateButton: {
    width: '100%',
    paddingVertical: SPACING.sm,
  },
  limitText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
});

export default RandomScreen; 