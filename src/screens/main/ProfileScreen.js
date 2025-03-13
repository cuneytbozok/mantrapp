import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { Text, Card, Avatar, Divider, List, useTheme, Button as PaperButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { logoutUser, updateUserPreferences } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Header from '../../components/Header';
import Button from '../../components/Button';
import GradientCard from '../../components/GradientCard';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, motivationCategories, selectedCategory, notificationTime } = useSelector((state) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory || null);
  const [selectedFocus, setSelectedFocus] = useState(user?.focus || null);
  const [selectedTime, setSelectedTime] = useState(() => {
    if (notificationTime) {
      const [hours, minutes] = notificationTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date;
    }
    return new Date();
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [preferencesChanged, setPreferencesChanged] = useState(false);
  
  // Check if preferences have changed
  useEffect(() => {
    const categoryChanged = selectedCategoryId !== selectedCategory;
    const focusChanged = selectedFocus !== user?.focus;
    
    let timeChanged = false;
    if (notificationTime) {
      const currentTimeStr = formatTime(selectedTime);
      timeChanged = currentTimeStr !== notificationTime;
    }
    
    setPreferencesChanged(categoryChanged || timeChanged || focusChanged);
  }, [selectedCategoryId, selectedTime, selectedCategory, notificationTime, selectedFocus, user?.focus]);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => dispatch(logoutUser()),
          style: "destructive"
        }
      ]
    );
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const savePreferences = () => {
    if (preferencesChanged) {
      dispatch(updateUserPreferences({
        categories: [selectedCategoryId],
        focus: selectedFocus || 'general',
        notificationTime: formatTime(selectedTime),
      }));
      Alert.alert("Success", "Your preferences have been updated.");
    }
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
      <Header title="Profile" useGradient={true} />
      
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <GradientCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <LinearGradient
                colors={gradients.button}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Avatar.Icon 
                  size={80} 
                  icon="account" 
                  style={styles.avatar}
                  color={COLORS.softWhite}
                  backgroundColor="transparent"
                />
              </LinearGradient>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user?.name} {user?.surname}</Text>
                <Text style={styles.email}>{user?.email}</Text>
              </View>
            </View>
          </GradientCard>
          
          <GradientCard style={styles.preferencesCard}>
            <Card.Title 
              title={<Text style={styles.cardTitle}>Mantra Preferences</Text>}
            />
            <Card.Content>
              <View style={styles.preferenceSection}>
                <List.Item
                  title={<Text style={styles.listItemTitle}>Category</Text>}
                  description={<Text style={styles.listItemDescription}>{getCategoryName(selectedCategoryId)}</Text>}
                  left={props => <List.Icon {...props} icon="tag" color={COLORS.sereneBlue} />}
                  right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                  onPress={() => setShowCategoryModal(true)}
                  style={styles.preferenceItem}
                />
                
                <Divider style={styles.divider} />
                
                {selectedCategoryId ? (
                  <>
                    <List.Item
                      title={<Text style={styles.listItemTitle}>Focus</Text>}
                      description={<Text style={styles.listItemDescription}>{getFocusName(selectedFocus)}</Text>}
                      left={props => <List.Icon {...props} icon="target" color={COLORS.sereneBlue} />}
                      right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                      onPress={() => setShowFocusModal(true)}
                      style={styles.preferenceItem}
                    />
                    
                    <Divider style={styles.divider} />
                  </>
                ) : null}
                
                <List.Item
                  title={<Text style={styles.listItemTitle}>Notification Time</Text>}
                  description={<Text style={styles.listItemDescription}>{`Daily mantras at ${formatTime(selectedTime)}`}</Text>}
                  left={props => <List.Icon {...props} icon="clock" color={COLORS.sereneBlue} />}
                  right={props => <List.Icon {...props} icon="chevron-down" color={COLORS.sereneBlue} />}
                  onPress={() => setShowTimePicker(true)}
                  style={styles.preferenceItem}
                />
                
                {showTimePicker ? (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleTimeChange}
                  />
                ) : null}
              </View>
              
              {preferencesChanged ? (
                <Button 
                  mode="contained" 
                  onPress={savePreferences}
                  style={styles.saveButton}
                  gradient={true}
                >
                  <Text>Save Changes</Text>
                </Button>
              ) : null}
            </Card.Content>
          </GradientCard>
          
          <GradientCard style={styles.settingsCard}>
            <Card.Title 
              title={<Text style={styles.cardTitle}>App Settings</Text>}
            />
            <Card.Content>
              <List.Item
                title={<Text style={styles.listItemTitle}>Notifications</Text>}
                description={<Text style={styles.listItemDescription}>Receive daily mantra notifications</Text>}
                left={props => <List.Icon {...props} icon="bell" color={COLORS.sereneBlue} />}
                right={props => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    color={COLORS.sereneBlue}
                  />
                )}
                style={styles.preferenceItem}
              />
              
              <Divider style={styles.divider} />
              
              <List.Item
                title={<Text style={styles.listItemTitle}>Dark Mode</Text>}
                description={<Text style={styles.listItemDescription}>Use dark theme</Text>}
                left={props => <List.Icon {...props} icon="theme-light-dark" color={COLORS.sereneBlue} />}
                right={props => (
                  <Switch
                    value={darkModeEnabled}
                    onValueChange={toggleDarkMode}
                    color={COLORS.sereneBlue}
                  />
                )}
                style={styles.preferenceItem}
              />
            </Card.Content>
          </GradientCard>
          
          <GradientCard style={styles.accountCard}>
            <Card.Title 
              title={<Text style={styles.cardTitle}>Account</Text>}
            />
            <Card.Content>
              <List.Item
                title="Edit Profile"
                titleStyle={styles.listItemTitle}
                left={props => <List.Icon {...props} icon="account-edit" color={COLORS.sereneBlue} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.sereneBlue} />}
                style={styles.accountItem}
              />
              
              <Divider style={styles.divider} />
              
              <List.Item
                title={<Text style={styles.listItemTitle}>Change Password</Text>}
                left={props => <List.Icon {...props} icon="lock" color={COLORS.sereneBlue} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.sereneBlue} />}
                style={styles.accountItem}
                onPress={() => navigation.navigate('ChangePassword')}
              />
              
              <Divider style={styles.divider} />
              
              <List.Item
                title={<Text style={[styles.listItemTitle, styles.logoutText]}>Logout</Text>}
                left={props => <List.Icon {...props} icon="logout" color={COLORS.error} />}
                onPress={handleLogout}
                style={styles.accountItem}
              />
            </Card.Content>
          </GradientCard>
          
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
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
                    selectedCategoryId === category.id && styles.selectedModalItem,
                  ]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  <Text style={[
                    styles.modalItemText,
                    selectedCategoryId === category.id && styles.selectedModalItemText,
                  ]}>
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
                    selectedFocus === focus.id && styles.selectedModalItem,
                  ]}
                  onPress={() => handleSelectFocus(focus.id)}
                >
                  <Text style={[
                    styles.modalItemText,
                    selectedFocus === focus.id && styles.selectedModalItemText,
                  ]}>
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
  profileCard: {
    marginBottom: SPACING.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  profileInfo: {
    marginLeft: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  preferencesCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
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
  saveButton: {
    marginTop: SPACING.md,
  },
  settingsCard: {
    marginBottom: SPACING.md,
  },
  settingItem: {
    paddingVertical: SPACING.xs,
  },
  accountCard: {
    marginBottom: SPACING.md,
  },
  accountItem: {
    paddingVertical: SPACING.xs,
  },
  logoutText: {
    color: COLORS.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  versionText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.mutedLilac,
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

export default ProfileScreen; 