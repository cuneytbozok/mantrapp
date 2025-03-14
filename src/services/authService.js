// Authentication service for Mantra App using Clerk
import AsyncStorage from '@react-native-async-storage/async-storage';
import useClerkAuth from '../hooks/useClerkAuth';

// Storage keys
const USER_PREFERENCES_KEY = '@mantra_app_user_preferences';

// Create a singleton instance of the auth service
let authInstance = null;

class AuthService {
  constructor() {
    if (authInstance) {
      return authInstance;
    }
    
    // This will be initialized later when the hook is available
    this.clerkAuth = null;
    authInstance = this;
  }

  // Initialize with the Clerk auth hook
  initialize(clerkAuthHook) {
    this.clerkAuth = clerkAuthHook;
  }

  /**
   * Login with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
    if (!this.clerkAuth) {
      throw new Error('Auth service not initialized');
    }
    
    try {
      // Use Clerk to sign in
      const userData = await this.clerkAuth.login(email, password);
      
      // Get any stored preferences
      const storedPreferences = await this.getUserPreferences();
      
      // Return combined user data with preferences
      return {
        ...userData,
        ...storedPreferences,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} Created user data
   */
  async register(userData) {
    if (!this.clerkAuth) {
      throw new Error('Auth service not initialized');
    }
    
    try {
      console.log('Registering user with data:', JSON.stringify({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        // Don't log password for security reasons
      }));
      
      // Use Clerk to sign up
      const newUser = await this.clerkAuth.register(userData);
      
      // Store initial preferences if provided
      const preferences = {
        categories: userData.categories || [],
        focus: userData.focus || null,
        notificationTime: userData.notificationTime || null,
      };
      
      await this.saveUserPreferences(preferences);
      
      // Return combined user data with preferences
      return {
        ...newUser,
        ...preferences,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Check if user is already logged in
   * @returns {Promise<Object|null>} User data if logged in, null otherwise
   */
  async checkAuth() {
    if (!this.clerkAuth) {
      console.log('checkAuth: Auth service not initialized');
      throw new Error('Auth service not initialized');
    }
    
    try {
      // Check if Clerk is loaded
      if (!this.clerkAuth.isLoaded) {
        console.log('checkAuth: Clerk auth not loaded yet');
        return null;
      }
      
      // Check if user is authenticated with Clerk
      if (!this.clerkAuth.isAuthenticated) {
        console.log('checkAuth: User is not authenticated');
        return null;
      }
      
      // Get current user from Clerk
      const userData = this.clerkAuth.getCurrentUser();
      
      console.log('checkAuth: Retrieved user data from Clerk:', JSON.stringify(userData));
      
      if (!userData) {
        console.log('checkAuth: No user data returned from getCurrentUser');
        return null;
      }
      
      // Log specific fields to debug
      console.log('checkAuth: User name and surname:', JSON.stringify({
        name: userData.name,
        surname: userData.surname
      }));
      
      // Get any stored preferences
      const storedPreferences = await this.getUserPreferences();
      
      // Ensure we have the name and surname from Clerk
      if (!userData.name && this.clerkAuth.user?.firstName) {
        console.log('checkAuth: Updating name from Clerk user data');
        userData.name = this.clerkAuth.user.firstName;
      }
      
      if (!userData.surname && this.clerkAuth.user?.lastName) {
        console.log('checkAuth: Updating surname from Clerk user data');
        userData.surname = this.clerkAuth.user.lastName;
      }
      
      // Return combined user data with preferences
      const result = {
        ...userData,
        ...storedPreferences,
      };
      
      console.log('checkAuth: Returning combined user data:', JSON.stringify(result));
      
      return result;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return null;
    }
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    if (!this.clerkAuth) {
      throw new Error('Auth service not initialized');
    }
    
    try {
      // Sign out with Clerk
      await this.clerkAuth.logout();
      
      // Clear stored preferences
      await AsyncStorage.removeItem(USER_PREFERENCES_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {Object} updateData Object containing category, focus, and notificationTime
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserPreferences(updateData) {
    if (!this.clerkAuth) {
      throw new Error('Auth service not initialized');
    }
    
    try {
      // Check if user is authenticated
      if (!this.clerkAuth.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      // Get current user from Clerk
      const userData = this.clerkAuth.getCurrentUser();
      
      if (!userData) {
        throw new Error('User data not available');
      }
      
      // Get current preferences
      const currentPreferences = await this.getUserPreferences();
      
      // Update preferences
      const updatedPreferences = {
        ...currentPreferences,
        ...updateData,
      };
      
      // Save updated preferences
      await this.saveUserPreferences(updatedPreferences);
      
      // Return combined user data with updated preferences
      return {
        ...userData,
        ...updatedPreferences,
      };
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Get user preferences from AsyncStorage
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences() {
    try {
      const preferencesData = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      return preferencesData ? JSON.parse(preferencesData) : {
        categories: [],
        focus: null,
        notificationTime: null,
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        categories: [],
        focus: null,
        notificationTime: null,
      };
    }
  }

  /**
   * Save user preferences to AsyncStorage
   * @param {Object} preferences User preferences
   * @returns {Promise<void>}
   */
  async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Export individual methods for compatibility with existing code
export const login = (email, password) => authService.login(email, password);
export const register = (userData) => authService.register(userData);
export const checkAuth = () => authService.checkAuth();
export const logout = () => authService.logout();
export const updateUserPreferences = (updateData) => authService.updateUserPreferences(updateData); 