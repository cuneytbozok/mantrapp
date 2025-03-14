import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/clerk-expo';

import { fetchMantrasSuccess, addToFavorites, removeFromFavorites } from '../../redux/slices/mantraSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import MantraCard from '../../components/MantraCard';
import Header from '../../components/Header';
import GradientCard from '../../components/GradientCard';
import { generateMantra } from '../../api/mantraApi';
import Button from '../../components/Button';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mantras, favorites, loading } = useSelector((state) => state.mantra);
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyMantra, setDailyMantra] = useState(null);
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

  // Debug user data
  useEffect(() => {
    console.log('HomeScreen - User data from Redux:', JSON.stringify(user));
    if (isUserLoaded) {
      console.log('HomeScreen - Clerk user data:', JSON.stringify({
        firstName: clerkUser?.firstName,
        lastName: clerkUser?.lastName,
        isLoaded: isUserLoaded
      }));
    } else {
      console.log('HomeScreen - Clerk user not loaded yet');
    }
  }, [user, clerkUser, isUserLoaded]);

  // Check if user profile needs to be updated
  useEffect(() => {
    if (isUserLoaded && clerkUser && user && (!user.name || !user.surname)) {
      // Just log that the user profile is incomplete
      console.log('User profile is incomplete. Name or surname is missing.');
    }
  }, [isUserLoaded, clerkUser, user]);

  useEffect(() => {
    if (mantras && mantras.length > 0 && !dailyMantra) {
      // Select a random mantra for the daily feature
      const randomIndex = Math.floor(Math.random() * mantras.length);
      setDailyMantra(mantras[randomIndex]);
    }
  }, [mantras]);

  // Add a fallback if mantras are empty or loading takes too long
  useEffect(() => {
    // Set a timeout to provide a fallback mantra if loading takes too long
    const timer = setTimeout(() => {
      if (!dailyMantra) {
        setDailyMantra({
          id: 'default',
          text: 'Be present in every moment and find peace within yourself.',
          category: 'Mindfulness'
        });
      }
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timer);
  }, [dailyMantra]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const newMantras = await generateMantra(10);
      dispatch(fetchMantrasSuccess(newMantras));
      
      // Update daily mantra
      const randomIndex = Math.floor(Math.random() * newMantras.length);
      setDailyMantra(newMantras[randomIndex]);
    } catch (error) {
      console.error('Error refreshing mantras:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFavoriteToggle = (mantra) => {
    const isFavorite = favorites.some(fav => fav.id === mantra.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(mantra.id));
    } else {
      dispatch(addToFavorites(mantra));
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <MantraCard 
        mantra={item} 
        onFavorite={handleFavoriteToggle}
        isFavorite={isFavorite}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Header 
          title="Mantra App" 
          rightIcon="bell-outline"
          onRightIconPress={() => navigation.navigate('Notifications')}
        />
        
        <FlatList
          data={mantras || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>
                Welcome back, {isUserLoaded && clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : (user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Friend')}
              </Text>
              
              {dailyMantra ? (
                <GradientCard 
                  style={styles.dailyCard}
                  gradientColors={gradients.cardHighlight}
                  elevated={true}
                >
                  <View>
                    <View style={styles.dailyLabelContainer}>
                      <LinearGradient
                        colors={gradients.accent}
                        style={styles.dailyLabel}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.dailyLabelText}>Today's Mantra</Text>
                      </LinearGradient>
                    </View>
                    
                    <Text style={styles.dailyMantraText}>
                      "{dailyMantra.text}"
                    </Text>
                    
                    <View style={styles.dailyMantraFooter}>
                      <Text style={styles.categoryText}>
                        {dailyMantra.category}
                      </Text>
                      
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => handleFavoriteToggle(dailyMantra)}
                        >
                          <MaterialCommunityIcons 
                            name={favorites.some(fav => fav.id === dailyMantra.id) ? "heart" : "heart-outline"} 
                            size={24} 
                            color={favorites.some(fav => fav.id === dailyMantra.id) ? COLORS.accent : COLORS.textSecondary} 
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => navigation.navigate('MantraDetail', { mantra: dailyMantra })}
                        >
                          <MaterialCommunityIcons 
                            name="arrow-right" 
                            size={24} 
                            color={COLORS.textSecondary} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </GradientCard>
              ) : (
                <GradientCard 
                  style={styles.dailyCard}
                  gradientColors={gradients.cardHighlight}
                  elevated={true}
                >
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your daily mantra...</Text>
                    <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />
                  </View>
                </GradientCard>
              )}
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore Mantras</Text>
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('Random')}
                >
                  <Text>Random</Text>
                </Button>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <Text style={styles.emptyText}>No mantras found. Pull down to refresh.</Text>
              )}
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    padding: SPACING.md,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  dailyCard: {
    marginBottom: SPACING.lg,
  },
  dailyLabelContainer: {
    marginBottom: SPACING.sm,
  },
  dailyLabel: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    alignSelf: 'flex-start',
  },
  dailyLabelText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textLight,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  dailyMantraText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeights.xl,
    marginBottom: SPACING.md,
  },
  dailyMantraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.circle,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  loadingIndicator: {
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen; 