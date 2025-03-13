import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, TextInput, Chip, useTheme, Dialog, Portal, List, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { nanoid } from '@reduxjs/toolkit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { saveJournalEntry } from '../../redux/slices/journalSlice';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button';
import Header from '../../components/Header';

const AddJournalScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [text, setText] = useState('');
  const [mood, setMood] = useState('😊');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
      setShowTagDialog(false);
    } else if (tags.includes(tag.trim())) {
      Alert.alert('Duplicate Tag', 'This tag already exists');
    } else {
      Alert.alert('Invalid Tag', 'Please enter a valid tag');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEntryDate(selectedDate);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Journal entry cannot be empty');
      return;
    }
    
    setIsSaving(true);
    
    const newEntry = {
      id: nanoid(),
      text,
      mood,
      tags,
      date: entryDate.toISOString(),
    };
    
    try {
      await dispatch(saveJournalEntry(newEntry)).unwrap();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
      setIsSaving(false);
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
        title="New Journal Entry" 
        showBackButton={true}
        rightIcon="content-save"
        onRightIconPress={handleSave}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <LinearGradient
            colors={[COLORS.softWhite, COLORS.softLavender]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Card.Content>
              <View style={styles.dateSelector}>
                <List.Item
                  title={() => <Text>Entry Date</Text>}
                  description={() => <Text>{formatDate(entryDate)}</Text>}
                  left={props => <List.Icon {...props} icon="calendar" color={COLORS.earth} />}
                  right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.earth} />}
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateItem}
                />
                <Divider style={styles.divider} />
                
                {showDatePicker ? (
                  <DateTimePicker
                    value={entryDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                ) : null}
              </View>
              
              <View style={styles.moodSelector}>
                <Text style={styles.moodLabel}>How are you feeling?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScrollView}>
                  {moodEmojis.map((item) => (
                    <TouchableOpacity
                      key={item.emoji}
                      style={[
                        styles.moodOption,
                        mood === item.emoji ? styles.selectedMoodOption : null,
                      ]}
                      onPress={() => setMood(item.emoji)}
                    >
                      <Text style={styles.moodEmoji}>{item.emoji}</Text>
                      <Text
                        style={[
                          styles.moodText,
                          mood === item.emoji ? styles.selectedMoodText : null,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <TextInput
                label="Write your thoughts..."
                value={text}
                onChangeText={setText}
                style={styles.journalInput}
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
                
                {tags.length > 0 ? (
                  <View style={styles.tagsContainer}>
                    {tags.map(tagItem => (
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
            </Card.Content>
          </LinearGradient>
        </Card>
        
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={isSaving}
          disabled={isSaving || !text.trim()}
        >
          Save Journal Entry
        </Button>
      </ScrollView>
      
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
              value={tag}
              onChangeText={setTag}
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
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
  },
  dateSelector: {
    marginBottom: 16,
  },
  dateItem: {
    padding: 0,
  },
  divider: {
    backgroundColor: COLORS.mutedLilac,
    height: 1,
    opacity: 0.5,
  },
  moodSelector: {
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 16,
    color: COLORS.warmGray,
    marginBottom: 8,
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
  moodText: {
    fontSize: 12,
    color: COLORS.warmGray,
    marginTop: 4,
  },
  selectedMoodText: {
    color: COLORS.softWhite,
  },
  journalInput: {
    backgroundColor: COLORS.softWhite,
    marginBottom: 16,
    borderColor: COLORS.mutedLilac,
    borderRadius: 16,
  },
  tagsSection: {
    marginTop: 8,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsLabel: {
    fontSize: 16,
    color: COLORS.warmGray,
  },
  addTagButton: {
    marginVertical: 0,
    borderColor: COLORS.sereneBlue,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  noTagsText: {
    color: COLORS.mutedLilac,
    fontStyle: 'italic',
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
  dialogButtonText: {
    color: COLORS.sereneBlue,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: COLORS.sereneBlue,
    borderRadius: 16,
  },
});

export default AddJournalScreen; 