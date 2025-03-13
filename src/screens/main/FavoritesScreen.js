import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Chip, Searchbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { removeFromFavorites } from '../../redux/slices/mantraSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import MantraCard from '../../components/MantraCard';
import Header from '../../components/Header';
import { getCategories } from '../../api/mantraApi';

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Get favorites from Redux store
  const { favorites } = useSelector((state) => state.mantra);

  // Load categories
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const handleRemoveFromFavorites = (mantra) => {
    dispatch(removeFromFavorites(mantra.id));
  };

  const handleCategoryFilter = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory 
      ? favorite.category === selectedCategory 
      : true;
    return matchesSearch && matchesCategory;
  });

  const renderFavoriteItem = ({ item }) => (
    <MantraCard 
      mantra={item} 
      onFavorite={handleRemoveFromFavorites} 
      isFavorite={true} 
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Favorite Mantras" 
        useGradient={true}
      />
      
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search favorites"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              iconColor={COLORS.warmGray}
            />
          </View>

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollView}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onPress={() => handleCategoryFilter(category)}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.selectedFilterChip,
                  ]}
                  textStyle={[
                    styles.filterChipText,
                    selectedCategory === category && styles.selectedFilterChipText,
                  ]}
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <Divider style={styles.divider} />

          {filteredFavorites.length > 0 ? (
            <FlatList
              data={filteredFavorites}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={COLORS.sereneBlue} />
              <Text style={styles.emptyText}>No favorites found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || selectedCategory
                  ? 'Try adjusting your filters'
                  : 'Add mantras to your favorites to see them here'}
              </Text>
            </View>
          )}
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
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchBar: {
    backgroundColor: COLORS.softWhite,
    borderWidth: 1,
    borderColor: COLORS.paleRose,
    elevation: 0,
    ...SHADOWS.light,
  },
  searchInput: {
    color: COLORS.warmGray,
    fontSize: TYPOGRAPHY.fontSizes.md,
  },
  categoriesContainer: {
    paddingVertical: SPACING.sm,
  },
  categoriesScrollView: {
    paddingHorizontal: SPACING.md,
  },
  filterChip: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.softWhite,
    ...SHADOWS.light,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.sereneBlue,
  },
  filterChipText: {
    color: COLORS.warmGray,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  selectedFilterChipText: {
    color: COLORS.softWhite,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
  divider: {
    backgroundColor: COLORS.paleRose,
    height: 1,
    marginVertical: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
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
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
});

export default FavoritesScreen; 