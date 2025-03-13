import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Text, Card, Divider, List, Button as PaperButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { registerUser } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Header from '../../components/Header';
import Button from '../../components/Button';
import GradientCard from '../../components/GradientCard';

const CategorySelectionScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { motivationCategories } = useSelector((state) => state.auth);
  const { userData } = route.params;
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFocus, setSelectedFocus] = useState(null);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleComplete = () => {
    if (!selectedCategoryId) {
      alert('Please select a category');
      return;
    }
    
    // Register user with selected category and notification time
    const completeUserData = {
      ...userData,
      categories: [selectedCategoryId],
      focus: selectedFocus || 'general',
      notificationTime: formatTime(notificationTime),
    };
    
    dispatch(registerUser(completeUserData));
  };
  
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Select a category';
    const category = motivationCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowCategoryModal(false);
    // Reset focus when category changes
    setSelectedFocus(null);
  };
  
  // Focus options based on selected category
  const getFocusOptions = () => {
    if (!selectedCategoryId) return [];
    
    const focusMap = {
      1: [ // Career
        { id: 'leadership', name: 'Leadership' },
        { id: 'productivity', name: 'Productivity' },
        { id: 'work-life-balance', name: 'Work-Life Balance' },
        { id: 'success', name: 'Success' }
      ],
      2: [ // Parenting
        { id: 'patience', name: 'Patience' },
        { id: 'understanding', name: 'Understanding' },
        { id: 'guidance', name: 'Guidance' }
      ],
      3: [ // Healthy Living
        { id: 'nutrition', name: 'Nutrition' },
        { id: 'exercise', name: 'Exercise' },
        { id: 'mindfulness', name: 'Mindfulness' },
        { id: 'sleep', name: 'Sleep' }
      ],
      4: [ // Self-confidence
        { id: 'self-love', name: 'Self-Love' },
        { id: 'courage', name: 'Courage' },
        { id: 'assertiveness', name: 'Assertiveness' }
      ],
      5: [ // Romantic Relationships
        { id: 'communication', name: 'Communication' },
        { id: 'trust', name: 'Trust' },
        { id: 'intimacy', name: 'Intimacy' }
      ]
    };
    
    return focusMap[selectedCategoryId] || [];
  };
  
  const getFocusName = (focusId) => {
    if (!focusId) return 'Select a focus';
    const focusOptions = getFocusOptions();
    const focus = focusOptions.find(f => f.id === focusId);
    return focus ? focus.name : 'General';
  };
  
  const handleSelectFocus = (focusId) => {
    setSelectedFocus(focusId);
    setShowFocusModal(false);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Preferences" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
        useGradient={true}
      />
      
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <GradientCard style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Select Your Preferences</Text>
              <Text style={styles.subtitle}>
                Choose a category and notification time for your daily mantras
              </Text>
              
              <View style={styles.preferenceSection}>
                <List.Item
                  title="Category"
                  titleStyle={styles.listItemTitle}
                  description={getCategoryName(selectedCategoryId)}
                  descriptionStyle={styles.listItemDescription}
                  left={props => <List.Icon {...props} icon="tag" color={COLORS.sereneBlue} />}
                  right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                  onPress={() => setShowCategoryModal(true)}
                  style={styles.preferenceItem}
                />
                
                <Divider style={styles.divider} />
                
                {selectedCategoryId && (
                  <>
                    <List.Item
                      title="Focus"
                      titleStyle={styles.listItemTitle}
                      description={getFocusName(selectedFocus)}
                      descriptionStyle={styles.listItemDescription}
                      left={props => <List.Icon {...props} icon="target" color={COLORS.sereneBlue} />}
                      right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                      onPress={() => setShowFocusModal(true)}
                      style={styles.preferenceItem}
                    />
                    
                    <Divider style={styles.divider} />
                  </>
                )}
                
                <List.Item
                  title="Notification Time"
                  titleStyle={styles.listItemTitle}
                  description={`Daily mantras at ${formatTime(notificationTime)}`}
                  descriptionStyle={styles.listItemDescription}
                  left={props => <List.Icon {...props} icon="clock" color={COLORS.sereneBlue} />}
                  right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                  onPress={() => setShowTimePicker(true)}
                  style={styles.preferenceItem}
                />
                
                {showTimePicker && (
                  <DateTimePicker
                    value={notificationTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            </Card.Content>
          </GradientCard>
          
          <Button
            mode="contained"
            onPress={handleComplete}
            style={styles.button}
            disabled={!selectedCategoryId}
            gradient={true}
          >
            Complete Registration
          </Button>
        </ScrollView>
      </LinearGradient>
      
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.warmGray} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {motivationCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalItem,
                    selectedCategoryId === category.id && styles.selectedModalItem
                  ]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  <Text 
                    style={[
                      styles.modalItemText,
                      selectedCategoryId === category.id && styles.selectedModalItemText
                    ]}
                  >
                    {category.name}
                  </Text>
                  {selectedCategoryId === category.id && (
                    <MaterialCommunityIcons name="check" size={20} color={COLORS.sereneBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Focus Selection Modal */}
      <Modal
        visible={showFocusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFocusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Focus</Text>
              <TouchableOpacity onPress={() => setShowFocusModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.warmGray} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {getFocusOptions().map((focus) => (
                <TouchableOpacity
                  key={focus.id}
                  style={[
                    styles.modalItem,
                    selectedFocus === focus.id && styles.selectedModalItem
                  ]}
                  onPress={() => handleSelectFocus(focus.id)}
                >
                  <Text 
                    style={[
                      styles.modalItemText,
                      selectedFocus === focus.id && styles.selectedModalItemText
                    ]}
                  >
                    {focus.name}
                  </Text>
                  {selectedFocus === focus.id && (
                    <MaterialCommunityIcons name="check" size={20} color={COLORS.sereneBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    marginBottom: SPACING.lg,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  preferenceSection: {
    marginBottom: SPACING.md,
  },
  preferenceItem: {
    paddingVertical: SPACING.xs,
  },
  listItemTitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.warmGray,
  },
  listItemDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.mutedLilac,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  divider: {
    backgroundColor: COLORS.paleRose,
    height: 1,
  },
  button: {
    marginTop: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.softWhite,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    paddingBottom: SPACING.xl,
    ...SHADOWS.heavy,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.paleRose,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
  },
  modalContent: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.paleRose,
  },
  selectedModalItem: {
    backgroundColor: COLORS.softLavender,
  },
  modalItemText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.warmGray,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  selectedModalItemText: {
    color: COLORS.sereneBlue,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
});

export default CategorySelectionScreen; 