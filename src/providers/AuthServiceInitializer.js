import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { authService } from '../services/authService';
import useClerkAuth from '../hooks/useClerkAuth';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../redux/slices/authSlice';
import { COLORS } from '../constants/theme';

// This component initializes the auth service with the Clerk hook
const AuthServiceInitializer = ({ children }) => {
  const clerkAuth = useClerkAuth();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Only initialize if Clerk auth is loaded
    if (clerkAuth.isLoaded) {
      // Log the Clerk auth state
      console.log('AuthServiceInitializer - Clerk auth state:', {
        isAuthenticated: clerkAuth.isAuthenticated,
        isLoaded: clerkAuth.isLoaded,
        hasError: !!clerkAuth.error
      });
      
      // Initialize the auth service with the Clerk hook
      authService.initialize(clerkAuth);
      console.log('AuthServiceInitializer - Auth service initialized with Clerk hook');
      
      // Set initialization flag
      setIsInitialized(true);
      
      // Check auth status after initialization
      setTimeout(() => {
        dispatch(checkAuthStatus());
      }, 500);
    }
  }, [clerkAuth, clerkAuth.isLoaded, dispatch]);
  
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.sereneBlue} />
        <Text style={{ marginTop: 10, color: COLORS.warmGray }}>Initializing...</Text>
      </View>
    );
  }
  
  return <>{children}</>;
};

export default AuthServiceInitializer; 