import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { Text, Searchbar, ActivityIndicator, FAB, Dialog, Portal, Chip, Button as PaperButton, Divider, List, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

import { fetchJournalEntries, deleteJournalEntry, setSearchFilter, setMoodFilter, setDateRangeFilter, addTagFilter, removeTagFilter, clearFilters } from '../../redux/slices/journalSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Header from '../../components/Header';
import JournalCard from '../../components/JournalCard';
import Button from '../../components/Button';
import GradientCard from '../../components/GradientCard';

// Sample emojis for mood selection
const moodEmojis = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😎', label: 'Confident' },
];

const JournalScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { entries, filteredEntries, loading, filters } = useSelector((state) => state.journal);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDialog, setShowTagDialog] = useState(false);

  useEffect(() => {
    loadJournals();
  }, []);

  useEffect(() => {
    // Initialize local filter state from Redux
    setSearchQuery(filters.searchText);
    setSelectedMood(filters.mood);
    if (filters.dateRange) {
      setStartDate(filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : null);
      setEndDate(filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : null);
    }
    setSelectedTags(filters.tags);
  }, [filters]);

  const loadJournals = () => {
    dispatch(fetchJournalEntries());
  };

  const handleAddEntry = () => {
    navigation.navigate('AddJournal');
  };

  const handleViewEntry = (journal) => {
    navigation.navigate('JournalDetail', { journal });
  };

  const handleDeleteEntry = (id) => {
    setSelectedJournalId(id);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (selectedJournalId) {
      dispatch(deleteJournalEntry(selectedJournalId));
    }
    setDeleteDialogVisible(false);
    setSelectedJournalId(null);
  };

  const cancelDelete = () => {
    setDeleteDialogVisible(false);
    setSelectedJournalId(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(setSearchFilter(query));
  };

  const handleMoodSelect = (mood) => {
    if (selectedMood === mood.emoji) {
      setSelectedMood(null);
    } else {
      setSelectedMood(mood.emoji);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // If end date is not set or is before start date, set end date to start date
      if (!endDate || endDate < selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
    setShowTagDialog(false);
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const applyFilters = () => {
    // Clear existing filters first
    dispatch(clearFilters());
    
    // Apply search filter if exists
    if (searchQuery) {
      dispatch(setSearchFilter(searchQuery));
    }
    
    // Apply mood filter
    if (selectedMood) {
      dispatch(setMoodFilter(selectedMood));
    }
    
    // Apply date range filter
    if (startDate || endDate) {
      dispatch(setDateRangeFilter({
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null
      }));
    }
    
    // Apply tag filters
    selectedTags.forEach(tag => {
      dispatch(addTagFilter(tag));
    });
    
    // Close the modal
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setSelectedMood(null);
    setStartDate(null);
    setEndDate(null);
    setSelectedTags([]);
    // Don't close the modal
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    return format(date, 'MMM d, yyyy');
  };

  const renderJournalItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewEntry(item)}>
      <JournalCard 
        journal={item} 
        onDelete={() => handleDeleteEntry(item.id)}
      />
    </TouchableOpacity>
  );

  const areFiltersActive = () => {
    return selectedMood || startDate || endDate || selectedTags.length > 0 || searchQuery;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Journal" 
        rightIcon="filter-variant" 
        onRightIconPress={() => setShowFilterModal(true)} 
        useGradient={true}
      />
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search journals..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={COLORS.warmGray}
        />
        
        {areFiltersActive() ? (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>Active filters:</Text>
            <View style={styles.filterChipsContainer}>
              {searchQuery ? (
                <Chip 
                  style={styles.filterChip} 
                  onClose={() => handleSearch('')}
                  textStyle={{ color: COLORS.softWhite }}
                >
                  <Text>Search: {searchQuery}</Text>
                </Chip>
              ) : null}
              
              {selectedMood ? (
                <Chip 
                  style={styles.filterChip} 
                  onClose={() => dispatch(setMoodFilter(null))}
                  textStyle={{ color: COLORS.softWhite }}
                >
                  <Text>Mood: {selectedMood}</Text>
                </Chip>
              ) : null}
              
              {(startDate || endDate) ? (
                <Chip 
                  style={styles.filterChip} 
                  onClose={() => dispatch(setDateRangeFilter({ startDate: null, endDate: null }))}
                  textStyle={{ color: COLORS.softWhite }}
                >
                  <Text>Date: {startDate ? formatDate(startDate) : 'Any'} - {endDate ? formatDate(endDate) : 'Any'}</Text>
                </Chip>
              ) : null}
              
              {selectedTags.map(tag => (
                <Chip 
                  key={tag}
                  style={styles.filterChip} 
                  onClose={() => dispatch(removeTagFilter(tag))}
                  textStyle={{ color: COLORS.softWhite }}
                >
                  <Text>Tag: {tag}</Text>
                </Chip>
              ))}
              
              <TouchableOpacity onPress={() => dispatch(clearFilters())}>
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.sereneBlue} />
        </View>
      ) : filteredEntries.length > 0 ? (
        <FlatList
          data={filteredEntries}
          renderItem={renderJournalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="journal-outline" size={64} color={COLORS.mutedLilac} />
          <Text style={styles.emptyText}>No journal entries yet</Text>
          <Text style={styles.emptySubtext}>
            Start journaling to track your thoughts and feelings
          </Text>
          <Button
            mode="contained"
            onPress={handleAddEntry}
            style={styles.addButton}
            gradient={true}
          >
            Write First Entry
          </Button>
        </View>
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        color={COLORS.softWhite}
        onPress={handleAddEntry}
      />
      
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={cancelDelete} style={styles.dialog}>
          <Dialog.Title>
            <Text>Delete Journal Entry</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogContent}>Are you sure you want to delete this journal entry? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={cancelDelete} 
              mode="text"
            >
              Cancel
            </Button>
            <Button 
              onPress={confirmDelete} 
              mode="contained"
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View 
            style={styles.filterModalContent} 
            onStartShouldSetResponder={() => true}
          >
            <LinearGradient
              colors={gradients.primary}
              style={styles.filterModalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.filterModalTitle}>Filter Journal Entries</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.warmGray} />
              </TouchableOpacity>
            </LinearGradient>
            
            <ScrollView 
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterScrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.filterSectionTitle}>Mood</Text>
              <View style={styles.moodFilterContainer}>
                {moodEmojis.map((mood) => (
                  <TouchableOpacity
                    key={mood.emoji}
                    style={[
                      styles.moodOption,
                      selectedMood === mood.emoji ? styles.selectedMoodOption : null
                    ]}
                    onPress={() => handleMoodSelect(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodText,
                        selectedMood === mood.emoji ? styles.selectedMoodText : null
                      ]}
                    >
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Divider style={styles.filterDivider} />
              
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.datePickerWrapper}>
                  <Text style={styles.datePickerLabel}>Start Date</Text>
                  {Platform.OS === 'ios' ? (
                    <View style={styles.datePickerButton}>
                      <MaterialCommunityIcons name="calendar" size={20} color={COLORS.warmGray} />
                      <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleStartDateChange}
                        maximumDate={new Date()}
                        style={styles.iosDatePicker}
                      />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.datePickerButton}
                        onPress={() => setShowStartDatePicker(true)}
                      >
                        <MaterialCommunityIcons name="calendar" size={20} color={COLORS.warmGray} />
                        <Text style={styles.datePickerText}>
                          {startDate ? formatDate(startDate) : 'Select'}
                        </Text>
                      </TouchableOpacity>
                      {showStartDatePicker ? (
                        <DateTimePicker
                          value={startDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={handleStartDateChange}
                          maximumDate={new Date()}
                        />
                      ) : null}
                    </>
                  )}
                </View>
                
                <View style={styles.datePickerWrapper}>
                  <Text style={styles.datePickerLabel}>End Date</Text>
                  {Platform.OS === 'ios' ? (
                    <View style={styles.datePickerButton}>
                      <MaterialCommunityIcons name="calendar" size={20} color={COLORS.warmGray} />
                      <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                        minimumDate={startDate}
                        maximumDate={new Date()}
                        style={styles.iosDatePicker}
                      />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.datePickerButton}
                        onPress={() => setShowEndDatePicker(true)}
                      >
                        <MaterialCommunityIcons name="calendar" size={20} color={COLORS.warmGray} />
                        <Text style={styles.datePickerText}>
                          {endDate ? formatDate(endDate) : 'Select'}
                        </Text>
                      </TouchableOpacity>
                      {showEndDatePicker ? (
                        <DateTimePicker
                          value={endDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={handleEndDateChange}
                          minimumDate={startDate}
                          maximumDate={new Date()}
                        />
                      ) : null}
                    </>
                  )}
                </View>
              </View>
              
              <Divider style={styles.filterDivider} />
              
              <Text style={styles.filterSectionTitle}>Tags</Text>
              <View style={styles.tagsFilterContainer}>
                <View style={styles.selectedTagsContainer}>
                  {selectedTags.length > 0 ? (
                    selectedTags.map(tag => (
                      <Chip
                        key={tag}
                        style={styles.tagChip}
                        onClose={() => handleRemoveTag(tag)}
                      >
                        {tag}
                      </Chip>
                    ))
                  ) : (
                    <Text style={styles.noTagsText}>No tags selected</Text>
                  )}
                </View>
                
                <Button 
                  mode="outlined" 
                  onPress={() => setShowTagDialog(true)}
                  style={styles.addTagButton}
                  icon="tag-plus"
                >
                  Add Tag
                </Button>
              </View>
            </ScrollView>
            
            <View style={styles.filterActions}>
              <Button 
                mode="outlined" 
                onPress={resetFilters}
                style={styles.resetButton}
              >
                Reset
              </Button>
              <Button 
                mode="contained" 
                onPress={applyFilters}
                style={styles.applyButton}
                gradient={true}
              >
                Apply Filters
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
      <Portal>
        <Dialog
          visible={showTagDialog}
          onDismiss={() => setShowTagDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            <Text>Add Tag</Text>
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tag"
              value={tagInput}
              onChangeText={setTagInput}
              style={styles.tagInput}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setShowTagDialog(false)} 
              mode="text"
              labelStyle={styles.dialogButtonText}
            >
              Cancel
            </Button>
            <Button onPress={handleAddTag} mode="contained">
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softWhite,
  },
  searchContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchBar: {
    backgroundColor: COLORS.softWhite,
    borderWidth: 1,
    borderColor: COLORS.mutedLilac,
    elevation: 0,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: 4,
  },
  searchInput: {
    color: COLORS.warmGray,
  },
  activeFiltersContainer: {
    marginTop: SPACING.sm,
  },
  activeFiltersText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.warmGray,
    marginBottom: 4,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.sereneBlue,
  },
  clearFiltersText: {
    color: COLORS.mutedLilac,
    fontSize: TYPOGRAPHY.fontSizes.xs,
    textDecorationLine: 'underline',
    marginLeft: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.mutedLilac,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  addButton: {
    marginTop: SPACING.md,
  },
  fab: {
    position: 'absolute',
    margin: SPACING.md,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.sereneBlue,
    borderRadius: 30,
    ...SHADOWS.medium,
  },
  dialog: {
    backgroundColor: COLORS.softWhite,
    borderRadius: BORDER_RADIUS.md,
  },
  dialogTitle: {
    color: COLORS.warmGray,
    fontSize: TYPOGRAPHY.fontSizes.lg,
  },
  dialogContent: {
    color: COLORS.warmGray,
    fontSize: TYPOGRAPHY.fontSizes.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContent: {
    backgroundColor: COLORS.softWhite,
    borderRadius: BORDER_RADIUS.md,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mutedLilac,
  },
  filterModalTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
  },
  filterScrollView: {
    maxHeight: '70%',
  },
  filterScrollViewContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  filterSectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.warmGray,
    marginBottom: SPACING.sm,
  },
  moodFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  moodOption: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.mutedLilac,
    backgroundColor: COLORS.softWhite,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    ...SHADOWS.light,
  },
  selectedMoodOption: {
    backgroundColor: COLORS.sereneBlue,
    borderColor: COLORS.sereneBlue,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warmGray,
    marginTop: 4,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  selectedMoodText: {
    color: COLORS.softWhite,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
  filterDivider: {
    backgroundColor: COLORS.mutedLilac,
    height: 1,
    marginVertical: SPACING.xl,
    opacity: 0.5,
  },
  dateRangeContainer: {
    flexDirection: 'column',
    marginBottom: SPACING.md,
  },
  datePickerWrapper: {
    marginBottom: SPACING.md,
  },
  datePickerLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warmGray,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.mutedLilac,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.softWhite,
    ...SHADOWS.light,
  },
  datePickerText: {
    marginLeft: 10,
    color: COLORS.warmGray,
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
  iosDatePicker: {
    flex: 1,
    height: 40,
  },
  tagsFilterContainer: {
    marginBottom: SPACING.md,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tagChip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.paleRose,
    paddingHorizontal: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  noTagsText: {
    color: COLORS.mutedLilac,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  addTagButton: {
    borderColor: COLORS.sereneBlue,
    borderRadius: BORDER_RADIUS.md,
  },
  tagInput: {
    backgroundColor: COLORS.softWhite,
    marginBottom: SPACING.md,
    borderColor: COLORS.mutedLilac,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.mutedLilac,
  },
  resetButton: {
    flex: 1,
    marginRight: SPACING.sm,
    borderColor: COLORS.sereneBlue,
    borderRadius: BORDER_RADIUS.md,
  },
  applyButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
  },
  dialogButtonText: {
    color: COLORS.sereneBlue,
  },
});

export default JournalScreen; 