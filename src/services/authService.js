// Authentication service for Mantra App
// This is a mock service for demo purposes
// In a real app, this would make API calls to a backend server

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    categories: [1],
    focus: 'productivity',
    notificationTime: '08:00 AM',
  },
  {
    id: '2',
    name: 'Jane',
    surname: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    categories: [2],
    focus: 'patience',
    notificationTime: '09:30 PM',
  },
];

// Storage keys
const USER_STORAGE_KEY = '@mantra_app_user';

/**
 * Login with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Object>} User data without password
 */
export const login = async (email, password) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user with matching email and password
  const user = MOCK_USERS.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Store user data in AsyncStorage (without password)
  const userData = { ...user };
  delete userData.password;
  
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  
  return userData;
};

/**
 * Register a new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Created user data without password
 */
export const register = async (userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  const emailExists = MOCK_USERS.some(
    user => user.email.toLowerCase() === userData.email.toLowerCase()
  );
  
  if (emailExists) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser = {
    id: String(MOCK_USERS.length + 1),
    ...userData,
  };
  
  // In a real app, we would save this to a database
  // For demo, we'll just return the user
  
  // Store user data in AsyncStorage (without password)
  const storedUserData = { ...newUser };
  delete storedUserData.password;
  
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(storedUserData));
  
  return storedUserData;
};

/**
 * Check if user is already logged in
 * @returns {Promise<Object|null>} User data if logged in, null otherwise
 */
export const checkAuth = async () => {
  const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Update user category and notification time
 * @param {Object} updateData Object containing category and notificationTime
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserPreferences = async (updateData) => {
  // Get current user data
  const userData = await checkAuth();
  
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  // Update user preferences
  const updatedUser = {
    ...userData,
    ...updateData,
  };
  
  // Save updated user data
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  
  return updatedUser;
}; 