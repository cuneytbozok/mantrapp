import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, Chip, useTheme, Dialog, Portal, TextInput, List, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { saveJournalEntry, deleteJournalEntry } from '../../redux/slices/journalSlice';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button';
import Header from '../../components/Header';

const JournalDetailScreen = ({ route, navigation }) => {
  const { journal } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(journal.text);
  const [editedMood, setEditedMood] = useState(journal.mood);
  const [editedDate, setEditedDate] = useState(new Date(journal.date));
  const [editedTags, setEditedTags] = useState(journal.tags || []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const date = new Date(journal.date);
  const formattedDate = format(date, 'MMMM d, yyyy');
  const formattedTime = format(date, 'h:mm a');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedDate(selectedDate);
    }
  };
  
  const formatDateForEdit = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()]);
      setTagInput('');
      setShowTagDialog(false);
    } else if (editedTags.includes(tagInput.trim())) {
      Alert.alert('Duplicate Tag', 'This tag already exists');
    } else {
      Alert.alert('Invalid Tag', 'Please enter a valid tag');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTags(editedTags.filter(t => t !== tagToRemove));
  };

  const handleSaveChanges = async () => {
    if (!editedText.trim()) {
      Alert.alert('Error', 'Journal entry cannot be empty');
      return;
    }
    
    setIsSaving(true);
    
    const updatedJournal = {
      ...journal,
      text: editedText,
      mood: editedMood,
      date: editedDate.toISOString(),
      tags: editedTags,
    };
    
    try {
      await dispatch(saveJournalEntry(updatedJournal)).unwrap();
      setIsEditing(false);
      
      // Update the journal in the route params to reflect changes
      navigation.setParams({ journal: updatedJournal });
      setIsSaving(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteJournalEntry(journal.id)).unwrap();
      setShowDeleteDialog(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete journal entry. Please try again.');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const moodEmojis = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🙏', label: 'Grateful' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Journal Entry" 
        showBackButton={true}
        rightIcon={isEditing ? "content-save" : "pencil"}
        onRightIconPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {isEditing ? (
          <Card style={styles.card}>
            <LinearGradient
              colors={[COLORS.softWhite, COLORS.softLavender]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <Card.Content>
                  <View style={styles.dateSelector}>
                    <List.Item
                      title={() => <Text>Entry Date</Text>}
                      description={() => <Text>{formatDateForEdit(editedDate)}</Text>}
                      left={props => <List.Icon {...props} icon="calendar" color={COLORS.earth} />}
                      right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.earth} />}
                      onPress={() => setShowDatePicker(true)}
                      style={styles.dateItem}
                    />
                    <Divider style={styles.divider} />
                    
                    {showDatePicker ? (
                      <DateTimePicker
                        value={editedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                      />
                    ) : null}
                  </View>
                  
                  <View style={styles.moodSelector}>
                    <Text style={styles.moodLabel}>Mood:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScrollView}>
                      {moodEmojis.map((item) => (
                        <TouchableOpacity
                          key={item.emoji}
                          style={[
                            styles.moodOption,
                            editedMood === item.emoji ? styles.selectedMoodOption : null,
                          ]}
                          onPress={() => setEditedMood(item.emoji)}
                        >
                          <Text style={styles.moodEmoji}>{item.emoji}</Text>
                          <Text
                            style={[
                              styles.moodText,
                              editedMood === item.emoji ? styles.selectedMoodText : null,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  
                  <TextInput
                    label="Journal Entry"
                    value={editedText}
                    onChangeText={setEditedText}
                    style={styles.contentInput}
                    mode="outlined"
                    multiline
                    numberOfLines={10}
                    outlineColor={COLORS.sage}
                    activeOutlineColor={COLORS.earth}
                  />
                  
                  <View style={styles.tagsSection}>
                    <View style={styles.tagsHeader}>
                      <Text style={styles.tagsLabel}>Tags</Text>
                      <Button 
                        mode="text" 
                        onPress={() => setShowTagDialog(true)}
                        icon="tag-plus"
                        style={styles.addTagButton}
                      >
                        Add Tag
                      </Button>
                    </View>
                    
                    {editedTags.length > 0 ? (
                      <View style={styles.tagsContainer}>
                        {editedTags.map(tagItem => (
                          <Chip
                            key={tagItem}
                            style={styles.tag}
                            textStyle={styles.tagText}
                            onClose={() => handleRemoveTag(tagItem)}
                          >
                            {tagItem}
                          </Chip>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noTagsText}>No tags added yet</Text>
                    )}
                  </View>
                  
                  <View style={styles.editActions}>
                    <Button
                      mode="outlined"
                      onPress={() => setIsEditing(false)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSaveChanges}
                      style={styles.saveButton}
                      loading={isSaving}
                      disabled={isSaving || !editedText.trim()}
                    >
                      Save Changes
                    </Button>
                  </View>
                </Card.Content>
              </View>
            </LinearGradient>
          </Card>
        ) : (
          <Card style={styles.card}>
            <LinearGradient
              colors={[COLORS.softWhite, COLORS.softLavender]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <View style={styles.dateContainer}>
                      <MaterialCommunityIcons name="calendar" size={16} color={COLORS.sage} />
                      <Text style={styles.dateText}>{formattedDate}</Text>
                      <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.sage} style={styles.timeIcon} />
                      <Text style={styles.dateText}>{formattedTime}</Text>
                    </View>
                    <View style={styles.moodContainer}>
                      <Text style={styles.moodEmoji}>{journal.mood}</Text>
                    </View>
                  </View>
                  
                  <Paragraph style={styles.journalText}>
                    {journal.text}
                  </Paragraph>
                  
                  {journal.tags && journal.tags.length > 0 ? (
                    <View style={styles.tagsViewContainer}>
                      <Text style={styles.tagsViewLabel}>Tags:</Text>
                      <View style={styles.tagsViewList}>
                        {journal.tags.map(tag => (
                          <Chip
                            key={tag}
                            style={styles.viewTag}
                            textStyle={styles.viewTagText}
                          >
                            {tag}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </Card.Content>
              </View>
            </LinearGradient>
          </Card>
        )}
        
        {!isEditing ? (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
              icon="pencil"
            >
              Edit
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowDeleteDialog(true)}
              style={styles.deleteButton}
              icon="delete"
            >
              Delete
            </Button>
          </View>
        ) : null}
      </ScrollView>
      
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            <Text>Delete Entry</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setShowDeleteDialog(false)} 
              mode="text"
              labelStyle={styles.dialogButtonText}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleDelete} 
              mode="contained"
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Portal>
        <Dialog
          visible={showTagDialog}
          onDismiss={() => setShowTagDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            <Text>Add a Tag</Text>
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tag"
              value={tagInput}
              onChangeText={setTagInput}
              style={styles.tagInput}
              mode="outlined"
              outlineColor={COLORS.sage}
              activeOutlineColor={COLORS.earth}
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  cardContent: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: COLORS.warmGray,
    marginLeft: 8,
  },
  moodText: {
    fontSize: 12,
    color: COLORS.warmGray,
    marginTop: 4,
  },
  journalText: {
    fontSize: 18,
    color: COLORS.warmGray,
    lineHeight: 26,
    marginBottom: 16,
  },
  editInput: {
    backgroundColor: COLORS.softWhite,
    borderColor: COLORS.mutedLilac,
    borderRadius: 16,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.paleRose,
    borderRadius: 16,
  },
  tagText: {
    color: COLORS.warmGray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    borderColor: COLORS.sereneBlue,
    borderRadius: 16,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#FF6B6B',
    borderRadius: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: COLORS.sereneBlue,
    borderRadius: 16,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: COLORS.mutedLilac,
    borderRadius: 16,
  },
  editingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmGray,
    marginBottom: 8,
  },
  moodSelector: {
    marginBottom: 16,
  },
  moodScrollView: {
    marginBottom: 8,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.mutedLilac,
    backgroundColor: COLORS.softWhite,
    marginRight: 10,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedMoodOption: {
    backgroundColor: COLORS.sereneBlue,
    borderColor: COLORS.sereneBlue,
  },
  moodEmoji: {
    fontSize: 24,
  },
  selectedMoodText: {
    color: COLORS.softWhite,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.mutedLilac,
    borderRadius: 16,
    backgroundColor: COLORS.softWhite,
    marginBottom: 16,
  },
  datePickerText: {
    marginLeft: 8,
    color: COLORS.warmGray,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addTagButton: {
    borderColor: COLORS.sereneBlue,
  },
  tagInput: {
    backgroundColor: COLORS.softWhite,
    borderColor: COLORS.mutedLilac,
    borderRadius: 8,
  },
  dialog: {
    backgroundColor: COLORS.softWhite,
    borderRadius: 20,
  },
  dialogTitle: {
    color: COLORS.warmGray,
  },
  dialogContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  dialogText: {
    color: COLORS.warmGray,
    fontSize: 16,
    lineHeight: 24,
  },
  dialogButtonText: {
    color: COLORS.sereneBlue,
  },
  deleteDialogButton: {
    color: '#FF6B6B',
  },
  dateSelector: {
    marginBottom: 16,
  },
  dateItem: {
    padding: 0,
  },
  divider: {
    backgroundColor: COLORS.sage,
    height: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodContainer: {
    backgroundColor: COLORS.mist,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeIcon: {
    marginLeft: 12,
  },
  tagsViewContainer: {
    marginTop: 8,
  },
  tagsViewLabel: {
    fontSize: 14,
    color: COLORS.earth,
    marginBottom: 8,
  },
  tagsViewList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewTag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.sage,
  },
  viewTagText: {
    color: COLORS.mist,
  },
  moodLabel: {
    fontSize: 16,
    color: COLORS.earth,
    marginBottom: 8,
  },
  contentInput: {
    backgroundColor: COLORS.mist,
    marginBottom: 16,
  },
  noTagsText: {
    color: COLORS.sage,
    fontStyle: 'italic',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default JournalDetailScreen; 